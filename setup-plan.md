# HairnThere repository setup plan

Status: approved design implemented in the Next.js app. Local lint, TypeScript, and production-build verification pass. See README.md for development and Vercel setup. Hosting connection, webhook secrets, and domain configuration are still external setup tasks; nothing has been deployed or pushed.

Deployment decision: use Vercel's built-in Git integration. Push directly to main to deploy production; optional branch pushes create previews without pull requests. Use Vercel Pro for this commercial site, plus @vercel/analytics and @vercel/speed-insights. No automated tests, pull request process, GitHub Actions, Docker pipeline, or external CI/CD setup.

## Product and launch scope

Build a polished digital business card for Elisabeth's mobile and salon hair services: portfolio first, clear services and pricing, then an estimate-to-inquiry flow. Carry “Great Hair Travels.” through the experience.

Proposed launch scope:

- Homepage: logo, introductory copy, prominent Instagram link and selected work, house-call and salon calls to action, services, service area, about Elisabeth, and FAQs.
- `/quote`: house-call or salon selection, service quantities, estimated service subtotal and travel fee, followed by contact details and an inquiry submission.
- `/terms` and `/privacy`: adapt the Sunshine Flower Bar example pages for HairnThere, including the contact/SMS program language needed for the planned AgentPhone/carrier registration. Link both from the footer and contact form; include both in the sitemap.
- Treat estimates as provisional and appointments as requests until Elisabeth confirms. Actual scheduling, deposits, accounts, and payments are outside this initial scope unless requested.
- Start with a curated local portfolio linking to original Instagram posts. Automated feed ingestion and old-account migration are separate follow-up tasks, pending account access and supported integration checks.

## 1. Vercel project and automatic deployment

Use Vercel's native Next.js framework preset and default output/build detection.

- Connect the GitHub repository to Vercel and select `main` as the production branch.
- Work directly on `main`; each push triggers Vercel's build and production deployment. Pull requests and branch protection are not part of this workflow.
- Optional: push another branch for a Vercel preview when a change needs a shareable URL before production. A pull request is not required.
- Leave native Git deployments enabled. Do not add `git.deploymentEnabled: false`, deployment workflows, prebuilt artifact uploads, or a Vercel CLI dependency.
- Configure runtime environment variables in Vercel's dashboard. No repository deployment token or CI secrets are needed.
- Use the standard Next.js application; Vercel handles builds and hosting without Docker.
- Use Vercel Pro for the commercial business website. Retain the current DNS provider if desired and point the domain to Vercel when ready.
- Keep analytics, fonts, images, and other integrations on their documented Next.js defaults.

## 2. Scaffold a single pnpm application

- Use one application at the repository root; a workspace/monorepo adds no value at this size.
- Use Vercel’s currently supported default Node major (26.x at this documentation check), aligned in `engines.node`, local runtime configuration and Vercel settings. Pin an exact pnpm version in `package.json#packageManager` after validating compatibility. Local tools currently report Node v26.9.0 and pnpm 11.17.0. Commit `pnpm-lock.yaml` so installs are reproducible.
- Use the current stable Next.js App Router with TypeScript, Tailwind CSS v4, ESLint, `src/`, and the `@/*` import alias. Resolve exact versions when implementing.
- Preserve `outline.md`, `color-palette-context.md`, `logo.png`, this plan, and existing Git history. Because the root already contains files, generate in a temporary directory outside the repo and merge the scaffold deliberately if the CLI rejects the directory. Do not create a nested app or replace the repo.
- Add development, build, start, lint, typecheck, and format scripts; add a README and `.env.example` containing names/placeholders only. Extend `.gitignore` for dependencies, build artifacts, local environment files.

Illustrative standard Next.js scaffold commands, run in a safe staging location before merging into this repo:

```sh
pnpm create next-app@latest hairnthere-scaffold --ts --tailwind --eslint --app --src-dir --import-alias '@/*' --use-pnpm --disable-git
cd hairnthere-scaffold
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge input label textarea select checkbox radio-group accordion sheet separator sonner
pnpm add next-themes zod react-hook-form @hookform/resolvers @vercel/analytics @vercel/speed-insights
```

