import { business } from "@/data/business";
import { contactSchema } from "@/lib/validation";
import { checkContactRateLimit } from "@/lib/rate-limit";
import {
  contactWebhookUrl,
  InquiryConfigurationError,
  sendContactInquiry,
} from "@/lib/discord";

const MAX_BODY_BYTES = 16_384;

class BodyError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function readBoundedJson(request: Request) {
  const declared = request.headers.get("content-length");
  if (
    declared &&
    (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES)
  )
    throw new BodyError("Please keep your inquiry under 16 KB.", 413);
  if (!request.body)
    throw new BodyError("Please include your inquiry details.", 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new BodyError("The request took too long. Please try again.", 408),
        ),
      5000,
    );
  });
  try {
    while (true) {
      const { value, done } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES)
        throw new BodyError("Please keep your inquiry under 16 KB.", 413);
      chunks.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let position = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, position);
      position += chunk.byteLength;
    }
    try {
      return JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(buffer),
      );
    } catch {
      throw new BodyError("Please send a valid inquiry.", 400);
    }
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => undefined);
  }
}

const failure = (
  error: string,
  status: number,
  headers?: Record<string, string>,
) =>
  Response.json(
    { success: false, error },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = new Set([
    new URL(business.url).origin,
    "https://www.hairnthere.com",
    new URL(request.url).origin,
  ]);
  if (
    (origin && !allowedOrigins.has(origin)) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return failure(
      "Please submit your inquiry from the HairnThere website.",
      403,
    );
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return failure("Please submit your inquiry as JSON.", 415);
  try {
    const rate = await checkContactRateLimit(request);
    if (!rate.allowed)
      return failure(
        "You have sent several inquiries recently. Please wait a little before trying again.",
        429,
        { "Retry-After": String(rate.retryAfter) },
      );
    const body = await readBoundedJson(request);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: "Please check the highlighted details and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (parsed.data.website)
      return failure(
        "We couldn’t accept this inquiry. Please clear autofilled website details and try again.",
        400,
      );
    contactWebhookUrl();
    let sourcePath: "/contact" | "/quote" | "/api/contact" = "/api/contact";
    try {
      const referrer = new URL(request.headers.get("referer") || "");
      if (
        allowedOrigins.has(referrer.origin) &&
        (referrer.pathname === "/contact" || referrer.pathname === "/quote")
      )
        sourcePath = referrer.pathname;
    } catch {
      /* Missing or invalid referrer: record the known receiving endpoint. */
    }
    await sendContactInquiry(parsed.data, sourcePath);
    return Response.json(
      {
        success: true,
        message:
          "Your inquiry is with HairnThere. Elisabeth can follow up to confirm the details and availability.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof BodyError) return failure(error.message, error.status);
    if (error instanceof InquiryConfigurationError)
      return failure(
        "Online inquiries aren’t available right now. Please try again later or use the contact details on this website.",
        503,
      );
    // Never log customer input, webhook URLs, provider response bodies, or credentials.
    return failure(
      "We couldn’t confirm delivery of your inquiry. Please try again later; your appointment is not yet booked.",
      503,
    );
  }
}
