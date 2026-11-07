# HairnThere design direction

Status: concept 01 approved by Harry and implemented in the Next.js app. Preview: `.lavish/hairnthere-design.html` (portable HTML, original logo embedded; Google fonts and stock mood images require network).

## Design source

Use the named product design system from `color-palette-context.md` and the supplied `logo.png`: mountain boutique, modern luxury, exact light/dark tokens, Playfair Display headings, Montserrat body text. The review follows Lavish's plan/comparison/input guidance and is displayed inline in T3. No separate review server is started; feedback is copied into chat. The HTML is a design prototype, not an installed shadcn application.

## Proposed experience

- Warm editorial homepage: compact wordmark, house-call and salon calls to action, original illustration, prominent selected-work gallery/Instagram link, service cards, and group-estimate invitation.
- Keep “Great Hair Travels.” as the brand tagline. The prototype tests “Great hair. A little closer to home.” as supporting homepage copy.
- Quote: appointment location first, quantities, consultation-only services, service area, then an explicit estimate summary and contact step. Pending fees remain pending; consultations are not silently priced at zero.
- Contact: name/email, optional phone/date, notes, optional unchecked SMS opt-in, adjacent Terms/Privacy links. Confirm success only after real delivery. The prototype sends/stores nothing.
- Terms/Privacy: readable narrow text layouts adapted from the Sunshine Flower Bar repo; real details and registration requirements resolved before SMS activation.
- Production homepage also includes about Elisabeth, service-area details, and FAQs. These content sections are not fully mocked in concept 01 and depend on supplied business content.
- Mobile: stacked hero, clear primary action, two-column portfolio, stacked services, quote summary below selections. Use a functional Sheet menu if the production navigation needs additional links.
- Dark mode: exact lodge palette and gold primary; keep the full original illustration on a cream surface. Support system preference and reduced motion.

## shadcn implementation mapping

- Button: primary/secondary actions and quantity controls (with numeric accessible labels).
- Card: services, estimator selections, estimate summary, and next-steps information.
- RadioGroup styled as a segmented control: mutually exclusive house-call/salon selection.
- Input, Label/Field, Textarea, Select, Checkbox: quote/contact controls with inline validation.
- Sheet: mobile navigation when needed; Accordion: FAQs; Separator: summary structure.
- Sonner for supplementary feedback; durable inline status/error messages for submission outcomes. Do not rely on a toast alone.
- Prototype review tabs, screen-width controls, sample labels, and feedback form are review tools and will not ship in the website.

## Logo asset plan

1. Preserve original `logo.png`; make an optimized web export for hero/about/social usage. Its fine lettering is unsuitable for tiny navigation or favicons.
2. Refine an approved compact wordmark for header/footer, preferably vector, with light/dark variants. Current Playfair wordmark is a direction study, not a traced or finalized logo.
3. Develop a simplified monogram/mountain favicon. The prototype's h/mountain is a vector study; compare at actual 16/32px and remove detail that becomes illegible.
4. Export approved SVG + 16/32px PNG/ICO favicon, 180px Apple touch icon, and 192/512px app icons. Verify light/dark browser chrome contrast.
5. Create a 1200×630 social card from the approved identity. Code-native favicon, touch/app icons, compact wordmark exports, and a social card are implemented following approval.
6. Use the original illustration deliberately in dark mode until an approved transparent/dark-compatible asset exists; avoid automatic color inversion or removing details by CSS.

## Review decisions

- Overall warmth/editorial balance: retain, more adventurous, more luxurious, or more playful?
- Logo hierarchy: full illustration as centerpiece + compact navigation wordmark + simple favicon?
- Changes to layout, copy, and contact/estimate flow before implementation?

Stock mood images and all dollar amounts in the prototype are illustrative. Replace before production; the Instagram URL is a generic placeholder until the account is supplied. No fabricated testimonials, portfolio ownership claims, availability promises, or response-time guarantees.

After approval: scaffold the application, translate the visual system to shadcn components, finalize logo assets, implement actual content/estimator/contact/policies, and connect Coolify deployment from main (see README.md). No tests, pull requests, or GitHub Actions.
