# Self-scheduled tentative holds

Status: approved design (2026-11-16); implementation in progress.

## What it does

House-call customers can pick an open time in contact stage 2 (“Your visit”). The server places a **tentative** event on Elisabeth’s Google Calendar and invites the customer by email. Elisabeth confirms, moves, or declines it in Google Calendar. The site never says “booked” or “confirmed”. Salon and event settings stay inquiry-only (`holdsTentativeTimes` in `src/data/availability.ts`).

## Rules

- Working windows live in `src/data/schedule.ts` (Mountain Time): Mon–Wed and Sat 9 AM–9 PM, Thu–Fri 9 AM–2 PM, Sun 9 AM–3 PM. Changing them is a code change and a deploy.
- Anything on her Google Calendar (busy time) blocks overlapping slots. A private 30-minute travel buffer is kept before and after every busy block and is never shown to customers.
- Duration is an estimate from stage 1 (`estimateAppointment` in `src/lib/schedule.ts`) plus 15 minutes of setup. Consultation-required services, empty selections, and estimates over 8 hours fall back to the free-text timing fields.
- 24-hour minimum notice and a 60-day horizon, in 30-minute start steps.
- The server recomputes duration and re-checks the slot against a fresh busy query before writing a hold. Browser-supplied slots are untrusted.
- Booking is off unless `BOOKING_ENABLED=true` and Google credentials are configured. Preview deployments use their own calendar and never fall back to production. See `.env.example` and README.

## Approved UI

The reference is [`docs/design/self-scheduling-ux.html`](design/self-scheduling-ux.html). Open it directly in a browser; it’s self-contained apart from Google Fonts. Implementations must match **option B** in its default phone view and satisfy its “Interaction spec for implementers” checklist. That page also shows the shared states (loading, slot taken, consultation needed, live times unavailable, stage-3 email, success).

Approved details: week strip with open counts, time chips grouped Morning/Afternoon/Evening with end times, the calendar as a bottom `Sheet` on phones and a `Popover` on desktop, gold availability dots, a sticky bottom time bar on phones, and a hint when the visitor’s time zone isn’t Mountain. Not adopted: the “soonest openings” row.

To validate a change: run the app, open `/contact` at 375px and at desktop width in light and dark themes, and compare stage 2 with option B in the reference, state by state.

## Later (not built)

- Elisabeth editing her own hours (better-auth with Google sign-in, a database, and an admin page).
- Signed cancel/reschedule links for customers.
- Real driving-time routing in place of the fixed buffer.
