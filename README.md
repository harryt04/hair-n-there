# HairnThere

Elisabeth’s hair services website: a warm mountain-boutique design with a service request builder, contact form, Discord delivery, Terms/Privacy pages, and light/dark themes.

## Develop

Use Node 26 (`.nvmrc`) and pnpm 11.17.0 (pinned in `package.json`).

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. Local checks are `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Run the production output with `pnpm start`. There are no automated tests, pull request requirements, GitHub Actions, or Docker pipeline.

## Vercel

1. Import `harryt04/hair-n-there` into the intended Vercel Pro team. Select Next.js, repository root `.`, pnpm, Node 26, and `main` as the production branch. Default build/output settings work.
2. Leave native Git deployments enabled. A push to `main` builds and deploys production; pushes to other branches can create previews without pull requests.
3. Configure the variables listed in `.env.example` in Vercel. Set production and preview webhooks separately. A preview deployment never uses the production webhook. Next’s public environment values require a new build after changing them.
4. Enable Web Analytics in the project. Analytics and standard Speed Insights mount only when `NEXT_PUBLIC_VERCEL_ENV=production`. Keep Vercel system environment variables exposed; the integrations stay off in local/preview environments. No additional paid analytics add-ons are needed for the initial integration.
5. Verify a preview and the real contact configuration before assigning `hairnthere.com`. Point DNS to the records Vercel displays, add `www`, and redirect it to the apex. Preview deployments are noindex; canonical URLs use the production domain. Enable deployment protection for previews where available.
6. To roll back, select a previous working production deployment in Vercel and use its rollback/promote action. Reconcile `main` afterward so the next push retains the fix.

No account, billing, Git push, domain, or live deployment changes were made while preparing this repository.

## Configuration and content to finish

- Public Instagram is [@hairnthere](https://www.instagram.com/hairnthere/). Prior work should be imported from [@justbeyou_hair](https://www.instagram.com/justbeyou_hair/), preserving approved photos and captions. Profile links do not import photos or migrate Instagram posts; use an authorized account export/API for the actual import.
- Set `NEXT_PUBLIC_SUPPORT_EMAIL` to the public support address. Without it, support links point to the contact page rather than an invented email.
- Set the appropriate server-only Discord webhook. Missing or invalid configuration returns a visible form error; the site never reports a message as delivered without Discord’s acknowledgement.
- Replace the two explicitly labeled stock inspiration photos with approved portfolio photos from the old account when available. These are not represented as Elisabeth’s work. Source mood images: [portrait](https://images.unsplash.com/photo-1524504388940-b1c1722653e1), [hair](https://images.unsplash.com/photo-1522337360788-8b13dee7a37e).
- Prices and travel fees are intentionally “to be confirmed,” as requested. Future approved prices belong in `src/lib/quote.ts` and travel rules in `calculateQuote`. Unconfigured fees never silently become free. The request builder works without known rates; color/extensions remain consultation-based.
- Both salon and house-call actions begin inquiries. No booking calendar, payments, availability promises, or automatic AI outreach are implemented.

## Inquiry handling

The client sends service IDs/quantities and contact details to `POST /api/contact`. Zod validates and bounds the input, and the server recomputes the service summary. The route limits streamed body size and request time, rejects cross-site browser submissions and honeypot input, and limits requests. Discord receives escaped customer content with mentions disabled, an explicit consent status, server timestamp, and disclosure version.

For a shared serverless rate limit, configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. The optional Redis path uses an atomic expiring counter. The fallback is a bounded process-local limiter and **does not provide a global limit across Vercel instances**. Consider Vercel firewall rate limiting as an additional host-level control. If configured Redis is unavailable, submission fails rather than bypassing the limiter.

The form reports success only after Discord acknowledges receipt. Errors preserve the form for retry. There is no application database, queue, automatic retry, or durable idempotency store; a network timeout after acceptance can leave delivery uncertain, so visitors are told it is unconfirmed. Discord is the only current inquiry destination. Do not log form contents or webhook URLs.

## Consent, policy pages, and future SMS

The contact form and `/terms` / `/privacy` are adapted from the Sunshine Flower Bar examples in `harryt04/flowers`, updated for HairnThere and its actual data flow. SMS opt-in is optional and unchecked, with policy links beside it. A checked box requires a phone number. Without consent, follow up by email. No email-marketing permission is collected.

AI calls/texts and AgentPhone activation remain future work. Before activating them, finalize the public support contact and policy details, verify provider/carrier registration requirements, implement STOP/HELP and opt-out enforcement, and retain durable consent records independently of Discord. Templates and a recorded checkbox do not establish carrier approval. No SMS is sent by this website.

## Design and assets

The approved concept is `.lavish/hairnthere-design.html`; decisions live in `design-direction.md`. The original `logo.png` is preserved. The full logo has a cream surround in both themes. Header text uses the compact approved wordmark direction; `public/brand/` also contains light/dark SVG wordmark exports, monogram, social card, and app icons. `src/app/` contains the browser favicon and Apple icon.

`node scripts/create-brand-assets.mjs` regenerates code-native icon/wordmark/social assets using Sharp. The two inspiration photos are checked-in WebP assets; asset generation does not fetch external photos. Typography is self-hosted at build time through `next/font`, so fonts require network access during builds but no Google request from the visitor’s browser.

shadcn/ui components use its generated Base UI preset. Brand tokens live in `src/app/globals.css`, business details in `src/data/business.ts`, and service pricing in `src/lib/quote.ts`.

## Verification performed

Local lint, TypeScript, and production-build checks pass. HTTP checks covered all five public pages, sitemap/robots/manifest, favicon/Apple/social/image assets, and the 404 route. Contact endpoint checks confirmed invalid-input, missing SMS phone, cross-site, honeypot, and unconfigured-delivery errors. No live Discord message was sent. A browser-based interaction review and real webhook delivery check remain appropriate once a Vercel preview is connected.
