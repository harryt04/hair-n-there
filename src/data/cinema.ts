/** Approved artwork is preserved independently of the page-load assignment policy. */
export const cinemaVariants = [
  "alpine-local",
  "powder-day",
  "night-shift",
] as const;
export type CinemaVariant = (typeof cinemaVariants)[number];

export const defaultCinemaVariant: CinemaVariant = "powder-day";

const weightedVariants = [
  { variant: "powder-day", weight: 6 },
  { variant: "alpine-local", weight: 1 },
  { variant: "night-shift", weight: 1 },
] as const;

/** Uniform sample in [0, 1); exclude the previous scene, retaining relative weights. */
export function selectCinemaVariant(
  sample: number,
  previous?: CinemaVariant,
): CinemaVariant {
  const candidates = weightedVariants.filter(
    ({ variant }) => variant !== previous,
  );
  let remaining =
    sample * candidates.reduce((sum, { weight }) => sum + weight, 0);
  for (const { variant, weight } of candidates) {
    remaining -= weight;
    if (remaining < 0) return variant;
  }
  return candidates[candidates.length - 1].variant;
}
