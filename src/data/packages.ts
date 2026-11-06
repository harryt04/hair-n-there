import type { PackageDefinition } from "@/lib/quote-types";

export const familyPackages: PackageDefinition[] = [
  {
    id: "neighborhood-refresh",
    name: "The Neighborhood Refresh",
    priceCents: 8500,
    inclusions:
      "A fresh haircut, nourishing conditioning treatment, and a beautiful blowout. A little pick-me-up for your hair and your mood.",
    needsConfirmation: false,
  },
  {
    id: "color-cut-combo",
    name: "The Color & Cut Combo",
    priceCents: 11500,
    startingPrice: true,
    inclusions:
      "A root color refresh, haircut, and finished style. Fresh roots, fresh ends, and a whole lot of confidence.",
    needsConfirmation: false,
  },
  {
    id: "family-trim",
    name: "Family Trim",
    priceCents: 8000,
    inclusions: "1 standard men’s haircut + 2 children’s haircuts (ages 0–12).",
    needsConfirmation: false,
  },
  {
    id: "mommy-me",
    name: "Mommy & Me",
    priceCents: 7500,
    inclusions: "1 women’s haircut + blow-dry + 1 child’s haircut (ages 0–12).",
    needsConfirmation: false,
  },
  {
    id: "little-crew",
    name: "Little Crew",
    priceCents: 7000,
    inclusions: "3 children’s haircuts (ages 0–12).",
    needsConfirmation: false,
  },
];
