import { createHash, randomUUID } from "node:crypto";

const MAX_LOCAL_KEYS = 2000;

export class RateLimitUnavailableError extends Error {}

type Bucket = {
  /** Mixed into the address hash so buckets never share digests. */
  hashPrefix: string;
  keyPrefix: string;
  maxRequests: number;
  windowSeconds: number;
  windows: Map<string, { count: number; expires: number }>;
};

// The contact bucket's hash prefix, key prefix, and limits are unchanged from
// the original single-purpose limiter so existing Redis windows carry over.
const contactBucket: Bucket = {
  hashPrefix: "hairnthere-contact",
  keyPrefix: "contact-rate",
  maxRequests: 5,
  windowSeconds: 600,
  windows: new Map(),
};

// Availability lookups are read-only and happen as visitors browse months.
const availabilityBucket: Bucket = {
  hashPrefix: "hairnthere-availability",
  keyPrefix: "availability-rate",
  maxRequests: 60,
  windowSeconds: 600,
  windows: new Map(),
};

function clientAddress(request: Request) {
  return process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
    : request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Shared Upstash REST config, or null when neither value is set. */
function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url && !token) return null;
  if (!url || !token)
    throw new RateLimitUnavailableError(
      "Rate limit configuration is incomplete.",
    );
  return { url, token };
}

async function redisCommand(
  config: { url: string; token: string },
  command: string[],
): Promise<unknown> {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(3000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Redis request failed.");
  const data: { result?: unknown; error?: string } = await response.json();
  if (data.error) throw new Error("Redis command failed.");
  return data.result;
}

async function checkRateLimit(request: Request, bucket: Bucket) {
  const rawAddress = clientAddress(request);
  // Avoid storing raw addresses in the limiter or exposing them to notification channels.
  const digest = createHash("sha256")
    .update(`${bucket.hashPrefix}:${rawAddress}`)
    .digest("hex");
  const key = `${bucket.keyPrefix}:${digest}`;
  const redis = redisConfig();
  if (redis) {
    try {
      const script =
        "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return {n, redis.call('TTL', KEYS[1])}";
      const result = await redisCommand(redis, [
        "EVAL",
        script,
        "1",
        key,
        String(bucket.windowSeconds),
      ]);
      if (
        !Array.isArray(result) ||
        !Number.isInteger(result[0]) ||
        !Number.isInteger(result[1])
      )
        throw new Error("Invalid rate limit response.");
      return {
        allowed: result[0] <= bucket.maxRequests,
        retryAfter: Math.max(1, result[1]),
      };
    } catch {
      throw new RateLimitUnavailableError(
        "The shared rate limiter is unavailable.",
      );
    }
  }
  const now = Date.now();
  for (const [localKey, value] of bucket.windows) {
    if (value.expires <= now) bucket.windows.delete(localKey);
  }
  if (!bucket.windows.has(key) && bucket.windows.size >= MAX_LOCAL_KEYS) {
    // Do not evict a live bucket and accidentally reset an existing visitor's limit.
    return { allowed: false, retryAfter: bucket.windowSeconds };
  }
  const window = bucket.windows.get(key) ?? {
    count: 0,
    expires: now + bucket.windowSeconds * 1000,
  };
  window.count += 1;
  bucket.windows.set(key, window);
  return {
    allowed: window.count <= bucket.maxRequests,
    retryAfter: Math.max(1, Math.ceil((window.expires - now) / 1000)),
  };
}

/** Shared Redis limit when configured; bounded process-local fallback is best-effort only on serverless. */
export function checkContactRateLimit(request: Request) {
  return checkRateLimit(request, contactBucket);
}

/** Separate, looser bucket for read-only availability lookups. */
export function checkAvailabilityRateLimit(request: Request) {
  return checkRateLimit(request, availabilityBucket);
}

// ---------------------------------------------------------------------------
// Short-lived mutual exclusion for writing tentative holds.

const MAX_LOCAL_LOCKS = 500;
const localLocks = new Map<string, { token: string; expires: number }>();

export type HeldLock = { release: () => Promise<void> };

/**
 * Acquires `lock:<name>` for at most `ttlSeconds`, or returns null if another
 * request holds it. Uses Redis `SET NX EX` when Upstash is configured and
 * throws RateLimitUnavailableError if Redis is configured but failing (callers
 * fail closed). Without Redis the lock is process-local: it serializes requests
 * within one server process only (see the contact route for the residual race).
 */
export async function acquireLock(
  name: string,
  ttlSeconds: number,
): Promise<HeldLock | null> {
  const key = `lock:${name}`;
  const token = randomUUID();
  const redis = redisConfig();
  if (redis) {
    let result: unknown;
    try {
      result = await redisCommand(redis, [
        "SET",
        key,
        token,
        "NX",
        "EX",
        String(ttlSeconds),
      ]);
    } catch {
      throw new RateLimitUnavailableError("The shared lock is unavailable.");
    }
    if (result !== "OK") return null;
    return {
      release: async () => {
        // Delete only our own token; an expired-and-reacquired lock is someone else's.
        await redisCommand(redis, [
          "EVAL",
          "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end; return 0",
          "1",
          key,
          token,
        ]).catch(() => undefined); // The TTL releases it anyway.
      },
    };
  }
  const now = Date.now();
  for (const [localKey, value] of localLocks) {
    if (value.expires <= now) localLocks.delete(localKey);
  }
  if (localLocks.has(key)) return null;
  // Full table of live locks: refuse rather than evict someone's lock.
  if (localLocks.size >= MAX_LOCAL_LOCKS) return null;
  localLocks.set(key, { token, expires: now + ttlSeconds * 1000 });
  return {
    release: async () => {
      if (localLocks.get(key)?.token === token) localLocks.delete(key);
    },
  };
}
