# HairnThere: Elisabeth revision plan

## November 6 services copy and menu decision

Harry supplied Elisabeth’s updated written service menu and authorized
implementation. This supersedes the November 5 retirement of public prices:
publish the updated catalog prices, starting-price markers, per-row units, and
supplied estimated durations. Keep the quote route redirected to contact.
Preserve Mountain Cinema, current typography, themes, and service IDs.

Implementation plan:
1. Update the shared catalog with the November 6 prices, durations, friendly
   descriptions, and new services. Add the $85 Neighborhood Refresh and $115+
   Color & Cut Combo; update Family Trim to $80. Keep Mommy & Me at $75 with
   the women’s haircut + blow-dry and one child’s cut, and Little Crew at $70.
2. Lead services with “Hey Neighbor, Let’s Do Your Hair!” and the supplied
   subheading. Feature Family Hair Days and bundles near the top, followed by
   Haircuts, Color, Styling, and Extensions (including treatments).
3. Link each service/package to a visible, editable inquiry selection and carry
   its validated ID into delivery. Use first-person stylist copy, clear prices,
   large mobile tap targets, and household/minimum/consultation explanations.
4. Reject house-call appointment requests server-side pending licensing;
   consultation inquiries remain open. Preserve delivery and privacy safeguards.
5. Run local lint, typecheck, production build, and manual calculation/validation
   checks, then commit and push directly to main.

Written prices supersede older screenshot prices. No duration was supplied for
most extension/treatment services, color correction, or bundles: show “Timing
confirmed during consultation” rather than inventing minutes. Starting prices
may increase for extra product, length, density, or complexity. Extension hair
is additional; travel is once per household and routing stays pending. The $60
minimum is a service requirement, not a surcharge. Bundles are charged once,
with additional services explicitly extra.

Use “Say hello before launch” for the launch-list invitation. An inquiry does
not subscribe someone to ongoing marketing; no mailing list is activated.


## November 5 typography decision

Harry selected proposal C in the typography review: upright Manrope headings
(weight 600) with DM Sans body copy. This supersedes the earlier Playfair Display
and Montserrat instructions below. Preserve the existing illustrated logo,
Mountain Cinema artwork, brand palette, light/dark themes, and business rules.

## November 5 Elisabeth copy and portrait update

Use Elisabeth’s supplied first-person biography and neighborhood voice: “Good
Hair. Good Vibes. Right in Your Neighborhood.” leads the homepage; “Great Hair
Travels.” remains the brand tagline. She confirmed over ten years of experience.
Keep the Mountain Cinema gallery-led structure, with a welcome section, Fresh
Cuts, Color Magic, Extensions & Styling, Family Hair Days, and Meet Elisabeth.
Use both supplied portraits in `public/Elisabeth/` in the biography section;
these are personal photos, separate from the portfolio gallery.

Public wording states that house-call appointments are coming soon, pending
licensing approval. House-call inquiries remain open for manual follow-up under
the existing server policy; this copy change does not activate services or
confirm appointments. Keep the neighborhood spelling Suncrest.

Adapt the proposed “Join the HairnThere Launch List” CTA to “Say hello before
launch,” linking to the existing inquiry form. No mailing-list subscription is
created or implied. A future ongoing launch list needs its own explicit opt-in,
storage/delivery decision, and matching privacy/terms copy. Existing inquiry
validation, delivery, pricing, and service-location gates remain unchanged.

## November 5 contact redesign decision

Harry approved “One less thing on your list” from proposal A with proposal B’s
three-stage form: people, visit, contact. Keep Playfair Display and Montserrat;
no replacement font pair was selected. House-call inquiries are now explicitly
open for manual follow-up by Elisabeth or her team. This supersedes the inactive
house-call language below; salon and event acceptance remain inactive. No
appointment is automatically confirmed, and no licensing claim is made.

