# HairnThere

**Beautiful Hair, Wherever You Are.**

HairnThere is Elisabeth’s hair-services website, based around Suncrest in Draper, Utah. Its Mountain Cinema design combines warm mountain landscapes, a little Subaru that follows your scroll, and a clear menu for individual and family services.

The site welcomes **house-call inquiries** for manual follow-up by Elisabeth. A submitted inquiry does not reserve a time or confirm a price. The salon booth is a future plan, and event locations must be discussed individually. House-call appointment requests are rejected server-side pending licensing; consultation inquiries remain open. There is no live booking calendar, deposit collection, payment checkout, or automated phone/SMS agent.

## What’s included

- Responsive mountain-led homepage with light/dark themes, Manrope headings and DM Sans body typography, the new circular H/mountain logo, and compact logo/icon assets.
- A QR-first digital business card at `/card`, with a viewport-filling presentation view, copyable website link and downloadable QR image. No Apple/Google Wallet integration or membership enrollment.
- A scroll-driven wagon in dedicated scenic bands. It responds to normal mouse, trackpad, keyboard, and touch scrolling; reduced-motion preferences park the car.
- A server-rendered service menu with prices, supplied estimated durations, featured bundles, and service-specific inquiry links. Unspecified durations are confirmed during consultation; final quotes remain personal.
- A simple three-stage inquiry: service counts, visit preferences and address, then name and phone and/or email. `/quote` redirects to `/contact`.
- Internal catalog, package, minimum, and travel rules retained for planning. Travel and neighborhood-day reductions are discussed individually; published bundles use the shared catalog.
- Validated inquiries with acknowledged Discord delivery and updated Terms/Privacy; appointment-only phone contact preferences recorded separately from legacy automated SMS consent.
- PostHog page visits, broad conversion events, and web-vitals reporting, plus metadata, sitemap, robots instructions, and social/browser icons.
- Installable PWA with a home-screen suggestion, Android maskable icon, and a lightweight offline information page.

## Run it locally

Install Node 26 and pnpm 11.17.0, matching `.nvmrc` and `package.json`.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. The service menu works without delivery credentials. Sending an inquiry requires a configured Discord webhook; without it, the form shows an error rather than claiming the message arrived.

Useful local commands:

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

The repository intentionally has no automated test suite, pull request requirement, GitHub Actions, or Docker pipeline. Local checks and manual verification support the built-in Vercel deployment workflow.

## Configure the site

Copy the variable names from `.env.example`. On Vercel, set them in the project’s environment settings rather than committing values.

| Variable                                                | Purpose                                                                                                           |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_INSTAGRAM_URL`                             | Public profile; defaults to `https://www.instagram.com/hairnthere/`.                                              |
| `NEXT_PUBLIC_SUPPORT_EMAIL`                             | Public support email. Until supplied, support links use the contact page.                                         |
| `NEXT_PUBLIC_POSTHOG_KEY`                               | Optional public project token for a dedicated HairnThere PostHog Cloud US project. Without it analytics stay off. |
| `DISCORD_CONTACT_WEBHOOK_URL`                           | Server-only destination for production/local inquiries.                                                           |
| `DISCORD_PREVIEW_WEBHOOK_URL`                           | Separate preview destination. Previews never use the production webhook.                                          |
| `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` | Optional shared request limiting. Configure the pair together.                                                    |

Public environment values are embedded at build time, so redeploy after changing them. Keep Vercel system environment variables exposed so `NEXT_PUBLIC_VERCEL_ENV` identifies production correctly. PostHog only collects when that value is `production` and a project token is configured; local and preview environments stay excluded, including production-mode preview builds. Hosting remains on Vercel.

The contact endpoint uses shared Redis limits when configured. Its fallback is bounded but process-local, so it cannot enforce a global limit across Vercel instances. Host-level firewall limits can provide another layer of protection. If configured Redis is unavailable, the form fails safely rather than bypassing it.

## Deploy with Vercel