Install only components actually used. Use the shadcn initializer's supported defaults, then apply the brand theme. No `--all` component installation.

### Framework defaults and repository layout

- Start from current stable `create-next-app`; retain the generated supported Next.js defaults, including Turbopack. Avoid canary dependencies and additional experimental flags.
- Use Server Components by default, `next/image` for portfolio images, `next/font` for typography, and the Metadata API for SEO. Keep `next.config.ts` minimal; no static export, custom server, or Docker standalone target.
- Let Vercel manage the CDN, framework caching, and function packaging. Use the default Node runtime for the contact Route Handler. Do not add Edge runtime overrides or force all pages to be dynamically rendered.
- Keep a single root package and `src/app`, `src/components/ui`, `src/components/site`, `src/components/quote`, `src/lib`, and `src/data`, with assets in `public/`. Do not add workflow files or test tooling.
- Add `error.tsx` and `not-found.tsx` with useful recovery actions. Use loading UI only for actual asynchronous boundaries.
- README documents `pnpm dev`, verification commands, configuration, and the release/rollback flow. Ignore `.vercel/`, downloaded environment files, and local secrets.

### Analytics and performance instrumentation

Install:

```sh
pnpm add @vercel/analytics @vercel/speed-insights
```

In `src/app/layout.tsx`, add the Next.js-specific components once, alongside the page content, while keeping the root layout a Server Component:

```tsx
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Inside the existing <body>, following the page/theme content:
// <Analytics />
// <SpeedInsights />
```

- Enable Web Analytics for the project in Vercel, deploy, and confirm that actual visits appear. Installing the package alone does not complete dashboard setup.
- Start with page views and standard Speed Insights. Keep Speed Insights Plus and other paid add-ons out of the initial setup; verify current allowances when configuring the project.
- Later, when conversion flows exist, add a small typed set of events: `instagram_clicked`, `quote_started`, and `inquiry_submitted`. Emit submission success only after the API confirms delivery. Restrict business conversion events to production and verify environment handling so preview/testing traffic does not contaminate results.
- Never send names, contact details, addresses, free-text messages, or sensitive query parameters to analytics. Use route paths and coarse, predefined event properties only; scrub URLs with the package hooks if needed. Document analytics in `/privacy`.
- Analytics/performance collection must not block or determine inquiry success. Use real visitor data to guide later optimization; a low-traffic site may take time to produce meaningful measurements.

## 3. Establish the visual foundation

Follow the proposed component/interaction and logo-asset plan in [design-direction.md](design-direction.md), approved by Harry. Create appropriate header, favicon/touch, and social variants after identity approval; do not shrink the detailed original into every context.

Design sources of truth: `color-palette-context.md` and the supplied `logo.png` (both in this repository). Use the existing logo asset, not a generated replacement; preserve the original and copy it into `public/` for the site.

The direction is retro mountain boutique with modern luxury: warm cream, espresso, dusty blush, honey gold, and a cozy lodge dark theme. Use the exact hex values from the palette file, Playfair Display headings, Montserrat body/navigation, “Great Hair Travels.”, house-call and salon calls to action, and the optional reduced-motion-aware car/road animation.

- Map the exact light/dark palette in `color-palette-context.md` to semantic shadcn CSS tokens for backgrounds, foregrounds, cards, borders, buttons, accents, and focus rings. Check contrast for each actual foreground/background pairing.
- Use Playfair Display headings and Montserrat body/navigation through `next/font`.
- Add `next-themes` with system preference and an accessible persistent theme toggle.
- Preserve the supplied logo. Its cream background is baked into the PNG; present it deliberately on a cream surface in dark mode until a suitable alternate asset exists. Create a simplified favicon separately rather than shrinking the full detailed logo.
- Build responsive header/footer, mobile navigation, service cards, portfolio tiles, and form fields with shadcn primitives and custom brand styling.
- Add the winding-road/car animation after the core page works, with reduced-motion support and no scroll obstruction.