Public prices and the priced planner are retired in favor of personal quotes;
`/quote` redirects to `/contact`. Keep catalog, package, minimum, and calculation
rules internally. The form captures haircut/color counts (a person can be counted
in both), optional date, flexible/specific time, address, name, email, and an
optional note. It uses email rather than collecting SMS consent. Visit addresses
are delivered in the private Discord attachment and excluded from analytics.
No routing or automated follow-up service is activated.

## Earlier implementation reference

Status: Mountain Cinema / Powder Day supersedes Scenic Journey’s visual treatment; see `docs/mountain-cinema.md`. The full catalog, family planner, server-side inactive-booking gate, and responsive scroll-driven Subaru are implemented. Real address routing, live delivery configuration, portfolio imports, and service-location authorization remain external setup/content tasks. No live deployment is performed by this change.

The latest supplied price list supersedes the earlier “all pricing to be confirmed” plan. The licensing summary is a business launch constraint supplied by Harry; its legal conclusions and cited rules have not been independently verified in this task. Obtain written clarification for the actual operating model before opening paid appointment requests for it.

## Historical product direction and three design choices

The current visual approval is [Mountain Cinema / Powder Day](mountain-cinema.md); the earlier concepts below explain the business-rule revision, not the current banner layout.

Keep HairnThere / “Great Hair Travels.”, the original illustrated logo, the supplied light/dark palette, Playfair Display headings, and Montserrat body text. The primary headline becomes “Beautiful Hair, Wherever You Are.” The family section uses “Your Whole Family. One Appointment. Zero Salon Trips.” as future house-call positioning; accompany it with a clear coming-soon status while house-call acceptance is inactive.

| Concept                            | Presentation                                                                                                                         | Subaru behavior                                                                                                            | Tradeoff                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A — Mountain Atelier (recommended) | Warm editorial luxury; generous cream space, elegant type, selected work, concise service highlights, and calm status-aware actions. | Small decorative car follows a subtle route in a reserved desktop margin; a narrow, reserved story rail on narrow screens. | Most balanced brand expression; requires real portfolio imagery to complete the editorial effect.                                                               |
| B — Scenic Journey                 | Landscape-led storytelling, mountain silhouettes, chapters for cuts/color/families, and more visible playful illustration.           | The car travels along scenic chapter dividers as the page scrolls, with a distinct safe path for mobile.                   | Strongest personality; scenery must stay secondary to reading and must not make the interface feel like a game.                                                 |
| C — Personal Concierge             | Service menu, appointment format, family members, and price summary appear early; stronger functional hierarchy.                     | Compact progress route beside the planner; a slim reserved progress strip on mobile.                                       | Clearest conversion path, with less visual storytelling. Before authorization, it must collect consultation/interest rather than appear to accept appointments. |

All concepts must distinguish current informational availability from future booking. A Subaru carrying tools illustrates the brand; it must not imply that the car is an approved mobile salon or that all service locations are authorized.

## 1. Establish launch modes before changing calls to action

Represent operating models separately: `client_home`, `mobile_salon_vehicle`, `salon_booth`, and `offsite_event`. “Drive to a home” and “serve inside a salon vehicle” are not interchangeable. Do not add a vehicle-salon offer unless that is an actual selected business model.

Create a server-owned availability policy, with defaults of `interest_only` or `not_launched`, and an explicit `requestable` state only for a confirmed model. Do not derive authorization from a query parameter, browser state, or a public environment variable.

- **Client homes:** appointment acceptance inactive pending written DOPL/local clarification. Public action: “Ask about future house calls” or “Join the interest list,” never “Book now.”
- **Salon booth:** coming soon until a booth, location, operating arrangements, and relevant approvals are established. It is not currently a confirmed salon location.
- **Off-site special events:** allow informational consultation only until the relevant venue/location rules and service offering are confirmed. Bridal service pricing does not itself authorize every event location.
- **Mobile salon vehicle:** not an active offer; keep separate from Subaru illustration and client-home interest.
- **General/extension/color consultations:** informational inquiries can remain available, with no confirmed date, appointment reservation, payment, or availability promise.

