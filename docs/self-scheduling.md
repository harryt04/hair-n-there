# Self-scheduled tentative holds

Status: approved and implemented (2026-11-16); live holds stay off until Google is configured. For requirements, architecture, and how to orchestrate future agents, see [`self-scheduling-trd.md`](self-scheduling-trd.md).

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

## Google Calendar setup (for Harry or an agent)

Google setup instructions checked against the linked Google developer documentation on 2026-11-16. Do this with Harry and Elisabeth when they are ready to enable live holds; never paste credentials or refresh tokens into chat, logs, Git, or screenshots.

1. **Create/select a Google Cloud project.** In Google Cloud Console, use the project picker → New project, give it a recognizable HairnThere name, and select it. Follow Google’s [project setup guide](https://developers.google.com/workspace/guides/create-project).
2. **Enable Google Calendar API** in APIs & Services → Library for that project. Google’s [Calendar quickstart](https://developers.google.com/workspace/calendar/api/quickstart/python) documents enabling the API and creating a Desktop app client; use our Node helper below instead of its Python sample.
3. **Configure OAuth consent.** In Google Auth platform, complete Branding with the app name and actual support/developer contact details. Choose **External** under Audience; while Testing, add Elisabeth’s exact Google account as a test user. Under Data Access → Add or remove scopes, add exactly:

   - `https://www.googleapis.com/auth/calendar.events.owned`
   - `https://www.googleapis.com/auth/calendar.events.freebusy`

   These match `GOOGLE_CALENDAR_SCOPES` and the auth script: owned-event access for holds and free/busy access for accessible calendars. See Google’s [consent setup](https://developers.google.com/workspace/guides/configure-oauth-consent) and [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth). Before generating the lasting token, use Audience → Publish app so the publishing status is **In production**. External apps left in Testing receive refresh tokens that expire after seven days for these scopes; production status removes that Testing limit, not every possible token expiry. See [refresh-token expiration](https://developers.google.com/identity/protocols/oauth2#expiration). For this integration only Elisabeth authorizes Google access; customers receive invitations without authorizing the app. An unverified-app warning is acceptable for her single account: review the app identity, then choose Advanced → continue. Google documents this limited-use [verification exception](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification#exceptions_to_verification_requirements); revisit verification if authorization expands to other users.
4. **Create a Desktop app OAuth client**, under Google Auth platform → Clients → Create client. Save its client ID and client secret securely. Do not create a Web application client or register the website as the callback: the helper uses `http://127.0.0.1:<port>/callback` on the computer running it, with a random available port by default. Desktop clients support this [loopback redirect flow](https://developers.google.com/identity/protocols/oauth2/native-app#redirect-uri_loopback). Optional helper-only `GOOGLE_AUTH_PORT` selects a fixed local port; it is not an application/Coolify setting.
5. **Obtain the refresh token locally.** In this checkout with dependencies installed, securely export `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` into the shell environment, then run `pnpm google:auth`. This standalone Node script does not automatically load `.env.local`. Open the printed URL in a browser on the same computer, signed in **as Elisabeth**, the calendar owner. Leave both permission checkboxes selected. The helper waits up to five minutes, validates the callback and granted scopes, and prints the refresh token; it writes nothing to disk. Save it securely as `GOOGLE_CALENDAR_REFRESH_TOKEN` in Coolify and clear terminal scrollback. It requests offline access and consent so the server can refresh access without another interactive sign-in.
6. **Configure server-only runtime variables in Coolify.** Set `BOOKING_ENABLED=true`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_CALENDAR_REFRESH_TOKEN`. In production (`VERCEL_ENV=production`), set `GOOGLE_CALENDAR_ID` to the calendar Elisabeth owns and wants holds written to; an empty value defaults to `primary`. Copy an explicit calendar ID from that calendar’s Google Calendar settings → Integrate calendar → Calendar ID, not its display name or public URL. Optional `GOOGLE_BUSY_CALENDAR_IDS` is a comma-separated list of other calendars her account can read for busy time. The hold calendar is always checked; the combined unique list must contain at most 10 calendars.

   For a separate preview application, set `VERCEL_ENV=preview` at build and runtime and provide isolated preview OAuth credentials/token under the same credential variable names. Use a separate Google project/client for testing and a calendar owned by that authorized account. Set `GOOGLE_PREVIEW_CALENDAR_ID` explicitly and optionally `GOOGLE_PREVIEW_BUSY_CALENDAR_IDS`; there is **no fallback** to production hold or busy calendars. Do not give preview the production secrets or production calendar IDs. Preview without its own calendar stays disabled. Keep the separate Discord preview webhook configured too. Booking settings are runtime-only, never `NEXT_PUBLIC_*`; the application build does not need Google credentials. Leave `BOOKING_DEMO` unset outside local development.
7. **Redeploy/restart the application** to load the runtime configuration, then perform the checks below in preview first. Configuring credentials alone is not evidence of working calendar access. Keep real customer data out of setup checks.

### Verification checklist

- With `BOOKING_DEMO` off, open `/contact`, choose a simple haircut count, and continue to stage 2. The JSON POST to `/api/availability` for a month inside the next 60 days should return `enabled: true` and open times when the calendar has room. Verify Mountain Time hours, 24-hour notice, and busy blocks with the private 30-minute buffer on both sides. Empty/consultation-only/overlong selections use free-text timing instead.
- Submit a test time request using an email account you control and clearly marked sample details. Verify a **tentative**, busy-blocking event on the intended calendar, its customer attendee, address, counts/services, estimated duration, contact details and message. No prices belong in the event. It is a hold, never a confirmed booking or price.
- Verify the customer receives Google’s invitation (check spam and calendar invitation settings), and that the event details are readable by that attendee. Google event creation acknowledges the time request; the server also attempts a Discord notice, but a failed/missing Discord webhook does not undo a successful hold. Ordinary inquiries still require acknowledged Discord delivery.
- Move the test event in Google Calendar, keeping it marked busy, then refresh availability: its new interval must block slots and its old interval should reopen if no other busy block or scheduling rule prevents it. Elisabeth confirms, moves, or declines requests directly in Google Calendar; there is no customer rescheduling link yet.
- Delete the test event after checking. To stop new holds, unset `BOOKING_ENABLED` (or set it to `false`) and redeploy/restart. Verify availability reports disabled and the form offers free-text timing; existing events are not deleted by disabling booking.

### Troubleshooting

- **`invalid_grant`:** the refresh token is expired or revoked, or was issued while the consent screen was in Testing. Publish to In production, re-run `pnpm google:auth` as Elisabeth, replace the Coolify refresh token, and redeploy. Removing the app’s account access invalidates authorization. After an account password/security change, check access and reauthorize if rejected; Google’s password-change expiry example specifically concerns Gmail scopes, so do not assume every Calendar token is invalidated. See Google’s [token-expiration guidance](https://developers.google.com/identity/protocols/oauth2#expiration).
- **No refresh token or missing permission:** follow the helper’s instructions to remove the app’s access in Google account permissions and run it again, granting both scopes. Revocation can affect other clients in the same project; use separate preview authorization. **`invalid_client` / `unauthorized_client`:** check the matching Desktop client ID and secret, without logging their values.
- **Calendar unavailable or wrong destination:** verify the exact calendar ID, ownership of the hold calendar, access to every busy calendar, API enablement and granted scopes. Any configured calendar read error fails closed rather than treating it as free. In preview, verify the preview environment marker and preview calendar variables; production IDs are ignored there.
- **Unexpected openings or no openings:** only events marked busy on the configured calendars block time. Include every relevant calendar in the appropriate comma-separated busy list; the hold calendar is included automatically. Check the 10-calendar limit, working hours, notice/horizon, estimated duration and buffers. This is not driving-time routing. Browser fallback can also mean Google or shared rate limiting is unavailable; inspect sanitized server configuration errors without printing provider bodies or customer data.

## How it’s wired

- `src/data/schedule.ts`: Mountain Time working windows, 30-minute buffer/start steps, 15-minute setup, 24-hour notice, 60-day horizon and duration estimates.
- `src/lib/schedule.ts` and `src/lib/schedule-types.ts`: duration/slot calculations and shared contracts.
- `src/lib/google-calendar.ts`: server-side environment selection, exact OAuth scopes, access-token refresh, free/busy reads, tentative event insertion with `sendUpdates=all`, and hold deletion support.
- `scripts/google-calendar-auth.mjs` (`pnpm google:auth` in `package.json`): local Desktop OAuth/PKCE loopback helper for the refresh token.
- `src/lib/booking.ts`: live booking gate, request guards, calendar helpers and development-only demo (`BOOKING_DEMO=true pnpm dev`); synthetic holds live in process memory and send no invitations.
- `src/app/api/availability/route.ts`: bounded, rate-limited JSON POST; validates selections, recomputes duration, reads busy time and returns open slots or fallback status.
- `src/app/api/contact/route.ts`: validates the time request, rechecks availability under a booking lock, applies the per-email and daily hold caps, creates the tentative event (contact details and services, with no free-form message and no links) with the customer as attendee, and attempts the Discord notice. Non-time inquiries retain the Discord acknowledgement path.

## Later (not built)

- Elisabeth editing her own hours (better-auth with Google sign-in, a database, and an admin page).
- Signed cancel/reschedule links for customers.
- Real driving-time routing in place of the fixed buffer.