## 4. Implement content, portfolio, and SEO

- Server Components for content; Client Components only for theme controls, mobile interactions, and the estimator/form. Pre-render stable marketing content; use server processing for inquiries.
- Keep business information, service catalog, service area rules, and portfolio entries in typed data files. No CMS or database required for this content initially.
- Use optimized images with dimensions and useful alt text; lazy-load gallery items and avoid loading 100 posts on the initial view.
- Add title/description, canonical URL, Open Graph image, favicon, `sitemap.ts`, and `robots.ts` for `https://hairnthere.com`.
- Add truthful structured data for the business and service area once details are confirmed. Do not expose a private home address or invent reviews, hours, prices, or a public salon address.

## 5. Build a configurable quote estimator

- Store stable service IDs, labels, units, starting/fixed prices, and consultation requirements in one catalog. Represent money as integer cents.
- Support multiple services and quantities for groups, such as nine family haircuts. Confirm whether family members need different haircut categories or per-person service combinations.
- Put calculation in a pure shared module. Recalculate on the server from service IDs and quantities; never trust a browser-supplied total.
- Proposed launch travel policy: explicit city/zone fees and approved waivers, with unmatched locations marked “travel fee to be confirmed.” Confirm the actual cities and amounts with Elisabeth.
- If drive-time pricing is selected, add server-side routing/geocoding, a private origin, approved service boundaries, a documented one-way/round-trip rule, and provider-error handling. Do not substitute straight-line distance for driving time.
- Display line items, quantities, service subtotal, travel fee or pending status, and estimate caveats. Never interpret an unknown fee as zero.

## 6. Implement inquiry delivery

Copy/adapt the contact and policy examples from `https://github.com/harryt04/flowers` / sunshineflowerbar.com. Local references inspected:

- `../flowers/components/ContactForm.tsx`: fields, submission states, optional SMS checkbox, and links to both policies.
- `../flowers/lib/validation.ts`: server-side schema and consent fields.
- `../flowers/app/api/contact/route.ts` and `../flowers/lib/discord.ts`: submission and Discord delivery flow.
- `../flowers/app/terms/page.tsx` and `../flowers/app/privacy/page.tsx`: policy page structure and messaging disclosures.

The reference saves to MongoDB before email/Discord notifications. Decide the HairnThere persistence approach deliberately; a webhook-only implementation does not preserve that reliability.

- Build a validated `POST /api/contact` route accepting the selected services, appointment type, area, preferred date, contact method/details, and notes. Request a full address only when needed for routing or appointment follow-up.
- Use Zod on the server, bounded fields/body size, spam protection, and rate limiting supported by the selected host. Keep the webhook URL server-only.
- Send an understandable service/price breakdown to a dedicated Discord destination. Disable unintended mentions and do not copy Sunshine Flower Bar's hard-coded users, agent instructions, or business details.
- For a simple webhook-only launch, show success only after Discord acknowledges receipt. Handle missing configuration, timeouts, and delivery failure explicitly; preserve the form and offer a retry/contact alternative.
- If inquiries must survive Discord downtime or feed an AI follow-up workflow, choose durable storage/queueing before launch and include idempotency/retry handling. Do not silently discard failed requests.
- Adapt the example SMS checkbox as a separate optional, unchecked opt-in for inquiry/appointment follow-up. Keep its linked Terms/Privacy disclosures next to the checkbox. Accept inquiries without SMS consent and use another supplied contact method in that case. Do not turn transactional follow-up consent into marketing permission.
- Include consent status in the validated payload and Discord notification, along with submission timestamp and consent-text version/source. If SMS automation is enabled, retain a durable consent record rather than relying only on a Discord message.
- Plan for the later flow: inquiry → Discord webhook → AI agent → assigned business phone number. The future agent must receive and respect consent status and opt-outs; recording opt-in does not itself implement STOP/HELP handling or number registration.
- Adapt `/terms` and `/privacy` from the inspected examples: replace brand, services, support contact, effective date, and messaging purpose. Preserve the example's SMS frequency/rates, STOP/HELP, optional-consent, and carrier-delivery language as a starting template. Update actual data handling for Vercel Analytics, Discord, and the eventual agent/telephony provider; omit newsletter/email-marketing claims unless implemented.
- Policy pages are launch scope, even if AI/SMS is activated later. Check the final text and actual opt-in flow against AgentPhone's then-current registration requirements before enabling the number; copying the example is a starting point, not evidence of provider/carrier approval.

