// Approved Option D: these are browsing paths, not quotes or bookings.
export const serviceGuideGoals = [
  {
    id: "cut",
    title: "A fresh cut",
    description: "A tidy-up or a new shape.",
    question: "Who’s the refresh for?",
    paths: ["solo", "family"],
  },
  {
    id: "color",
    title: "Color & brightness",
    description: "Roots, highlights, or a new shade.",
    question: "What kind of change?",
    paths: ["roots", "brightness"],
  },
  {
    id: "style",
    title: "Styling or length",
    description: "A finished look or more fullness.",
    question: "What do you have in mind?",
    paths: ["styling", "extensions"],
  },
  {
    id: "unsure",
    title: "Not sure yet",
    description: "A conversation is a great start.",
    question: "",
    paths: [],
  },
] as const;

export const serviceGuidePaths = [
  {
    id: "solo",
    label: "Just me",
    services: ["womens-haircut-blow-dry", "womens-dry-haircut", "mens-haircut"],
    packages: [],
  },
  {
    id: "family",
    label: "Kids or family",
    services: [],
    packages: ["family-trim", "mommy-me", "little-crew"],
  },
  {
    id: "roots",
    label: "Freshen my roots",
    services: ["root-touch-up", "all-over-color"],
    packages: [],
  },
  {
    id: "brightness",
    label: "Add brightness",
    services: ["face-framing-highlights", "partial-highlights", "balayage"],
    packages: [],
  },
  {
    id: "styling",
    label: "Styling",
    services: ["shampoo-blowout", "curls-waves", "simple-braids"],
    packages: [],
  },
  {
    id: "extensions",
    label: "Extensions",
    services: ["extension-consultation", "tape-in-installation"],
    packages: [],
  },
] as const;
