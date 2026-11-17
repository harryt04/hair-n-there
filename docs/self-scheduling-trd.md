# Self-scheduling PRD / TRD

Audience: future orchestration and implementation agents changing the house-call time picker, the availability/booking API, or the Google Calendar integration. Read this, `docs/self-scheduling.md` (rules, Google setup, troubleshooting) and `AGENTS.md` before delegating work.

- **Status:** implemented on `feat/self-scheduling` (PR #4). Live booking is off until Google is configured.
- **Approved design:** [`docs/design/self-scheduling-ux.html`](design/self-scheduling-ux.html). Open it directly in a browser. **Option B** is the approved direction. Options A, C and D remain for context only.
- **Owner decisions:** Harry, 2026-11-16.

## 1. Product requirements (PRD)

### Problem
Customers on phones want a Calendly-style way to pick a house-call time without paying for Calendly. Elisabeth wants her regular hours offered automatically, and her existing Google Calendar commitments respected.

### Users
- **Customers** (mostly on phones): families booking haircuts and color at home in the Suncrest/Draper area.
- **Elisabeth:** reviews requests in Google Calendar and confirms, moves or declines them.
- **Harry:** configures hours in code and environment variables in Coolify.

### Requirements
| ID | Requirement |
|---|---|
| P1 | House calls only. Salon and event settings stay inquiry-only (`holdsTentativeTimes` in `src/data/availability.ts`). |
| P2 | A chosen time creates a **tentative hold**, never a confirmed booking or price. Copy says “requested” or “tentative hold”, never “booked” or “confirmed”. |
| P3 | Offered times are her working windows (Mon–Wed and Sat 9 AM–9 PM, Thu–Fri 9 AM–2 PM, Sun 9 AM–3 PM, Mountain Time), minus anything busy on her Google Calendar. |
| P4 | Visit length is estimated from stage-1 counts and services (upper durations plus setup). Consultation-required, empty, or over-8-hour selections fall back to free-text timing. |
| P5 | The customer receives a Google Calendar invitation by email (email required for time requests). |
| P6 | Elisabeth can reschedule by moving the event in Google Calendar; availability reflects it. |
| P7 | Phone-first UX per option B: week strip with open counts; time chips grouped Morning/Afternoon/Evening with end times; the calendar as a bottom sheet on phones and a popover on desktop; gold availability dots; sticky time bar with Back/Continue on phones; a visitor time-zone hint. |
| P8 | Every failure (disabled, Google down, slot taken, caps) leaves a working path: the free-text timing fields. |
| P9 | No login, database, payment, or deposit in this phase. Hours change by code change and deploy. |

### Non-goals (later phases)
- Elisabeth editing her own hours in an admin UI (better-auth with Google sign-in plus a database).
- Customer cancel/reschedule links, deposits, SMS reminders.
- Driving-time routing (the fixed 30-minute buffer stands in until routing is approved).

### Success criteria
A phone visitor can go from stage 2 to a requested time in a few taps without horizontal scrolling. Elisabeth sees a tentative event with the details she needs. No double holds for overlapping times. Nothing breaks when Google is unavailable.

## 2. Technical design (TRD)

### Stack
- **Framework:** Next.js 16 App Router with Cache Components and Turbopack, React 19, TypeScript, Tailwind CSS 4.
- **UI kit:** shadcn `base-nova` on Base UI; use `render`/`nativeButton={false}`, never `asChild`.
- **Libraries:** zod 4 for validation; `react-day-picker` via the shadcn `Calendar`.
- **Tooling:** pnpm 11 on Node 26.
- **Integrations:**
  - Google Calendar REST API, called with plain `fetch`, no SDK.
  - Discord webhook for notifications.
  - Optional Upstash Redis REST for shared rate limits and locks.
- **Hosting and process:** Coolify. No test suites, CI, or Docker pipeline; verify locally with lint, typecheck and build.

### Data flow
1. `contact-form.tsx` stage 2 renders `SlotPicker` (only when stage 2 is active and the counts are complete).
2. `SlotPicker` → `POST /api/availability {counts, services, packages, month}`. The route:
   - checks the request (origin, rate limit, schema);
   - turns the visitor's selection into an estimated duration with `estimateAppointment`;
   - looks up the bookable date range with `bookingRange`;
   - reads her busy time from Google once (`getBusyIntervals`, a freeBusy call);
   - computes the open times with `computeOpenSlots` and returns days and slots (UTC ISO strings).
3. Submit → `POST /api/contact` with `slotStart`. The route:
   - runs the usual checks: rate limit, schema, honeypot;
   - recomputes the estimate on the server;
   - runs a cheap `isSlotOpen` pre-check on hours and notice;
   - takes the per-day lock (`booking-day:<date>`);
   - fetches fresh busy time and re-runs `isSlotOpen`;
   - checks the caps: 12 holds per day sitewide and 2 per email per week;
   - calls `createTentativeHold` (status tentative, attendee, `sendUpdates=all`);
   - releases the lock, then sends a best-effort Discord notice and returns 200.
4. Requests without `slotStart` follow the original inquiry path unchanged (Discord acknowledgement required).

### API contract
Types live in `src/lib/schedule-types.ts`. Every response sends `Cache-Control: no-store`.

- **`/api/availability`**
  - `200 {enabled:true, timeZone, durationMinutes, firstDate, lastDate, days[]}`
  - `200 {enabled:false, reason: disabled|unavailable|nothing_selected|consultation_required|too_long}`
  - Errors: 400, 403, 408, 413, 415, 429.
- **`/api/contact` with a slot**
  - `200 {success, message, hold:{start,end}}`
  - `400 fieldErrors.slotStart`
  - `403 booking_unavailable`: disabled or wrong setting.
  - `409 slot_unavailable`: gone, taken, or day busy; each has its own message.
  - `429 booking_unavailable`: caps.
  - `503 booking_unavailable`: calendar or lock failure.
  - The UI branches on `code`, not on the status number.

### Configuration
Variables are server-only and read at runtime; exact names are in `.env.example` and README.
- `BOOKING_ENABLED`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_CALENDAR_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`, `GOOGLE_BUSY_CALENDAR_IDS`.
- **Preview:** uses only `GOOGLE_PREVIEW_CALENDAR_ID` and `GOOGLE_PREVIEW_BUSY_CALENDAR_IDS`. It never falls back to production.
- **Dev only:** `BOOKING_DEMO=true pnpm dev` serves synthetic availability and never calls Google. Production builds ignore it.

### Security and privacy invariants
- Browser durations, slots and availability are untrusted; the server recomputes and re-verifies them.
- Fail closed: a Google or Redis error never reads as “free”.
- **Invitation content:** Google sends the invitation from Elisabeth's account to whatever email was submitted, so it carries:
  - no prices;
  - no free-form message (that goes to Discord only);
  - names and addresses as plain text with links stripped.
- Logs carry only fixed messages: no customer data, tokens, or provider bodies.
- Discord escaping and disabled mentions stay preserved.
- Privacy/Terms describe calendar storage. Update them if the handling changes.

### File map
| Area | Files |
|---|---|
| Config and contract | `src/data/schedule.ts`, `src/lib/schedule-types.ts`, `src/data/availability.ts`, `src/lib/inquiry-validation.ts` |
| Slot engine | `src/lib/schedule.ts` (pure; DST-safe `Intl` math) |
| Google | `src/lib/google-calendar.ts`, `scripts/google-calendar-auth.mjs` (`pnpm google:auth`) |
| Server glue | `src/lib/booking.ts` (gate, guards, demo), `src/lib/rate-limit.ts` (buckets, caps, locks), `src/lib/discord.ts` |
| Routes | `src/app/api/availability/route.ts`, `src/app/api/contact/route.ts` |
| UI | `src/components/contact/slot-picker.tsx`, `src/components/contact/contact-form.tsx`, `src/components/ui/{calendar,popover,sheet}.tsx` |
| Docs | `docs/self-scheduling.md`, this file, `docs/design/self-scheduling-ux.html`, README, `.env.example`, Privacy/Terms pages |

## 3. Orchestration playbook

1. **Agree contracts first.** Change `schedule-types.ts` and the data files yourself before splitting work. Give each agent distinct files: the slot engine, the Google client, the routes, and the UI are separable along the file map above.
2. **Models.** Harry's preference: Opus 5.5 at medium effort for security-sensitive server and integration work and for reviews. gpt-6.1-sol at medium for well-specified UI and algorithm work, and at low for docs.
3. **Briefs must include:** the checkout path; `npx -y pnpm@11.17.0` (pnpm may not be on PATH); “no commits, no test suites”; the file ownership list; and the relevant contract excerpt.
4. **UI validation (required):**
   - Point UI agents at `docs/design/self-scheduling-ux.html`. Require an item-by-item report against its “Interaction spec for implementers” checklist, mobile section first, and against the “States every option shares” frames.
   - A human or agent with a browser should compare `/contact` (run `BOOKING_DEMO=true pnpm dev`) at 375px and desktop width, in light and dark themes, with option B in the reference.
5. **Server validation:** curl the scenarios in PR #4’s description in demo mode:
   - a hold (200);
   - the same slot again (409);
   - a forged off-hours time (409);
   - a salon request with a slot (400);
   - the third hold from one email (429);
   - availability with booking disabled (`disabled`);
   - an ordinary inquiry, which must be unchanged.
6. **Review:** finish with a fresh Opus review of the diff (time zones and DST, abuse, fail-closed paths, regressions in ordinary inquiries, how closely the UI matches the spec). Then run lint, typecheck and the production build.
7. **Known environment quirk:** Next 16.4.4 prints a security advisory and stops `next dev`/`next build` once; a retry continues. Concurrent dev servers in one checkout can repeatedly re-trigger it. Upgrading Next is Harry's decision.

## 4. Go-live checklist (Harry)
Follow “Google Calendar setup” in `docs/self-scheduling.md`: create the Google Cloud project and OAuth client, run `pnpm google:auth` as Elisabeth, set the Coolify variables (preview first), then verify with the checklist there. Turn it off by unsetting `BOOKING_ENABLED`.
