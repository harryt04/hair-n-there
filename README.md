# HairnThere

**Beautiful Hair, Wherever You Are.**

HairnThere is Elisabeth’s hair-services website, based around Suncrest in Draper, Utah. Its Scenic Journey design combines warm mountain landscapes, a little Subaru that follows your scroll, and a clear menu for individual and family services.

The site currently welcomes **consultations and interest inquiries**. House-call appointments are not open, the salon booth is a future plan, and event locations must be discussed individually. There is no live booking calendar, deposit collection, payment checkout, or automated phone/SMS agent.

## What’s included

- Responsive mountain-led homepage with light/dark themes, Playfair Display and Montserrat typography, the new circular H/mountain logo, and compact logo/icon assets.
- A QR-first digital business card at `/card`, with a viewport-filling presentation view, copyable website link and downloadable QR image. No Apple/Google Wallet integration or membership enrollment.
- A scroll-driven wagon in dedicated scenic bands. It responds to normal mouse, trackpad, keyboard, and touch scrolling; reduced-motion preferences park the car.
- The supplied 32-service menu, with fixed prices, starting prices, per-row extension labor, and free/quote-only consultations clearly distinguished.
- Three family packages and a service wish-list planner for multiple people. Prices are estimates, and hair for extensions is separate.
- Planned household convenience-fee bands and the $60 house-call service minimum. Real travel quotes remain unconfirmed until the private origin and routing provider are configured.
- A validated contact form with optional SMS consent, Discord delivery, and Terms/Privacy pages adapted from Sunshine Flower Bar.
- Vercel Analytics, standard Speed Insights, metadata, sitemap, robots instructions, and social/browser icons.
- Installable PWA with a home-screen suggestion, Android maskable icon, and a lightweight offline information page.

## Run it locally

Install Node 26 and pnpm 11.17.0, matching `.nvmrc` and `package.json`.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. The service menu and planner work without delivery credentials. Sending an inquiry requires a configured Discord webhook; without it, the form shows an error rather than claiming the message arrived.

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

| Variable                                                | Purpose                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_INSTAGRAM_URL`                             | Public profile; defaults to `https://www.instagram.com/hairnthere/`.      |
| `NEXT_PUBLIC_SUPPORT_EMAIL`                             | Public support email. Until supplied, support links use the contact page. |
| `DISCORD_CONTACT_WEBHOOK_URL`                           | Server-only destination for production/local inquiries.                   |
| `DISCORD_PREVIEW_WEBHOOK_URL`                           | Separate preview destination. Previews never use the production webhook.  |
| `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` | Optional shared request limiting. Configure the pair together.            |

Public environment values are embedded at build time, so redeploy after changing them. Vercel supplies its environment identifiers; keep system environment variables exposed so production analytics can identify production correctly. Analytics and Speed Insights stay off in local and preview environments.

The contact endpoint uses shared Redis limits when configured. Its fallback is bounded but process-local, so it cannot enforce a global limit across Vercel instances. Host-level firewall limits can provide another layer of protection. If configured Redis is unavailable, the form fails safely rather than bypassing it.

## Deploy with Vercel

1. Import `harryt04/hair-n-there` into the intended Vercel Pro team, using the **Next.js** preset and repository root `.`. Keep the default framework build/output settings; use Node 26 and pnpm.
2. Select `main` as the production branch and leave Git deployments enabled. Pushes to `main` build and deploy production. Other branches can create previews without pull requests.
3. Configure production and preview environment values separately, including their separate Discord destinations. Enable Web Analytics and Speed Insights in the Vercel project dashboard, then redeploy. The app already mounts `@vercel/speed-insights/next` from the root layout through `Telemetry`; it reports only in production and removes URL query strings and fragments before sending. Keep Vercel system environment variables exposed so `NEXT_PUBLIC_VERCEL_ENV` is available at build time. After visiting the production site, check the Speed Insights dashboard for incoming performance data.
4. Check a preview: layouts, keyboard navigation, themes, reduced motion, planner totals, and delivery to the preview destination. Do not activate appointment acceptance while service-location requirements remain unresolved.
5. Add `hairnthere.com` when ready. Follow the DNS records Vercel provides and redirect `www` to the apex. Preview pages are noindex and canonical URLs use the production domain. Enable preview deployment protection where available.

For rollback, choose a previous working production deployment in Vercel and use its rollback/promote control. Reconcile the code on `main` afterward so a later push preserves the fix. This implementation does not itself provision hosting, change billing/DNS, push Git commits, or deploy.

## Digital business card

Open `/card` when introducing HairnThere in person. Neighbors scan the large code to open the business homepage. “Fill screen” removes surrounding card content inside the browser viewport; the code stays black on white in either theme. The homepage and navigation link to the card.

QR assets are checked into `public/card/`. Regenerate them with `pnpm create:card-qr` after deliberately changing `business.cardDestination` in `src/data/business.ts`. Scan the final screen/printed proof on real iPhone and Android devices before use. See [the digital card notes](docs/digital-business-card.md). Wallet, loyalty and referral features are outside this release.

## Pricing and service availability

Prices live in `src/data/services.ts` and packages in `src/data/packages.ts`. The quote calculator uses these server-owned values rather than accepting a browser’s price. A `+` means “starting at”; a correction needing consultation does not silently add $0 to a guaranteed total. Row-priced work uses row counts. Extension hair is outside installation labor.