1. Import `harryt04/hair-n-there` into the intended Vercel Pro team, using the **Next.js** preset and repository root `.`. Keep the default framework build/output settings; use Node 26 and pnpm.
2. Select `main` as the production branch and leave Git deployments enabled. Pushes to `main` build and deploy production. Other branches can create previews without pull requests.
3. Configure production and preview environment values separately, including their separate Discord destinations. Create or select a dedicated HairnThere PostHog Cloud US project, set `NEXT_PUBLIC_POSTHOG_KEY` for production, and keep Vercel system environment variables exposed so `NEXT_PUBLIC_VERCEL_ENV` is available at build time. Redeploy after configuration changes. Verify incoming events and web vitals in PostHog after visiting production, then disable Web Analytics and Speed Insights in the Vercel project dashboard. This repository does not configure either dashboard or migrate historical Vercel analytics data.
4. Check a preview: layouts, keyboard navigation, themes, reduced motion, all three inquiry stages, field errors, and delivery to the preview destination. House-call inquiries are authorized; other settings remain gated.
5. Add `hairnthere.com` when ready. Follow the DNS records Vercel provides and redirect `www` to the apex. Preview pages are noindex and canonical URLs use the production domain. Enable preview deployment protection where available.

For rollback, choose a previous working production deployment in Vercel and use its rollback/promote control. Reconcile the code on `main` afterward so a later push preserves the fix. This implementation does not itself provision hosting, change billing/DNS, push Git commits, or deploy.

## Analytics and performance

PostHog Cloud US receives browser analytics through same-origin `/ingest` rewrites. This follows the pattern in the neighboring Coolify-hosted apps; PostHog itself is not hosted on Coolify. No separate host variable is required. Vercel still hosts HairnThere, and proxied analytics requests use its bandwidth/request allowances.

The integration records pageviews, `instagram_clicked`, `inquiry_started` on the first form interaction, and `inquiry_submitted` only after the server confirms delivery. Events contain broad action names, not inquiry contents. URL query strings, fragments, and attribution data are removed before transmission. Names, phone numbers, email addresses, visit addresses, family-member labels, consent records, private origins, and the decorative cinema assignment are excluded. Automatic interaction capture, session replay, automatic exception capture, and identified person profiles are disabled.

Analytics identifiers are kept only in memory, without analytics cookies or local-storage persistence. Reloading creates a new anonymous identifier, so returning-visitor and cross-load funnel counts are limited. Approximate location and device/browser information may still be processed by PostHog. Blocking analytics or leaving its token unset must not prevent navigation or inquiry delivery.

Web-vitals collection covers FCP, LCP, INP, and CLS without sampling; TTFB is reported separately as a `web_vital` event. Not every browser visit produces every metric. Use PostHog’s web-vitals dashboard for performance and a small conversion dashboard for pageviews → inquiry starts → confirmed submissions, plus Instagram clicks. Dashboard creation and production data verification remain operator setup steps; configuration in the repository alone does not demonstrate live collection.

Before release, manually check one pageview per initial load/navigation, the three conversion events, metrics after interaction/page exit, query/referrer sanitization, no analytics cookies or local-storage entries, and no collection in local/preview environments. Confirm inquiry error and success paths still work when analytics requests are blocked. Preserve the local `pnpm lint`, `pnpm typecheck`, and `pnpm build` checks; no automated test suite is added.

## Digital business card

Open `/card` when introducing HairnThere in person. Neighbors scan the large code to open the business homepage. “Fill screen” removes surrounding card content inside the browser viewport; the code stays black on white in either theme. The homepage and navigation link to the card.

QR assets are checked into `public/card/`. Regenerate them with `pnpm create:card-qr` after deliberately changing `business.cardDestination` in `src/data/business.ts`. Scan the final screen/printed proof on real iPhone and Android devices before use. See [the digital card notes](docs/digital-business-card.md). Wallet, loyalty and referral features are outside this release.

## Pricing and service availability

The services overview prioritizes getting in touch; `/pricing` offers the full menu without requiring contact details. Timing and policy information are available in expandable details.

