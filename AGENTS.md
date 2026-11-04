# Working on HairnThere

## Product decisions

Build **Scenic Journey**: the approved mountain-led design specified in `docs/elisabeth-revision-plan.md`, supported by `docs/inspiration.png`. Local `.lavish/` review artifacts are optional and ignored by Git. Use `public/brand/logo.png` as the current logo; preserve the original root `logo.png` as an archive. Keep brand tokens in `src/app/globals.css`, Playfair Display headings, Montserrat body type, and light/dark themes. Spell the neighborhood **Suncrest**, in Draper, Utah.

Use `docs/elisabeth-revision-plan.md` when changing the catalog, family planner, travel policy, service availability, or Subaru motion. It records supplied business rules and unresolved decisions; implemented data files are the authority for current application behavior. Earlier concepts in `setup-plan.md` and `design-direction.md` are historical where superseded.

## Working process

1. Read the files in the affected flow and the relevant bundled Next.js guide under `node_modules/next/dist/docs/` before changing framework APIs. This repository uses Next.js 16 with Cache Components; explicit route `runtime` configuration is incompatible with that setting. Preserve the Tailwind Turbopack rule’s CSS-module exclusion; applying its loader to modules silently removes their class exports.
2. Keep shared data/types agreed before splitting related work among agents. Give each agent distinct files; integrate dependent API, catalog, and UI changes together.
3. Finish with the relevant local commands in `package.json`: lint, typecheck, and production build for application changes. Manually inspect affected calculation/error paths. Report unavailable configuration honestly.

Harry explicitly chose **no automated test suites, test runners, pull request process, GitHub Actions, or Docker pipeline**. Use local verification and Vercel’s native Git deployments. Do not commit, push, deploy, or activate a paid service unless requested.

## Business rules that must survive changes

- `src/data/availability.ts` owns service-location availability. UI and the contact endpoint consume the same policy. All appointment acceptance is inactive; current forms collect consultations/interest only. Reject forged appointment requests on the server. A design approval is not approval to activate house-call, booth, event, or vehicle-salon services.
- Keep client homes, salon booths, off-site events, and an equipped vehicle salon distinct. The Subaru is brand artwork, not an offered vehicle-based salon. Location/licensing confirmation is an external business prerequisite; do not invent legal conclusions or credentials.
- `src/data/services.ts`, `src/data/packages.ts`, and `src/lib/quote.ts` own prices and calculation. Preserve integer cents, starting-price markers, per-row units, consultation exclusions, and extension hair priced separately. Recompute on the server from validated IDs/quantities; browser totals and availability are untrusted.
- Family packages are charged once; their included cuts are not inserted as additional charged lines. Additional services are explicitly additional. Mommy & Me includes the women’s haircut + blow-dry and one child’s cut, as confirmed by Harry.
- The house-call minimum is $60 in services before travel. Show the shortfall; do not create a minimum surcharge. Convenience fees apply once per household, not per person. Neighborhood-day reductions need a custom quote.
- Travel bands are planning information. Without approved routing/origin configuration, actual travel stays pending. Keep a private origin and provider credentials server-only; never infer driving time from a city label or straight-line distance.

## UI and content

Use existing shadcn components and inspect their generated APIs: this preset uses **Base UI**, with `render` and `nativeButton={false}` for button-styled links, not `asChild`.

Keep the Subaru decorative, in reserved scenic bands, driven by normal scroll with passive listeners/requestAnimationFrame and cleanup. Reduced motion and no-JavaScript states leave a parked car; forms and reading never depend on animation. Avoid scroll hijacking and overlays across controls.

Keep all service-menu content server rendered. Preserve semantic headings, keyboard access, associated form errors, mobile layouts, and consent links. Use approved biography/portfolio details only; temporary stock is labeled inspiration, never Elisabeth’s work or a before/after pair. Public Instagram is `@hairnthere`; import source is `@justbeyou_hair`.

## Data handling

Preserve the contact endpoint’s bounded input, rate limiting, consent validation, escaped Discord content, disabled mentions, and acknowledgement-before-success behavior. Preview deployments use their own webhook; never fall back to the production destination. SMS opt-in is optional and unchecked; future SMS needs durable consent/opt-out handling and provider setup. No AI calls/texts are active.

Keep secrets in environment configuration and values out of logs/chat. Analytics receive broad action names, not messages, member labels, addresses, consent records, or contact details. Update Terms/Privacy when actual data handling changes. See the human-facing `README.md` and `.env.example` for configuration and deployment.

Use Next.js icon file conventions in `src/app/` and `scripts/create-brand-assets.mjs` for favicon/app/social exports. Keep the detailed logo for larger placements and the vector H/mountain mark for tiny browser icons; avoid duplicate manual icon metadata.
