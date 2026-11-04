import type { PackageDefinition } from "@/lib/quote-types";

export const familyPackages: PackageDefinition[] = [
  {
    id: "family-trim",
    name: "Family Trim",
    priceCents: 8500,
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
