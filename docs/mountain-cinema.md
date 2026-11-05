# Mountain Cinema

Harry approved Powder Day as the starting website direction, with all three Mountain
Cinema banners retained and randomly assigned to visitors. This supersedes the older
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

`src/data/cinema.ts` owns the variant IDs and Powder Day fallback. The client chooses
one of the three with equal probability after hydration, stores only the variant ID
under `hairnthere-cinema-v1` in sessionStorage, and keeps it across reloads and client
navigation in that tab. Closing the tab ordinarily ends that visit; a duplicated tab
can inherit its session storage. If storage is blocked, the in-memory choice lasts
until a full reload. Invalid stored IDs are replaced. Server rendering and no-JavaScript
views consistently use Powder Day, avoiding random server/client hydration mismatches.

This is decorative variation, not an A/B test: no experiment IDs, retention events,
visitor identifiers, or assignment analytics are sent. Future seasonal/holiday rules or
experimentation need a separate decision; preserve the three artwork variants.

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
heading and photographic contact sheet, then services, family plans, story, availability,
FAQ, consultation invitation, and QR sharing just above the legal footer. Keep **QR Code**
visible in the app bar on mobile and desktop; it opens `/card`. The existing QR assets
and `https://www.hairnthere.com/` destination remain unchanged.

The gallery is server-rendered and links to @hairnthere, with first-party images that
stay visible without Instagram embeds, trackers, or JavaScript. Current images are
explicitly **stock inspiration, not Elisabeth’s work**. Approved posts/export from
@justbeyou_hair remain an external content task; no live-feed integration is claimed.
`src/data/gallery.ts` owns those entries; local source credits accompany new assets.

Business rules remain in `docs/elisabeth-revision-plan.md` and the existing catalog,
quote, and availability modules. Consultations/interest stay open; appointments stay
inactive. There are no new payments, routing, automated messages, or service launches.
