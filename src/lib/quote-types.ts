export type VisitType = "house" | "salon" | "event";
export type InquiryIntent = "consultation" | "interest" | "appointment_request";
export type ServiceId = string;
export type PricingKind =
  "fixed" | "from" | "per_row" | "free_consultation" | "consultation_required";
export type ServiceSelection = {
  id: ServiceId;
  quantity: number;
  member?: string;
};
export type PackageSelection = { id: string; quantity: number };
export type ServiceDefinition = {
  id: string;
  category: string;
  name: string;
  description: string;
  duration: string;
  pricingKind: PricingKind;
  unitPriceCents: number | null;
  unit: "service" | "row";
  consultation: boolean;
};
export type PackageDefinition = {
  id: string;
  name: string;
  priceCents: number;
  startingPrice?: boolean;
  inclusions: string;
  needsConfirmation: boolean;
};
export type QuoteItem = ServiceSelection & {
  name: string;
  pricingKind: PricingKind;
  unit: "service" | "row";
  subtotalCents: number | null;
  consultation: boolean;
};
export type QuotePackageItem = PackageSelection & {
  startingPrice?: boolean;
  name: string;
  inclusions: string;
  subtotalCents: number;
  needsConfirmation: boolean;
};
export type QuoteResult = {
  items: QuoteItem[];
  packageItems: QuotePackageItem[];
  serviceSubtotalCents: number | null;
  knownSubtotalCents: number;
  hasStartingPrices: boolean;
  hasUnpricedServices: boolean;
  hasUnresolvedPackage: boolean;
  extensionHairExcluded: boolean;
  travelFeeCents: number | null;
  totalCents: number | null;
  minimum: {
    requiredCents: number;
    shortfallCents: number;
    status: "met" | "not_met" | "not_applicable" | "needs_confirmation";
  };
  area: string;
  catalogVersion: string;
};