Prices live in `src/data/services.ts` and packages in `src/data/packages.ts`. The quote calculator uses these server-owned values rather than accepting a browser’s price. A `+` means “starting at”; a correction needing consultation does not silently add $0 to a guaranteed total. Row-priced work uses row counts. Extension hair is outside installation labor.

Family Trim is $85 and Little Crew is $70. Mommy & Me is $75 and includes a women’s haircut + blow-dry and one child’s cut. Packages include their stated cuts once; individually added services are additional services, so avoid adding included cuts a second time.

House-call convenience fees are planned at $20/$30/$40/$55/$75 for the supplied time bands, once per household. The $75 band covers 46–60 minutes from the Suncrest base; trips over 60 minutes and neighborhood-day reductions need a custom quote. Final travel pricing is confirmed before an appointment. The $60 service minimum excludes travel and is not an automatic surcharge. Free extension-consultation location and format are confirmed separately. There is no live address-routing integration or invented city-based travel result.

`src/data/availability.ts` is the shared availability policy. Both the interface and contact endpoint enforce it. Appointment requests for inactive categories are rejected even if someone directly calls the endpoint. House-call appointment inquiries are accepted following Harry’s November 5 decision; salon/event appointment requests remain rejected. An inquiry never reserves a time. Opening a category requires a deliberate business decision and a server deployment after its location requirements are confirmed. The illustrated Subaru does not represent an operating vehicle salon.

## Inquiry delivery and future messaging

The current form sends an optional selected service/package interest, haircut/color counts, preferred date/time (Mountain Time), visit address, name, phone and/or email, and an optional note. At least one valid contact method is required; every supplied contact method must be valid. Providing a phone number selects personal appointment calls/texts from Elisabeth, even when email is also supplied. Counts overlap when someone wants both services. The server validates bounded counts, real dates/times and required house-call details, checks category availability, and sends a Discord notification with mentions disabled. The private text attachment contains the exact address; the embed shows the selected interest, counts, and time preferences. No numeric quote is calculated for this form. Legacy catalog submissions still use server-recomputed prices.

Success is shown only after Discord acknowledges delivery. Errors preserve the form for retry. There is no application database, queue, durable idempotency store, or automatic resend; after an uncertain timeout, the first message may already have arrived. Discord is the current inquiry destination. Avoid logging form contents and webhook URLs.

The current form discloses that providing a phone number chooses personal calls/texts from Elisabeth only for appointment inquiries and appointment confirmations, now or for future appointments. Email is required when phone is omitted. Contact information is never sold; there is no marketing permission, and customers can ask Elisabeth to stop calling/texting at any time. `phoneContactConsent` records this preference separately from legacy `smsConsent`; the Discord notification and private attachment include the preference, disclosure/version, submission time, and source. The form never sets legacy automated SMS consent. Legacy validation remains; a checked opt-in requires a phone number. No automated or AI calls/texts are sent by this website. Before activating AgentPhone or another provider, finalize public support details, verify registration requirements, implement STOP/HELP and opt-out enforcement, and retain durable consent records independently of Discord. Policy templates are not evidence of carrier approval.

## Content still to supply

