export const business = {
  name: "HairnThere",
  tagline: "Great Hair Travels.",
  owner: "Elisabeth",
  url: "https://hairnthere.com",
  cardDestination: "https://www.hairnthere.com/",
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
