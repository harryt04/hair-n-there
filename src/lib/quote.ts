import { CATALOG_VERSION, services } from "@/data/services";
import { familyPackages } from "@/data/packages";
import type {
  PackageSelection,
  QuoteResult,
  ServiceSelection,
  VisitType,
} from "@/lib/quote-types";

export { services, familyPackages };
export type * from "@/lib/quote-types";

const extensionHairServices = new Set([
  "tape-in-installation",
  "beaded-weft-move-up",
  "extension-installation",
]);

export function calculateQuote(
  selections: ServiceSelection[],
  visitType: VisitType,
  area: string,
  packages: PackageSelection[] = [],
): QuoteResult {
  if (!["house", "salon", "event"].includes(visitType))
    throw new Error("Unknown appointment setting.");
  if (typeof area !== "string" || area.length > 120)
    throw new Error("Please keep the service area under 120 characters.");
  if (!Array.isArray(selections) || selections.length > 60)
    throw new Error("Choose no more than 60 service lines.");
  if (!Array.isArray(packages) || packages.length > familyPackages.length)
    throw new Error("Choose each family package only once.");

  const serviceKeys = new Set<string>();
  const items = selections.map((selection) => {
    if (!selection || typeof selection !== "object")
      throw new Error("Invalid service selection.");
    const service = services.find((service) => service.id === selection.id);
    if (!service)
      throw new Error(
        "This service is not in the current menu. Please choose it again.",
      );
    if (
      !Number.isInteger(selection.quantity) ||
      selection.quantity < 1 ||
      selection.quantity > 20
    )
      throw new Error("Service quantities must be whole numbers from 1 to 20.");
    if (
      selection.member !== undefined &&
      (typeof selection.member !== "string" ||
        selection.member.trim().length > 40)
    )
      throw new Error("Please keep person labels under 40 characters.");
    const member = selection.member?.trim() || undefined;
    const key = JSON.stringify([selection.id, member ?? ""]);
    if (serviceKeys.has(key))
      throw new Error("Combine duplicate service lines for the same person.");
    serviceKeys.add(key);
    return {
      id: service.id,
      quantity: selection.quantity,
      ...(member ? { member } : {}),
      name: service.name,
      pricingKind: service.pricingKind,
      unit: service.unit,
      subtotalCents:
        service.unitPriceCents === null
          ? null
          : service.unitPriceCents * selection.quantity,
      consultation: service.consultation,
    };
  });
  const packageKeys = new Set<string>();
  const packageItems = packages.map((selection) => {
    if (!selection || typeof selection !== "object")
      throw new Error("Invalid family package selection.");
    const familyPackage = familyPackages.find(
      (familyPackage) => familyPackage.id === selection.id,
    );
    if (!familyPackage)
      throw new Error("This family package is not in the current menu.");
    if (
      !Number.isInteger(selection.quantity) ||
      selection.quantity < 1 ||
      selection.quantity > 10
    )
      throw new Error("Package quantities must be whole numbers from 1 to 10.");
    if (packageKeys.has(selection.id))
      throw new Error("Combine duplicate family package selections.");
    packageKeys.add(selection.id);
    return {
      id: familyPackage.id,
      quantity: selection.quantity,
      name: familyPackage.name,
      inclusions: familyPackage.inclusions,
      subtotalCents: familyPackage.priceCents * selection.quantity,
      needsConfirmation: familyPackage.needsConfirmation,
    };
  });

  const hasStartingPrices = items.some((item) => item.pricingKind === "from");
  const hasUnpricedServices = items.some((item) => item.subtotalCents === null);
  const hasUnresolvedPackage = packageItems.some(
    (item) => item.needsConfirmation,
  );
  const knownSubtotalCents =
    items.reduce((sum, item) => sum + (item.subtotalCents ?? 0), 0) +
    packageItems.reduce((sum, item) => sum + item.subtotalCents, 0);
  const serviceSubtotalCents = hasUnpricedServices ? null : knownSubtotalCents;
  // No origin/routing policy is configured. Cities and client-supplied minutes never establish an actual fee.
  const travelFeeCents = visitType === "salon" ? 0 : null;
  const onlyFreeConsultations =
    items.length > 0 &&
    !packageItems.length &&
    items.every((item) => item.pricingKind === "free_consultation");
  let minimumStatus: QuoteResult["minimum"]["status"] = "not_applicable";
  if (visitType === "house") {
    minimumStatus =
      onlyFreeConsultations ||
      hasUnresolvedPackage ||
      (knownSubtotalCents < 6000 && hasUnpricedServices)
        ? "needs_confirmation"
        : knownSubtotalCents >= 6000
          ? "met"
          : "not_met";
  }
  return {
    items,
    packageItems,
    serviceSubtotalCents,
    knownSubtotalCents,
    hasStartingPrices,
    hasUnpricedServices,
    hasUnresolvedPackage,
    extensionHairExcluded: items.some((item) =>
      extensionHairServices.has(item.id),
    ),
    travelFeeCents,
    totalCents:
      serviceSubtotalCents === null ||
      travelFeeCents === null ||
      hasUnresolvedPackage
        ? null
        : serviceSubtotalCents + travelFeeCents,
    minimum: {
      requiredCents: visitType === "house" ? 6000 : 0,
      shortfallCents:
        visitType === "house" ? Math.max(0, 6000 - knownSubtotalCents) : 0,
      status: minimumStatus,
    },
    area: area.trim(),
    catalogVersion: CATALOG_VERSION,
  };
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
}
