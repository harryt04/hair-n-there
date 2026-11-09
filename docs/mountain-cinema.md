# Mountain Cinema

Harry approved Powder Day as the starting website direction, with all three Mountain
Cinema banners retained. First visits start in winter; subsequent full loads vary. This supersedes the older
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
The first full load with no valid preference always shows **Powder Day**, the winter
mountain scene. Every later full load, including refresh and mobile pull-to-refresh,
excludes the scene currently displayed in that tab. The remaining choices retain
relative weights: after Powder Day, each alternative has a 50% chance; after either
alternative, Powder Day has a 6/7 chance and the other alternative a 1/7 chance.
Client navigation keeps the in-memory choice.

The browser preference stores the last scene and activity timestamp in local storage
under `hairnthere-cinema-visit-v3`. It expires after 24 hours of inactivity; the next
visit starts with winter again. Pointer, keyboard, and scroll activity renew it
(with writes limited to once per 30 seconds), as do page departure and return within
that window. Hidden tabs do not renew it in the background. Returning to an expired
open or back/forward-cached page also resets to winter.
A separate tab-scoped `hairnthere-cinema-tab-v3` record preserves the displayed scene
so another tab cannot cause a refresh to repeat it. Invalid/expired values and older
preferences are ignored. Blocked or cleared storage falls back to winter; refresh
variation requires browser storage. These records contain no visitor identifier.

Server rendering and no-JavaScript views consistently use Powder Day, avoiding random
server/client hydration mismatches. The browser-only draw happens when the store is
first subscribed to, not during render.

This is decorative variation, not an A/B test: no experiment IDs, retention events,
visitor identifiers, or assignment analytics are sent. Changes to seasonal/holiday
weights or experimentation need a separate decision; preserve the three artwork variants.

## Motion and space

`mountain-cinema.tsx` replaces the side rail with a reserved sticky horizontal ribbon
below the app bar. Normal page scroll drives route position, wheel detail, and layered
scenery; reverse scroll retraces it and the bottom clamps to the neighborhood endpoint.
The ribbon spans the site routes, including their footer. `/card` stays a standalone
presentation page. The car, route, and scenery are decorative, nonfocusable, and ignore
pointer events. Reading, forms, and the gallery never depend on motion.

One passive scroll listener schedules requestAnimationFrame work. Route samples and
geometry are measured outside scroll frames. Resize, font loading, and pageshow update
geometry; unmount cleans up observers/listeners and cancels the frame.

On mobile (below 768px), Harry approved the **smaller ribbon** behavior: normal
scrolling down compresses the 112px scene to 40px over 72px of travel; scrolling
up expands it again, wherever the visitor is on the page. The Subaru scales with
the scene and keeps traveling. The caption fades out as space contracts. The 64px
app bar remains visible; desktop/tablet retain the 145px ribbon. Small scroll jitter
and elastic overscroll do not change direction. Resize and content measurements
preserve the current collapse amount within the active breakpoint.

The sticky outer ribbon retains its original document footprint. Its sticky top
moves upward by the collapse amount while a shorter, bottom-aligned inner scene
keeps the visible artwork directly under the app bar. This reclaims screen space
without changing document height, invoking scroll anchoring, intercepting touch or
wheel input, or adding a second scrolling container. Anchor offsets keep the full
ribbon allowance so reverse-scroll expansion cannot hide the target heading.

Reduced motion parks the car and all scenery; the mobile ribbon still resizes
directly with scroll, without added easing. No JavaScript shows a static full-height
Powder Day scene. The page works with storage disabled. Keep the reserved height and anchor scroll offset in
`globals.css` coordinated with the app bar.

## Landing page and gallery

Use the approved gallery-led composition: compact introduction, prominent @hairnthere
heading and photographic carousel, then a neighborhood welcome, unpriced services, family visits, the supplied
first-person biography and both Elisabeth portraits, compact FAQ disclosures,
and the three-stage house-call inquiry. The large QR presentation lives at `/card`,
linked from the app bar and slim footer. Keep **QR Code**
visible in the app bar on mobile and desktop; it opens `/card`. The QR assets and
copy link use `https://hairnthere.com/` (home page, without www; originally `/services`).

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

## About photo layout

Harry approved option 4, **Woven through the story**, in the November 6 photo
layout review. The biography heading precedes a Subaru portrait floated left
beside the introduction, followed by the Sundance photo floated right beside
the origin story. Below 768px, the order is heading, Subaru, introduction,
Sundance, origin story and location note. Keep the approved biography intact,
use the supplied photos, and preserve the 4:5 mobile crops.