## 7. Local verification and deployment

- Use local lint, TypeScript checking, and a production build while implementing. Vercel runs its normal production build on each push.
- Do not add automated test suites, test runners, CI workflows, required status checks, or a pull request process.
- Manually check the estimator, form delivery/error handling, mobile layout, keyboard interaction, and light/dark themes as the relevant features are built.
- Use an optional branch deployment for preview verification. Give preview inquiries a separate destination or explicitly disable delivery so sample leads do not reach the production channel.
- Verify images, fonts, metadata, environment configuration, and instrumentation on Vercel. Confirm actual analytics collection after production deployment.
- Document environment variables and Vercel's rollback procedure in the README. Configure the production domain after the app is ready.

## Suggested implementation checkpoints

1. Foundation: pnpm/Next.js/shadcn scaffold, scripts, brand tokens, theme, responsive shell, Analytics, and Speed Insights components; clean build/typecheck/lint.
2. Content: polished homepage, supplied logo/palette, curated gallery, service information, adapted Terms/Privacy pages, metadata, sitemap, and robots.
3. Conversion: estimator, adapted Sunshine Flower Bar contact form with SMS opt-in/policy links, and reliable Discord inquiry delivery, checked manually.
4. Release preparation: Vercel Git connection/environment setup, README, automatic main-branch deployment, analytics verification, and domain configuration.

## Remaining inputs (do not block the foundation)

1. Account setup later: identify the Vercel team/project and connect the GitHub repository. Use main for production. No deployment credentials or workflows need to be added to the repository.
2. Booking: are both buttons inquiry flows for launch, or does the salon have an existing booking URL? Is automated AI follow-up required immediately?
3. Pricing decision: keep prices and house-call travel fees “to be confirmed” until Harry/Elisabeth supplies the real details. This is implemented without prototype dollar values.
4. Portfolio/contact: public Instagram is @hairnthere; previous photos/captions come from @justbeyou_hair. Public fetch was throttled, so importing media remains pending. The app links the previous-work account and clearly labels temporary stock inspiration. Support email is still unconfigured.

Unknown prices and integrations can remain explicit placeholders while the foundation is built; do not publish invented business details.

## Vercel setup and release checklist

- Create/link the project under the intended Vercel Pro team with repository root `.` and the Next.js preset. Confirm Node/pnpm alignment. Retain the domain at its current DNS provider if desired.
- Separate Development, Preview, and Production environment values. Runtime secret: `DISCORD_CONTACT_WEBHOOK_URL`. Add any spam-protection provider variables only when that implementation is chosen.
- Apply preview deployment protection where available and prevent indexing of nonproduction deployments. Keep production canonical URLs fixed to `https://hairnthere.com` while preview links stay usable.
- Enable Web Analytics, include standard Speed Insights, and configure usage/spend notifications. Do not turn on automatic site pausing as an assumed default for a business website.
- Deploy a working preview before touching production DNS. Manually verify mobile layout, estimate calculations, and delivery with preview configuration. Document the known-good deployment and Vercel rollback procedure.
- On release, configure the apex domain and www redirect, verify HTTPS/canonical behavior, verify the production inquiry path, confirm telemetry arrives, and review runtime logs without logging form contents.

## Technical references checked

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [shadcn/ui Next.js setup](https://ui.shadcn.com/docs/installation/next)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Supported Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel Git integration](https://vercel.com/docs/git)
- [Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart)
- [Speed Insights quickstart](https://vercel.com/docs/speed-insights/quickstart)
- [Speed Insights limits and pricing](https://vercel.com/docs/speed-insights/limits-and-pricing)
- [Sunshine Flower Bar reference repository](https://github.com/harryt04/flowers)