- The first public portfolio collection contains 12 posts from [@justbeyou_hair](https://www.instagram.com/justbeyou_hair/). Eleven appear in the website carousel; an expired appointment promotion is excluded. Older-post discovery and reel video recovery remain incomplete. See [the collection inventory](docs/instagram-inventory.md). Follow links go to [@hairnthere](https://www.instagram.com/hairnthere/).
- Elisabeth’s approved biography, experience, certifications, specialties, and public support email.
- Any approved family-package substitutions beyond the stated inclusions.
- Private travel origin/routing configuration and neighborhood-day discounts.
- Confirmation of the requirements for each actual service-location model before appointment acceptance is opened.

Temporary inspiration images: [portrait source](https://images.unsplash.com/photo-1524504388940-b1c1722653e1), [hair source](https://images.unsplash.com/photo-1522337360788-8b13dee7a37e).

## Where things live

- `src/app/`: homepage, services, contact, policies, metadata, API routes, and the retired planner redirect.
- `src/components/scenic/`: mountain artwork and scroll-driven wagon.
- `src/components/ui/`: generated shadcn components using Base UI.
- `src/data/`: service menu, packages, business details, and availability.
- `src/lib/`: quote rules, input validation, notification delivery, and request limiting.
- `public/brand/`: original illustration copy, wordmark exports, app icons, and social card.
- `docs/elisabeth-revision-plan.md`: detailed product/pricing decisions and remaining questions.
- `AGENTS.md`: instructions for coding agents; this README is for people running the site.

The current logo is `public/brand/logo.png`, used in the header, homepage, footer, and social card. The original root `logo.png` stays intact as an archive. Run `node scripts/create-brand-assets.mjs` to regenerate brand exports. Browser tabs use a simplified vector H/mountain mark rather than shrinking the detailed illustration. Next.js automatically registers `src/app/favicon.ico` (16/32/48px), `src/app/icon.svg`, and `src/app/apple-icon.png` (180px); the manifest references 192/512px app icons. Icon metadata is managed through these file conventions, without duplicate manual declarations. Fonts use `next/font` and are served with the site after build-time download.

## Install HairnThere on a phone

On the production HTTPS site in **Chrome on Android**, choose **Install HairnThere** in the suggestion below the page content when Chrome makes installation available. Alternatively, open Chrome’s menu → **Add to home screen** → **Install** (wording varies). Launch the HairnThere icon from the home screen. On iPhone, use **Safari → Share → Add to Home Screen**. Install from the production domain; a preview deployment is a separate app.

Chrome decides when to offer its native prompt based on eligibility and engagement. The suggestion includes manual instructions when the prompt is unavailable. The dismiss button hides the suggestion for the current tab session. Installed standalone windows hide it automatically. Installation adds convenient access; inquiries require internet and appointments are confirmed manually. Payments are not collected on the site.

The service worker runs in production builds, including `pnpm build && pnpm start` on localhost, and needs HTTPS on a phone. Development mode does not register it. Only `/offline.html` is cached; service pages, API responses, inquiry contents and payments are not stored by the worker. If a document cannot load, the offline page asks the visitor to reconnect. There is no background sending or offline booking. In-app client navigation can instead show Next.js’s normal connection error; reconnect and retry. No new provider configuration is needed.

When changing the offline page, bump `OFFLINE_CACHE` in `public/sw.js`. Worker updates wait until existing app windows/tabs close, avoiding forced reloads of forms. `/sw.js` is served with revalidation/no-store headers. To remove local PWA state during development, unregister the worker and clear its cache in browser developer tools; opening the same origin in development does not remove a previously installed worker.

See [the PWA plan and device acceptance checklist](docs/pwa-plan.md) for release verification and future booking/payment work. Actual Android home-screen installation must be checked on the deployed HTTPS site with a physical phone.

## Mountain Cinema and gallery

The current design is **Mountain Cinema / Powder Day**. All three black 2020 Outback
banner variants are preserved. The first draw favors Powder Day (75%) over Alpine
Local and Night Shift (12.5% each). Every later full load or refresh, including mobile
pull-to-refresh, excludes that tab’s previous banner and draws from the other two
with their relative weights preserved. Client navigation keeps the current choice.
The last banner ID is kept in tab-scoped session storage; blocked or cleared storage
falls back to an independent draw, which can repeat. The default/no-JavaScript view
is Powder Day. Banner assignment is not an A/B test or analytics event. See
[the design and motion notes](docs/mountain-cinema.md) for the
artwork, assignment policy, accessibility fallbacks, and future seasonal possibilities.

The @hairnthere gallery shows 11 real posts from Elisabeth’s previous account in a
server-rendered, horizontally scrollable carousel. Images are served locally; no API
key or live Instagram feed is needed. Reel covers link to the original videos, and
original captions appear prominently beneath each image. Source captions, ordered carousel photos, review
status, and source links are recorded in `src/data/instagram-posts.json`. The follow
destination remains @hairnthere; source-post links go to @justbeyou_hair.
The **QR Code** app-bar shortcut opens `/card`; the large QR presentation lives on `/card`, linked in the footer.