The app now uses consultation/interest-only wording and a server-owned category gate. Direct appointment requests for inactive settings are rejected before delivery. Use a short customer-facing message such as “House-call appointments aren’t open yet. Ask a question or leave your interest.” Keep agency correspondence and detailed legal analysis internal.

The server must resolve inquiry intent (`consultation`, `interest`, `appointment_request`) and operating model from validated identifiers, reject appointment intent for inactive models even if the visitor bypasses the UI, and render status from the same policy. Preserve informational interests separately from future bookable appointment requests in Discord notifications. Do not treat an inquiry as permission for an ongoing marketing or availability-message list; define any future list opt-in separately. Add authoritative category checks to direct POSTs, bookmarked routes, and any future date/calendar endpoints.

## 2. Capture the exact service catalog

Use stable IDs, prices in integer cents, customer-facing descriptions, a service category, and an explicit pricing kind: `fixed`, `from`, `per_row`, `free_consultation`, or `consultation_required`. A zero-cost consultation is not the same as an unknown price. Every published `+` remains “from” in the menu and estimate.

### Haircuts

| Service                    | Price | Pricing kind |
| -------------------------- | ----: | ------------ |
| Women’s haircut + blow-dry |   $55 | Fixed        |
| Women’s dry haircut        |   $45 | Fixed        |
| Men’s haircut              |   $35 | Fixed        |
| Men’s detailed cut/fade    |   $40 | Fixed        |
| Children’s haircut (0–12)  |   $25 | Fixed        |
| Teen haircut (13–17)       |   $35 | Fixed        |
| Bang trim                  |   $12 | Fixed        |
| Beard trim                 |   $15 | Fixed        |

### Styling

| Service                 | Price | Pricing kind |
| ----------------------- | ----: | ------------ |
| Shampoo + blowout       |   $45 | Fixed        |
| Curls/waves             |   $35 | Fixed        |
| Flat-iron styling       |   $35 | Fixed        |
| Simple braids           |   $25 | Fixed        |
| French/Dutch braids     |   $35 | Fixed        |
| Children’s formal style |   $40 | Fixed        |
| Half-up formal style    |   $65 | Fixed        |
| Formal updo             |   $85 | Fixed        |
| Bridal styling          |  $125 | Fixed        |

### Color

| Service                 |                 Price | Pricing kind                            |
| ----------------------- | --------------------: | --------------------------------------- |
| Root touch-up           |                  $85+ | From                                    |
| All-over color          |                 $115+ | From                                    |
| Gloss/toner + blow-dry  |                  $65+ | From                                    |
| Face-framing highlights |                  $85+ | From                                    |
| Partial highlights      |                 $135+ | From                                    |
| Full highlights         |                 $175+ | From                                    |
| Balayage                |                 $200+ | From                                    |
| Color corrections       | Consultation required | Consultation required; no numeric price |

### Extensions and treatments

| Service                    |    Price | Pricing kind      |
| -------------------------- | -------: | ----------------- |
| Extension consultation     |     Free | Free consultation |
| Tape-in installation labor |    $125+ | From; labor only  |
| Tape-in removal            |     $55+ | From              |
| Beaded weft move-up        |  $85/row | Per row           |
| Extension installation     | $100/row | Per row           |
| Deep conditioning          |     $25+ | From              |
| Brazilian Blowout          |    $250+ | From              |

Extension hair is priced separately. Do not bundle its cost into installation or show it as free. Color/extension totals remain provisional where a custom quote is necessary. Explain units near the quantity control: people/appointments for cuts and styling, rows for per-row services. Do not invent inclusions, service durations, experience, certifications, or specialties; ask Elisabeth for approved descriptions and details.

## 3. Evolve the family planner and quote contract

The existing `ServiceSelection {id, quantity}` and four-ID schema are too narrow. Agree on the replacement contract before parallel implementation.

Suggested data model:

