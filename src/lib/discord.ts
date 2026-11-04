import { business, smsConsentText, smsConsentVersion } from "@/data/business";
import { calculateQuote, formatMoney } from "@/lib/quote";
import type { ContactInput } from "@/lib/validation";

export class InquiryDeliveryError extends Error {}
export class InquiryConfigurationError extends Error {}

export function contactWebhookUrl() {
  const value =
    process.env.VERCEL_ENV === "preview"
      ? process.env.DISCORD_PREVIEW_WEBHOOK_URL
      : process.env.DISCORD_CONTACT_WEBHOOK_URL;
  if (!value)
    throw new InquiryConfigurationError(
      "Inquiry delivery is not configured for this environment.",
    );
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !["discord.com", "discordapp.com"].includes(url.hostname) ||
      !/^\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+$/.test(url.pathname)
    )
      throw new Error("Invalid webhook.");
    url.searchParams.set("wait", "true");
    return url;
  } catch {
    throw new InquiryConfigurationError(
      "Inquiry delivery configuration is invalid.",
    );
  }
}

const escapeDiscord = (value: string) =>
  value.replace(/([\\`*_{}\[\]()<>|~])/g, "\\$1").replace(/@/g, "@\u200b");

export async function sendContactInquiry(
  input: ContactInput,
  sourcePath: "/contact" | "/quote" | "/api/contact" = "/api/contact",
) {
  const url = contactWebhookUrl();
  const quote = calculateQuote(input.services, input.visitType, input.area);
  const timestamp = new Date().toISOString();
  const serviceText = quote.items.length
    ? quote.items
        .map(
          (item) =>
            `${item.name} × ${item.quantity}: ${item.subtotalCents === null ? "to be confirmed" : formatMoney(item.subtotalCents)}`,
        )
        .join("\n")
    : "General inquiry; services to discuss";
  const fields = [
    { name: "Name", value: escapeDiscord(input.name), inline: true },
    { name: "Email", value: escapeDiscord(input.email), inline: true },
    {
      name: "Phone",
      value: escapeDiscord(input.phone || "Not supplied"),
      inline: true,
    },
    {
      name: "Appointment",
      value: `${input.visitType === "house" ? "House call" : "Salon visit"}\n${escapeDiscord(input.area || "Area to discuss")}\nPreferred date: ${escapeDiscord(input.preferredDate || "Flexible / not supplied")}`,
    },
    { name: "Services", value: serviceText },
    {
      name: "Travel / total",
      value: `${quote.travelFeeCents === null ? "Travel fee to be confirmed" : "No house-call travel fee"}\n${quote.totalCents === null ? "Final price to be confirmed by Elisabeth" : formatMoney(quote.totalCents)}`,
    },
    {
      name: "SMS consent",
      value: `${input.smsConsent ? "YES — inquiry/appointment follow-up only" : "NO — do not send texts; reply by email"}\nRecorded: ${timestamp}\nDisclosure version: ${smsConsentVersion}\nSource: ${business.url}${sourcePath}\nMarketing permission: none`,
    },
    { name: "Consent disclosure shown", value: smsConsentText },
  ];
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          "New HairnThere appointment inquiry. Customer-provided details are below.",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "Appointment inquiry",
            description: input.message
              ? escapeDiscord(input.message)
              : "No additional message supplied.",
            fields,
            timestamp,
            color: 0x4b2e4f,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Discord rejected the inquiry.");
    // wait=true returns the created Message, rather than an unacknowledged 204 response.
    const confirmation: { id?: string } = await response.json();
    if (!confirmation.id) throw new Error("Missing delivery acknowledgement.");
  } catch {
    throw new InquiryDeliveryError("Inquiry delivery could not be confirmed.");
  }
}
