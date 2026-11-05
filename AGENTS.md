# Working on HairnThere

## Product decisions

Build **Mountain Cinema / Powder Day**, the approved gallery-led direction in `docs/mountain-cinema.md`. Preserve all three black 2020 Outback variants with a fresh random assignment on every full page load, including refresh; client navigation keeps the current assignment. This supersedes Scenic Journey’s sidebar; `docs/elisabeth-revision-plan.md` remains the business-rule reference. Local `.lavish/` review artifacts are optional and ignored by Git. Use `public/brand/logo.png` as the current logo; preserve the original root `logo.png` as an archive. Keep brand tokens in `src/app/globals.css`, upright Manrope 600 headings, DM Sans body type, and light/dark themes. Spell the neighborhood **Suncrest**, in Draper, Utah.

Use `docs/elisabeth-revision-plan.md` when changing the catalog, family planner, travel policy, service availability, or Subaru motion. It records supplied business rules and unresolved decisions; implemented data files are the authority for current application behavior. Earlier concepts in `setup-plan.md` and `design-direction.md` are historical where superseded.

## Working process

1. Read the files in the affected flow and the relevant bundled Next.js guide under `node_modules/next/dist/docs/` before changing framework APIs. This repository uses Next.js 16 with Cache Components; explicit route `runtime` configuration is incompatible with that setting. Preserve the Tailwind Turbopack rule’s CSS-module exclusion; applying its loader to modules silently removes their class exports.
2. Keep shared data/types agreed before splitting related work among agents. Give each agent distinct files; integrate dependent API, catalog, and UI changes together.
3. Finish with the relevant local commands in `package.json`: lint, typecheck, and production build for application changes. Manually inspect affected calculation/error paths. Report unavailable configuration honestly.

Harry explicitly chose **no automated test suites, test runners, pull request process, GitHub Actions, or Docker pipeline**. Use local verification and Vercel’s native Git deployments. For this early-stage repository, commit completed, verified changes and push directly to `main` without a PR until Harry changes this policy. This overrides the global Treehouse PR default. Preserve concurrent changes and use ordinary non-force pushes. Main pushes may trigger Vercel’s native Git deployment; separate deployment actions and paid-service activation still require explicit authorization.

## Business rules that must survive changes

- `src/data/availability.ts` owns service-location availability. UI and the contact endpoint consume the same policy. Harry explicitly opened house-call inquiries in the November 5 contact redesign review. The three-stage form collects counts, date/time preferences, address, and email for manual follow-up; it never confirms a booking or price. Salon/event appointment acceptance remains inactive; reject forged requests for those settings on the server. Other service launches require a separate business decision.
- Keep client homes, salon booths, off-site events, and an equipped vehicle salon distinct. The Subaru is brand artwork, not an offered vehicle-based salon. Location/licensing confirmation is an external business prerequisite; do not invent legal conclusions or credentials.
- `src/data/services.ts`, `src/data/packages.ts`, and `src/lib/quote.ts` own prices and calculation. Prices and calculation remain internal; public pages use personal quotes and `/quote` redirects to `/contact`. Preserve integer cents, starting-price markers, per-row units, consultation exclusions, and extension hair priced separately. Recompute on the server from validated IDs/quantities; browser totals and availability are untrusted.
- Family packages are charged once; their included cuts are not inserted as additional charged lines. Additional services are explicitly additional. Mommy & Me includes the women’s haircut + blow-dry and one child’s cut, as confirmed by Harry.
- The house-call minimum is $60 in services before travel. Keep the internal shortfall calculation; do not create a minimum surcharge. Convenience fees apply once per household, not per person. Neighborhood-day reductions need a custom quote.
- Travel bands are planning information. Without approved routing/origin configuration, actual travel stays pending. Keep a private origin and provider credentials server-only; never infer driving time from a city label or straight-line distance.

## UI and content

Use existing shadcn components and inspect their generated APIs: this preset uses **Base UI**, with `render` and `nativeButton={false}` for button-styled links, not `asChild`.

Keep the Subaru decorative in Mountain Cinema’s reserved horizontal ribbon below the app bar, driven by normal scroll with passive listeners/requestAnimationFrame and cleanup. Use `src/components/scenic/mountain-cinema.tsx` and `src/data/cinema.ts` when changing motion or assignment. Reduced motion and no-JavaScript states leave a parked car; forms and reading never depend on animation. Avoid scroll hijacking and overlays across controls.

Keep all service-menu content server rendered. Preserve semantic headings, keyboard access, associated form errors, mobile layouts, and consent links. Use approved biography/portfolio details only; temporary stock is labeled inspiration, never Elisabeth’s work or a before/after pair. Public Instagram is `@hairnthere`; import source is `@justbeyou_hair`.

## Data handling

Preserve the contact endpoint’s bounded input, rate limiting, consent validation, escaped Discord content, disabled mentions, and acknowledgement-before-success behavior. Preview deployments use their own webhook; never fall back to the production destination. The current form collects no phone number or SMS opt-in; preserve validation for legacy consent records. Future SMS needs durable consent/opt-out handling and provider setup. No AI calls/texts are active.

Keep secrets in environment configuration and values out of logs/chat. Analytics receive broad action names, not messages, member labels, addresses, consent records, or contact details. Update Terms/Privacy when actual data handling changes. See the human-facing `README.md` and `.env.example` for configuration and deployment.

Use Next.js icon file conventions in `src/app/` and `scripts/create-brand-assets.mjs` for favicon/app/social exports. Keep the detailed logo for larger placements and the vector H/mountain mark for tiny browser icons; avoid duplicate manual icon metadata.