- `ServiceDefinition`: stable ID, category, label/description, pricing kind, amount in cents when numeric, billing unit, consultation requirements, supported/confirmed operating models.
- `PartyMember`: local identifier, optional display label such as “Adult 1” or “Child 1,” appropriate age band where relevant, and selected service lines. Avoid collecting children’s full names, birthdates, or unrelated personal information.
- `ServiceLine`: service ID plus bounded quantity; use explicit row count for a per-row service. Preserve which person each line belongs to so the request is understandable.
- `PackageLine`: package ID, quantity, and member/service allocation. Charge once for the package; do not also charge included services individually.
- `VisitContext`: validated operating model, inquiry intent, location information sufficient for the selected stage, and a server-issued travel quote reference when available.
- `QuoteResult`: line breakdown, exact fixed subtotal, starting-price subtotal/range label, consultation-only exclusions, extension-hair exclusion, travel status/fee, minimum status, availability status, and quote/catalog version.

The client may preview a calculation; the server loads the catalog, checks all selections and eligibility, recomputes the amount, and ignores browser-provided prices, totals, availability flags, travel minutes, and fees. Do not turn a lower-bound estimate into a guaranteed total. Consultation-required services without amounts remain pending and visible, rather than silently contributing $0.

### Family packages

| Package     | Supplied price | Contents and caveat                                                                                                          |
| ----------- | -------------: | ---------------------------------------------------------------------------------------------------------------------------- |
| Family Trim |            $85 | 1 standard men’s haircut + 2 children’s cuts. The supplied standalone total is also $85; do not advertise a monetary saving. |
| Mommy & Me  |            $75 | 1 women’s haircut + blow-dry + 1 child’s haircut (ages 0–12), confirmed by Harry.                                            |
| Little Crew |            $70 | 3 children’s haircuts; supplied standalone total $75.                                                                        |

Travel is added once per household appointment, separately from packages. Clarify whether a teen is eligible for a children’s package and any substitutions/upgrades; do not assume age boundaries differ from the standard service menu. Keep a manual-quote path if a package configuration is not defined.

Neighborhood haircut days are a separate inquiry type: collect neighborhood, interested households, and a flexible date preference. Reduced fees are manually quoted until a sharing/discount policy is approved. Do not automatically split a household fee across neighbors or add a fabricated discount.

## 4. Travel estimates and the house-call minimum

Confirmed customer-facing policy: fees use estimated driving time from the Suncrest service base; final travel pricing is confirmed before an appointment. The exact private origin and live routing setup remain to be configured. City names describe typical bands; an address does not receive a guaranteed fee merely because it is in Draper, Highland, or Alpine.

| One-way driving time | Household convenience fee | Descriptive area        |
| -------------------- | ------------------------: | ----------------------- |
| Up to 10 minutes     |                       $20 | Very local / Suncrest   |
| 11–20 minutes        |                       $30 | Nearby / Draper         |
| 21–30 minutes        |                       $40 | Highland / Alpine area  |
| 31–45 minutes        |                       $55 | Other areas             |
| 46–60 minutes        |                       $75 | Longer household visits |
| Over 60 minutes      |              Custom quote | Confirm individually    |

Round a fractional minute upward before assigning a band; for example 10.1 minutes becomes 11 minutes. Confirm the origin, one-way/round-trip rule, traffic/departure-time assumptions, and rounding policy before publishing live routing calculations. Do not use straight-line distance as driving duration.

Use a server-side routing/geocoding endpoint with a provider selected during implementation. Store the exact starting address and provider credential only in server environment configuration. Do not expose the origin in client code, query strings, map markers, or route responses. Return only the fee/status and customer-relevant estimate. Rate-limit route requests and avoid sending exact addresses to analytics or unnecessary notification channels.

Recalculate the fee server-side on inquiry acceptance, or validate a signed, expiring server quote tied to the submitted destination. Never trust client duration/fee values. Use “travel fee to be confirmed” for provider failure, missing configuration, out-of-area addresses, or >60 minutes; never substitute $0. Keep the address calculator informational while the operating model is inactive.

