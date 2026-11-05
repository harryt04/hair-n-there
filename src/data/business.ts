export const business = {
  name: "HairnThere",
  tagline: "Great Hair Travels.",
  owner: "Elisabeth",
  url: "https://hairnthere.com",
  cardDestination: "https://hairnthere.com/",
  cardWebsiteLabel: "hairnthere.com",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/hairnthere/",
  portfolioSourceUrl: "https://www.instagram.com/justbeyou_hair/",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
  serviceArea: "Suncrest, Draper · Highland · Alpine & surrounding communities",
} as const;

export const smsConsentVersion = "2026-11-03";
export const smsConsentText =
  "I agree to receive HairnThere texts about my inquiry and appointment coordination, including automated follow-up. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Optional; not a condition of purchase or submitting this form.";

export const phoneContactConsentVersion = "2026-11-05";
export const phoneContactConsentText =
  "By providing a phone number, you’re choosing calls or texts from Elisabeth or her team about your appointment inquiry and appointment confirmations, now or for future appointments. No marketing or unrelated messages. We never sell your contact information. You can ask us to stop calling or texting at any time. Message and data rates may apply. Prefer email? Leave your phone number blank and provide an email address instead.";
