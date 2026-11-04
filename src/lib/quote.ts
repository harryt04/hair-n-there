export type VisitType = "house" | "salon";
export type ServiceId = "haircut" | "color" | "extensions" | "styling";
export type ServiceSelection = { id: ServiceId; quantity: number };
export const services: {
  id: ServiceId;
  name: string;
  description: string;
  unitPriceCents: number | null;
  consultation: boolean;
}[] = [
  {
    id: "haircut",
    name: "Haircuts",
    description: "A fresh cut, for one or the whole family.",
    unitPriceCents: null,
    consultation: false,
  },
  {
    id: "color",
    name: "Color",
    description: "A personal color plan, starting with a conversation.",
    unitPriceCents: null,
    consultation: true,
  },
  {
    id: "extensions",
    name: "Extensions",
    description: "Length, fullness, and a look that feels like you.",
    unitPriceCents: null,
    consultation: true,
  },
  {
    id: "styling",
    name: "Styling",
    description: "A little something for your next occasion.",
    unitPriceCents: null,
    consultation: false,
  },
];
export function calculateQuote(
  selections: ServiceSelection[],
  visitType: VisitType,
  area: string,
) {
  const items = selections
    .filter((s) => s.quantity > 0)
    .map((selection) => {
      const service = services.find((s) => s.id === selection.id);
      if (
        !service ||
        !Number.isInteger(selection.quantity) ||
        selection.quantity < 1 ||
        selection.quantity > 20
      )
        throw new Error("Invalid service selection");
      return {
        ...selection,
        name: service.name,
        consultation: service.consultation,
        subtotalCents:
          service.unitPriceCents === null
            ? null
            : service.unitPriceCents * selection.quantity,
      };
    });
  const serviceSubtotalCents =
    items.length && items.every((i) => i.subtotalCents !== null)
      ? items.reduce((total, item) => total + (item.subtotalCents ?? 0), 0)
      : null;
  // Fees remain unconfigured until Elisabeth approves actual service-area rules.
  const travelFeeCents = visitType === "salon" ? 0 : null;
  return {
    items,
    serviceSubtotalCents,
    travelFeeCents,
    totalCents:
      serviceSubtotalCents !== null && travelFeeCents !== null
        ? serviceSubtotalCents + travelFeeCents
        : null,
    area,
  };
}
export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
}