House calls require **$60 in services before travel fees**. For a $35 haircut, show “Add $25 in services to reach the house-call minimum” rather than silently adding a $25 surcharge. Packages contribute their package price once. Starting prices can establish a minimum lower bound, but consultation-required services do not prove the threshold; final eligibility may need confirmation. Clarify whether free extension consultations happen remotely/in salon, and whether an in-home consultation is exempt from the minimum. Do not infer that a free consultation permits an otherwise inactive house-call booking.

## 5. Subaru scroll animation

Harry approved **Mountain Cinema / Powder Day** as the website direction and requested all three black 2020 Outback banners be retained with a fresh random assignment on each full page load, including refresh. See [Mountain Cinema](mountain-cinema.md) for the current motion, artwork, and assignment rules. This supersedes the continuous scenic margin and older chapter-divider studies.

The production treatment is a dedicated horizontal ribbon below navigation, with a snowboard-equipped black Outback, neighborhood houses, and layered mountains. Preserve normal scrolling, reverse travel, endpoint parking, static reduced-motion/no-JavaScript views, and cleanup. The Outback is transport/brand artwork, not a vehicle salon. This design approval leaves service-location acceptance inactive.

## 6. Page and component changes

- Homepage: revised headline, brand illustration, one primary informational/consultation action, status-aware service format cards, named service-area copy (Suncrest in Draper, Draper, Highland, Alpine, surrounding communities), family story, and Subaru treatment selected with the concept.
- `/services`: full four-category menu with explicit starting prices and per-row units. Use shadcn Tabs or Accordion for navigation and accessible filtering; all menu content remains available to server rendering/search engines. Link a selected service into the inquiry/planner without claiming a reservation.
- `/quote` or `/plan`: party members, services/packages, future visit format, minimum explanation, travel estimate, and a review summary. Before authorization, end in interest or consultation with a clear status. Do not expose date-slot selection for an unavailable category.
- `/contact`: preserve optional unchecked SMS consent and Terms/Privacy links. Differentiate informational consultations, neighborhood-day interest, and any later eligible appointment request. Preserve input on delivery failures.
- Gallery: create actual before/after pairs only when both approved photos exist; do not fabricate transformations by pairing unrelated stock photos. Import approved work and captions from @justbeyou_hair via an authorized export/API when available; public fetching was throttled. Keep @hairnthere as the public destination.
- About: use Elisabeth’s supplied bio/certifications/specialties only; leave unsupported credentials out. Never claim an active license has been verified in the website without the necessary information and verification.
- Terms/Privacy: adapt wording for launch statuses, address/routing processing, packages/starting prices, and any actual messaging changes. Preserve future SMS/AI as future until the service is operational. No deposits/payments this phase.
- Preserve Vercel native Git deployment. Harry approved replacing Vercel Analytics and Speed Insights with PostHog Cloud US: production-only pageviews, broad conversion events, and web vitals; no replay, automatic interaction/error collection, identified person profiles, or persistent analytics identifiers. See README.md for configuration and release verification. Keep addresses, personal contact details, member labels, private origins, and message text out of analytics. Update metadata/structured data so it does not advertise an unlaunched location as an active business address.

## 7. Orchestrate implementation after design selection

### Sequential foundation — parent/integrator

Confirm the selected concept and unresolved pricing/availability rules; record server-owned launch states. Freeze shared TypeScript types and API contracts. Introduce catalog IDs without deleting old content or silently reinterpreting old submissions. Select a deliberate migration from the four generic service IDs: accept legacy IDs only as unpriced general interests, or reject them clearly; do not map a generic “haircut” to a specific priced haircut. Keep all paid categories inactive until release criteria are satisfied.

### Parallel work with three agents

