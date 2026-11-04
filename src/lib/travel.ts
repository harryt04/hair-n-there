/** Published planning bands; these are not an address-routing result or booking authorization. */
export const travelBands: {
  label: string;
  maxMinutes: number | null;
  feeCents: number | null;
  areaExample: string;
}[] = [
  {
    label: "0–10 minutes",
    maxMinutes: 10,
    feeCents: 2000,
    areaExample: "Very local / Suncrest",
  },
  {
    label: "11–20 minutes",
    maxMinutes: 20,
    feeCents: 3000,
    areaExample: "Nearby / Draper",
  },
  {
    label: "21–30 minutes",
    maxMinutes: 30,
    feeCents: 4000,
    areaExample: "Highland / Alpine area",
  },
  {
    label: "31–45 minutes",
    maxMinutes: 45,
    feeCents: 5500,
    areaExample: "Other areas",
  },
  {
    label: "46–60 minutes",
    maxMinutes: 60,
    feeCents: 7500,
    areaExample: "Longer household visits",
  },
  {
    label: "Over 60 minutes",
    maxMinutes: null,
    feeCents: null,
    areaExample: "Custom quote",
  },
];

/** Planning helper only. Actual fees need a trusted server-side driving-time result. */
export function travelFeeForMinutes(minutes: number): number | null {
  if (!Number.isFinite(minutes) || minutes < 0)
    throw new Error("Driving time must be a finite, non-negative number.");
  const roundedMinutes = Math.ceil(minutes);
  return (
    travelBands.find(
      (band) => band.maxMinutes === null || roundedMinutes <= band.maxMinutes,
    )?.feeCents ?? null
  );
}
