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
const clipped = (value: string, limit = 900) =>
  value.length > limit
    ? `${value.slice(0, limit - 30)}… (full details attached)`
    : value;

export async function sendContactInquiry(
  input: ContactInput,
  sourcePath: "/" | "/contact" | "/quote" | "/api/contact" = "/api/contact",
) {
  const url = contactWebhookUrl();
  const quote = calculateQuote(
    input.services,
    input.visitType,
    input.area,
    input.packages,
  );
  const timestamp = new Date().toISOString();
  const simple =
    input.haircutCount !== undefined || input.colorCount !== undefined;
  const serviceText = simple
    ? `People wanting haircuts: ${input.haircutCount ?? 0}\nPeople wanting color: ${input.colorCount ?? 0}\nA person receiving both appears in both counts. Services and personal quote to discuss.`
    : [
        ...quote.items.map(
          (item) =>
            `${item.member ? `${item.member}: ` : ""}${item.name} × ${item.quantity}${item.unit === "row" ? " rows" : ""}: ${item.subtotalCents === null ? "consultation / price pending" : `${item.pricingKind === "from" ? "from " : ""}${formatMoney(item.subtotalCents)}`}`,
        ),
        ...quote.packageItems.map(
          (item) =>
            `${item.name} × ${item.quantity}: ${formatMoney(item.subtotalCents)} — ${item.inclusions}${item.needsConfirmation ? " (inclusions need confirmation)" : ""}`,
        ),
      ].join("\n") || "General inquiry; services to discuss";
  const status =
    input.intent === "consultation"
      ? "Consultation inquiry"
      : input.intent === "interest"
        ? "Interest inquiry"
        : "Appointment request";
  const format =
    input.visitType === "house"
      ? "House call"
      : input.visitType === "salon"
        ? "Future salon booth"
        : "Special event / location to discuss";
  const totals = simple
    ? "Personal quote to discuss. No price or travel fee has been calculated. Date, time, location, and pricing must be confirmed with the customer."
    : `${quote.hasStartingPrices ? "Starting service subtotal" : "Known service subtotal"}: ${formatMoney(quote.knownSubtotalCents)}\nTravel: ${quote.travelFeeCents === null ? "to be confirmed" : "not applicable"}\n${quote.hasUnpricedServices ? "Consultation-only services excluded from numeric subtotal.\n" : ""}${quote.hasUnresolvedPackage ? "Mommy & Me women’s cut variant needs confirmation.\n" : ""}${quote.extensionHairExcluded ? "Extension hair is priced separately.\n" : ""}Minimum status: ${quote.minimum.status}\nCatalog version: ${quote.catalogVersion}\nThis is a planning estimate, not an accepted booking.`;
  const consent = `${input.smsConsent ? "YES — inquiry follow-up only" : "NO — do not send texts; reply by email"}\nRecorded: ${timestamp}\nDisclosure version: ${simple && !input.smsConsent ? "not shown (email-only form)" : smsConsentVersion}\nSource: ${business.url}${sourcePath}\nMarketing permission: none`;
  const fullDetails = [
    `${status} — NOT a confirmed appointment`,
    `Received: ${timestamp}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not supplied"}`,
    `Format: ${format}`,
    `Topic: ${input.topic}`,
    `Area: ${input.area || "To discuss"}`,
    ...(input.neighborhoodHouseholds
      ? [`Interested households: ${input.neighborhoodHouseholds}`]
      : []),
    ...(input.preferredDate
      ? [`Date preference only, not reserved: ${input.preferredDate}`]
      : []),
    `Preferred time (Mountain Time): ${input.preferredTime === "specific" ? input.exactTime : input.preferredTime}`,
    `Visit address / venue: ${input.address || "To discuss"}`,
    "",
    "CUSTOMER SERVICE WISH LIST",
    serviceText,
    "",
    totals,
    "",
    "CUSTOMER MESSAGE",
    input.message || "Not supplied",
    "",
    "SMS CONSENT",
    consent,
    ...(input.smsConsent ? ["Disclosure shown:", smsConsentText] : []),
  ].join("\n");
  const fields = [
    {
      name: "Name",
      value: clipped(escapeDiscord(input.name), 500),
      inline: true,
    },
    {
      name: "Email",
      value: clipped(escapeDiscord(input.email), 600),
      inline: true,
    },
    {
      name: "Phone",
      value: escapeDiscord(input.phone || "Not supplied"),
      inline: true,
    },
    {
      name: "Inquiry setting",
      value: clipped(
        escapeDiscord(
          `${format}\n${input.area || "Area to discuss"}\nTopic: ${input.topic}${input.neighborhoodHouseholds ? ` / ${input.neighborhoodHouseholds} interested households` : ""}`,
        ),
        500,
      ),
    },
    {
      name: "Visit preferences",
      value: escapeDiscord(
        `Date: ${input.preferredDate || "Flexible"}\nTime (Mountain Time): ${input.preferredTime === "specific" ? input.exactTime : input.preferredTime}\nAddress / venue: see private attachment`,
      ),
    },
    {
      name: "Service wish list",
      value: clipped(escapeDiscord(serviceText), 900),
    },
    { name: "Planning summary", value: clipped(escapeDiscord(totals), 800) },
    { name: "SMS consent", value: clipped(escapeDiscord(consent), 800) },
    ...(input.smsConsent
      ? [
          {
            name: "Consent disclosure shown",
            value: clipped(escapeDiscord(smsConsentText), 800),
          },
        ]
      : []),
  ];
  const payload = {
    content: `New HairnThere ${status.toLowerCase()}. Customer-provided content is attached. No appointment is reserved or accepted by this notification.`,
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: status,
        description: clipped(
          escapeDiscord(input.message || "No additional message supplied."),
          1100,
        ),
        fields,
        timestamp,
        color: 0x4b2e4f,
        footer: {
          text: simple
            ? "Complete details and address in the private attachment. Follow up with the customer to confirm the visit and quote."
            : "Complete details in the attached text file. Service prices recalculated by the server.",
        },
      },
    ],
  };
  // A bounded preview stays below Discord's embed limits. The attachment preserves
  // all 60 permitted service lines without truncating the original inquiry.
  const form = new FormData();
  form.set("payload_json", JSON.stringify(payload));
  form.set(
    "files[0]",
    new Blob([fullDetails], { type: "text/plain;charset=utf-8" }),
    "hairnthere-inquiry.txt",
  );
  try {
    const response = await fetch(url, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Discord rejected the inquiry.");
    const confirmation: { id?: string } = await response.json();
    if (!confirmation.id) throw new Error("Missing delivery acknowledgement.");
  } catch {
    throw new InquiryDeliveryError("Inquiry delivery could not be confirmed.");
  }
}