| Owner                               | File ownership                                                                                     | Deliverable / dependency                                                                                                                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent 1 — catalog and quote domain  | `src/data/services.ts`, `src/data/packages.ts`, `src/lib/quote.ts`, travel domain module           | Full exact catalog, packages, units/starting amounts, minimum rules, household fee model, quote version. Shared contract is approved first. No routing credential changes.                                                          |
| Agent 2 — presentation and motion   | Homepage, service/menu/gallery/About components, Subaru SVG/component, responsive styling          | Chosen concept, status-aware actions, safe desktop/mobile scroll motion, accessible static/reduced-motion fallback. Consume shared types; do not edit domain pricing or API.                                                        |
| Agent 3 — inquiry and server policy | Validation, contact endpoint, routing endpoint, Discord delivery, form/planner flow, Terms/Privacy | Expanded schema, trusted recomputation, category/intent gate, address privacy, delivery/consent semantics, informational-only flows before authorization. Depends on frozen shared contract; coordinate quote imports with Agent 1. |

The parent owns layout/SEO, shared business availability configuration, environment documentation, integrations, and final reconciliation. Keep the visual agent away from form/API files and keep the domain agent away from global styling to reduce shared-checkout conflicts. If a routing provider or source assets are unavailable, implement an explicit pending/manual-quote state rather than inventing results.

### Sequential integration and verification — parent

Run local lint, TypeScript checks, and production build; no test runner, test suite, PR, GitHub Actions, or Docker additions. Manually exercise fixed/from/free/per-row totals, multiple members, package allocation without double charging, $60 threshold, fee once per household, travel-band boundaries, unknown routes, and provider failure. Check direct POSTs cannot request inactive categories or override prices/flags. Check desktop/tablet/mobile scroll, reverse scroll, dark mode, reduced motion, keyboard access, no-JS content, and that the car never blocks content. Verify inquiry delivery with isolated preview configuration when credentials are supplied; preserve current no-false-success behavior.

Use Vercel’s optional branch preview for visual review if requested; production remains the native main-branch deployment. Do not push a category live merely because the visual design is approved. Deposits, payment processing, live scheduling, neighborhood discount automation, and SMS agent activation are separate follow-up milestones.

## Open decisions

1. Resolved: Mountain Cinema / Powder Day replaces the Scenic Journey margin; preserve all three approved banners with fresh random assignment per full page load (including refresh). See `docs/mountain-cinema.md`.
2. Written requirements/authorization for each exact service location model; salon venue and off-site event arrangements remain unconfirmed. Who will provide the decision and when?
3. Continue manual confirmation/interest inquiries for this release, or integrate real-time scheduling later? No live scheduling provider has been chosen.
4. Resolved: Mommy & Me includes the women’s haircut + blow-dry. Any substitutions or upgrades still need explicit pricing.
5. Is travel one-way from the Suncrest base, and are city names illustrative? Confirm private origin, rounding/traffic policy, free-consultation location/minimum treatment, and the routing provider before live estimates.
6. What reduction applies to neighborhood haircut days? Use manual quotes until supplied.
7. Biography, over ten years of experience, and two personal portraits were supplied in the November 5 copy update. Certifications, further specialties, support contact, and portfolio export/before-and-after pairs still need approval. Do not fill these with invented copy.

This revision plan supersedes the earlier pending-prices launch assumption and proposed active house-call/salon CTAs. It is not proof of licensing permission, a live booking system, or a completed Instagram migration.

## Review artifact

The three interactive concepts, full menu, pricing demonstration, and working scroll-driven wagon study are in `.lavish/hairnthere-next-chapter.html`. Review uses the supplied product palette/fonts/logo and the new `docs/inspiration.png` direction, following Lavish guidance. It is displayed inline in T3 rather than starting a separate annotation server. Feedback is copied into chat. The Scenic Journey implementation now includes the prices, availability gates, planner, and animation. The original review artifact is a historical design reference; current catalog files include the later-confirmed Mommy & Me inclusion and $75 travel band.
