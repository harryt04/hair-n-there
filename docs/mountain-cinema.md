# Mountain Cinema

Harry approved Powder Day as the starting website direction, with all three Mountain
Cinema banners retained and randomly assigned on each full page load. This supersedes the older
Scenic Journey sidebar. The new art and layout were approved through the Mountain
Cinema Lavish review; the review files are optional local artifacts, not build inputs.

## Preserved artwork

- **Alpine Local:** black 2020 Outback interpretation, blush snowboard, neighborhood homes.
- **Powder Day:** the default/server-rendered view; snowy ridges, pines, chalets, gold board.
- **Night Shift:** pixel-art black Outback, blush board, warm porch lights and moon.

The original SVG artwork lives in `src/components/scenic/cinema-art.tsx`, informed by
[Subaru’s 2020 launch photographs](https://www.subaru.co.jp/press/news-en/2019_04_18_7147/).
Trim and accessories are illustrative. Elisabeth supplied the black 2020 Outback and
snowboarder persona through Harry; this does not imply the car is an operating salon.

## Assignment

`src/data/cinema.ts` owns the variant IDs, seasonal weights, and Powder Day fallback.
After hydration, the client draws once per full page load: **Powder Day 75%**,
**Alpine Local 12.5%**, and **Night Shift 12.5%**. Every full refresh, including mobile
pull-to-refresh, makes a fresh draw. The in-memory choice stays stable through client navigation; it is
not read from or written to browser storage. Each reload makes an independent draw,
so consecutive loads can legitimately show the same banner. The 75% winter weight is a probability per load, not a quota or a guarantee of
seeing a different banner on refresh.

Server rendering and no-JavaScript views consistently use Powder Day, avoiding random
server/client hydration mismatches. The browser-only draw happens when the store is
first subscribed to, not during render. An old `hairnthere-cinema-v1` session preference
from an earlier release is ignored and naturally expires with its tab session.

This is decorative variation, not an A/B test: no experiment IDs, retention events,
visitor identifiers, or assignment analytics are sent. Changes to seasonal/holiday weights or experimentation need a separate decision;
preserve the three artwork variants.

## Motion and space

`mountain-cinema.tsx` replaces the side rail with a reserved sticky horizontal ribbon
below the app bar. Normal page scroll drives route position, wheel detail, and layered
scenery; reverse scroll retraces it and the bottom clamps to the neighborhood endpoint.
The ribbon spans the site routes, including their footer. `/card` stays a standalone
presentation page. The car, route, and scenery are decorative, nonfocusable, and ignore
pointer events. Reading, forms, and the gallery never depend on motion.

One passive scroll listener schedules requestAnimationFrame work. Route samples and
geometry are measured outside scroll frames. Resize, font loading, and pageshow update
geometry; unmount cleans up observers/listeners and cancels the frame. Reduced motion
parks the car and all scenery; no JavaScript shows a static Powder Day scene. The page
works with storage disabled. Keep the reserved height and anchor scroll offset in
`globals.css` coordinated with the app bar.

## Landing page and gallery

Use the approved gallery-led composition: compact introduction, prominent @hairnthere
heading and photographic carousel, then a neighborhood welcome, unpriced services, family visits, the supplied
first-person biography and both Elisabeth portraits, compact FAQ disclosures,
and the three-stage house-call inquiry. The large QR presentation lives at `/card`,
linked from the app bar and slim footer. Keep **QR Code**
visible in the app bar on mobile and desktop; it opens `/card`. The QR assets and
copy link use `https://hairnthere.com/` without www.

The gallery uses shadcn’s carousel with 11 real portfolio posts collected from
@justbeyou_hair without an API key. Content is server-rendered with local images;
native scrolling works before JavaScript initializes. Follow links go to @hairnthere;
individual covers link to the original posts. Reel covers are labeled as still
previews, with playback on Instagram. This is a partial collection, not a live feed.
`src/data/gallery.ts` derives selected entries from `src/data/instagram-posts.json`;
see [the inventory](instagram-inventory.md) for original captions, grouping, and gaps.

Business rules remain in `docs/elisabeth-revision-plan.md` and the existing catalog,
quote, and availability modules. Harry opened house-call inquiries in the November 5 contact redesign;
salon/event appointment acceptance stays inactive. Visits and personal quotes are
confirmed manually. There are no new payments, routing, or automated messages.
