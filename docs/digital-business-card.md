# Digital business card

Harry’s direction supersedes the earlier Apple/Google Wallet proposal: HairnThere needs a business landing page and a large, scannable digital business card for Elisabeth to show during door-to-door introductions. No Wallet accounts, signing credentials, membership enrollment, loyalty engine or referral program are part of this feature.

The homepage uses a restrained layout, thin borders, existing shadcn/Base UI components, the brand’s plum/cream/gold/blush colors, Playfair Display and Montserrat. Scenic mountain and Subaru artwork remains in a reserved decorative band. Content describes the business and offers consultations; appointment acceptance remains inactive under `src/data/availability.ts`.

`/card` is a dedicated presentation page without the site navigation/footer. Its QR grows to the available viewport width or height, whichever is smaller. A landscape layout preserves space on short screens. “Fill screen” opens an accessible Base UI sheet with minimal surrounding UI, keyboard dismissal and focus restoration. This fills the browser viewport; it does not change device brightness, lock orientation, request camera access or promise removal of browser chrome. Normal scrolling and zoom remain available. The QR and direct website link are server rendered and work without JavaScript. Copying and the enlarged view require JavaScript.

The QR points to `business.cardDestination` (`https://www.hairnthere.com/`), not back to the presentation page. Visitors scan Elisabeth’s screen to open the business homepage on their own phones. Both themes keep the QR black on white, with a four-module quiet zone and no overlaid logo. SVG keeps screen scaling crisp; the downloadable PNG is 1200 × 1200 pixels.

Run `pnpm create:card-qr` to regenerate the checked-in assets if the destination deliberately changes. Do not change an already printed destination casually. Before printing or door-to-door use, confirm domain/HTTPS redirects and scan from physical iPhone and Android devices under real lighting. Do not assume decoding an image locally proves a physical scan works.

The route group `(site)` retains normal site navigation/footer for the business pages. `/card` shares the root fonts, themes and metadata foundation without the site chrome; existing public URLs remain the same.

There is no contact download in this narrowed release and no public telephone number has been invented. Digital card visitors can use the existing contact form. There are no new data collection or marketing flows.
