import { createHash } from "node:crypto";

const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 5;
const MAX_LOCAL_KEYS = 2000;
const localWindows = new Map<string, { count: number; expires: number }>();

export class RateLimitUnavailableError extends Error {}

/** Shared Redis limit when configured; bounded process-local fallback is best-effort only on serverless. */
export async function checkContactRateLimit(request: Request) {
  const rawAddress = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown"
    : request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  // Avoid storing raw addresses in the limiter or exposing them to notification channels.
  const digest = createHash("sha256")
    .update(`hairnthere-contact:${rawAddress}`)
    .digest("hex");
  const key = `contact-rate:${digest}`;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url || token) {
    if (!url || !token)
      throw new RateLimitUnavailableError(
        "Rate limit configuration is incomplete.",
      );
    try {
      const script =
        "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return {n, redis.call('TTL', KEYS[1])}";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          "EVAL",
          script,
          "1",
          key,
          String(WINDOW_SECONDS),
        ]),
        signal: AbortSignal.timeout(3000),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Rate limit request failed.");
      const data: { result?: [number, number]; error?: string } =
        await response.json();
      if (
        !Array.isArray(data.result) ||
        !Number.isInteger(data.result[0]) ||
        !Number.isInteger(data.result[1])
      )
        throw new Error("Invalid rate limit response.");
      return {
        allowed: data.result[0] <= MAX_REQUESTS,
        retryAfter: Math.max(1, data.result[1]),
      };
    } catch {
      throw new RateLimitUnavailableError(
        "The shared rate limiter is unavailable.",
      );
    }
  }
  const now = Date.now();
  for (const [localKey, value] of localWindows) {
    if (value.expires <= now) localWindows.delete(localKey);
  }
  if (!localWindows.has(key) && localWindows.size >= MAX_LOCAL_KEYS) {
    // Do not evict a live bucket and accidentally reset an existing visitor's limit.
    return { allowed: false, retryAfter: WINDOW_SECONDS };
  }
  const bucket = localWindows.get(key) ?? {
    count: 0,
    expires: now + WINDOW_SECONDS * 1000,
  };
  bucket.count += 1;
  localWindows.set(key, bucket);
  return {
    allowed: bucket.count <= MAX_REQUESTS,
    retryAfter: Math.max(1, Math.ceil((bucket.expires - now) / 1000)),
  };
}