Family Trim is $85 and Little Crew is $70. Mommy & Me is $75 and includes a women’s haircut + blow-dry and one child’s cut. Packages include their stated cuts once; individually added services are additional services, so avoid adding included cuts a second time.

House-call convenience fees are planned at $20/$30/$40/$55/$75 for the supplied time bands, once per household. The $75 band covers 46–60 minutes from the Suncrest base; trips over 60 minutes and neighborhood-day reductions need a custom quote. Final travel pricing is confirmed before an appointment. The $60 service minimum excludes travel and is not an automatic surcharge. Free extension-consultation location and format are confirmed separately. There is no live address-routing integration or invented city-based travel result.

`src/data/availability.ts` is the shared availability policy. Both the interface and contact endpoint enforce it. Appointment requests for inactive categories are rejected even if someone directly calls the endpoint. The current accepted intents are informational consultation/interest; an inquiry never reserves a time. Opening a category requires a deliberate business decision and a server deployment after its location requirements are confirmed. The illustrated Subaru does not represent an operating vehicle salon.

## Inquiry delivery and future messaging

The contact form sends validated service IDs, quantities, optional person labels, package selections, and contact details. The server recomputes the summary, checks intent/category availability, and sends a Discord notification with mentions disabled. It records consent status, a server timestamp, and the disclosure version/source without treating that as marketing permission.

Success is shown only after Discord acknowledges delivery. Errors preserve the form for retry. There is no application database, queue, durable idempotency store, or automatic resend; after an uncertain timeout, the first message may already have arrived. Discord is the current inquiry destination. Avoid logging form contents and webhook URLs.

Text-message opt-in is optional and unchecked. A checked box requires a phone number. No newsletter/marketing permission is collected, and no AI calls/texts are sent by this website. Before activating AgentPhone or another provider, finalize public support details, verify registration requirements, implement STOP/HELP and opt-out enforcement, and retain durable consent records independently of Discord. Policy templates are not evidence of carrier approval.

## Content still to supply

- The first public portfolio collection contains 12 posts from [@justbeyou_hair](https://www.instagram.com/justbeyou_hair/). Eleven appear in the website carousel; an expired appointment promotion is excluded. Older-post discovery and reel video recovery remain incomplete. See [the collection inventory](docs/instagram-inventory.md). Follow links go to [@hairnthere](https://www.instagram.com/hairnthere/).
- Elisabeth’s approved biography, experience, certifications, specialties, and public support email.
- Any approved family-package substitutions beyond the stated inclusions.
- Private travel origin/routing configuration and neighborhood-day discounts.
- Confirmation of the requirements for each actual service-location model before appointment acceptance is opened.

Temporary inspiration images: [portrait source](https://images.unsplash.com/photo-1524504388940-b1c1722653e1), [hair source](https://images.unsplash.com/photo-1522337360788-8b13dee7a37e).

## Where things live

- `src/app/`: homepage, services, planner, contact, policies, metadata, and API routes.
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

Chrome decides when to offer its native prompt based on eligibility and engagement. The suggestion includes manual instructions when the prompt is unavailable. “Not now” hides the suggestion for the current tab session. Installed standalone windows hide it automatically. Installation adds convenient access; appointments and payments are still inactive.

The service worker runs in production builds, including `pnpm build && pnpm start` on localhost, and needs HTTPS on a phone. Development mode does not register it. Only `/offline.html` is cached; service pages, API responses, inquiry contents and payments are not stored by the worker. If a document cannot load, the offline page asks the visitor to reconnect. There is no background sending or offline booking. In-app client navigation can instead show Next.js’s normal connection error; reconnect and retry. No new provider configuration is needed.

When changing the offline page, bump `OFFLINE_CACHE` in `public/sw.js`. Worker updates wait until existing app windows/tabs close, avoiding forced reloads of forms. `/sw.js` is served with revalidation/no-store headers. To remove local PWA state during development, unregister the worker and clear its cache in browser developer tools; opening the same origin in development does not remove a previously installed worker.

See [the PWA plan and device acceptance checklist](docs/pwa-plan.md) for release verification and future booking/payment work. Actual Android home-screen installation must be checked on the deployed HTTPS site with a physical phone.

## Mountain Cinema and gallery

The current design is **Mountain Cinema / Powder Day**. All three black 2020 Outback
banner variants are preserved and freshly randomized on every full page load, including
refresh; client navigation keeps the current choice. Independent draws can repeat.
The default/no-JavaScript view is Powder Day. Banner assignment uses no browser storage
and is not an A/B test or analytics event. See [the design and motion notes](docs/mountain-cinema.md) for the
artwork, assignment policy, accessibility fallbacks, and future seasonal possibilities.

The @hairnthere gallery shows 11 real posts from Elisabeth’s previous account in a
server-rendered, horizontally scrollable carousel. Images are served locally; no API
key or live Instagram feed is needed. Reel covers link to the original videos, and
original captions appear prominently beneath each image. Source captions, ordered carousel photos, review
status, and source links are recorded in `src/data/instagram-posts.json`. The follow
destination remains @hairnthere; source-post links go to @justbeyou_hair.
The **QR Code** app-bar shortcut opens `/card`; the homepage QR is at the bottom.
