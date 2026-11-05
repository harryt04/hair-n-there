# HairnThere PWA

## Scope and implementation

1. Extend the existing Next.js manifest with stable `id: "/"`, root scope, language, and dedicated maskable Android icons. Preserve standalone launch at `/`, the detailed brand logo, and Next.js icon conventions. Generate maskable artwork with the full logo inside Android's central safe circle.
2. Add an in-flow install suggestion below the site content. Capture `beforeinstallprompt` at the root, offer a native install button only when available, and consume each event once. Provide Android Chrome menu and iPhone Safari instructions when no native prompt is available. Hide the suggestion in standalone mode/after installation, and allow dismissal for the current tab session. No modal, automatic native prompt, or notification permission request.
3. Register a small first-party service worker in production builds on secure origins (localhost is also allowed). Cache only a self-contained offline information page. Normal pages always use the network; API calls, submissions, Next.js data requests, and future checkout/auth routes pass through untouched. There is no offline inquiry queue, payment processing, or background sync.
4. Version only the app's offline cache and remove older versions on activation. Updates wait for existing tabs to close, avoiding forced reloads or interruption of an inquiry. Revalidate the worker script on update checks. Update the cache version whenever the offline page changes.
5. Document device installation, offline limits, maintenance, and future booking/payment prerequisites. Disclose the offline cache and session dismissal preference in Privacy; existing inquiry and service rules remain in force.

## Verification

Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Inspect the production HTTP manifest, assets, worker headers, and offline HTML. Manually exercise the worker's network success/failure and request exclusions and the install controller's available/dismissed/installed/error paths without adding a test suite or runner.

Release acceptance on a real Android phone requires the deployed HTTPS site: open Chrome, visit/interact with the site, choose Install HairnThere when Chrome makes it available (or Chrome menu → Add to home screen → Install), launch from the new icon, check navigation/forms and both themes, then disconnect and reopen to check the offline message. Confirm updates after closing all app windows. Check iPhone Safari's Share → Add to Home Screen separately if used. Browser policy controls prompt eligibility/timing; a first-visit prompt cannot be guaranteed. Preview hostnames install as separate apps; Elisabeth should install the production domain.

## Future booking and payments

PWA installation does not activate appointments or provide a booking backend. Booking, authentication, provider checkout/redirects, payment confirmation webhooks, durable consent, and idempotency need their own implementation and device verification. Keep these flows network-only; confirm provider support for standalone browsers and external authentication/payment handoffs before enabling them. No new paid service or credentials are required for this release.

## References

- [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps), also bundled in the installed Next.js documentation.
- [Browser installation prompts](https://web.dev/learn/pwa/installation-prompt).
- [Maskable icon safe zone](https://web.dev/articles/maskable-icon).

## Local verification completed — November 4, 2026

- `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed.
- Served the production build locally and checked the linked manifest, stable identity/root scope, server-rendered installation guidance, PNG dimensions/opacity, service-worker content type and cache/security headers, and self-contained offline HTML.
- Exercised worker install/cache cleanup, successful network navigation, offline fallback, missing-cache response, and exclusions for POST, API, Next.js data/assets, external origins, authentication and checkout/payment paths with temporary local simulations.
- Exercised install-event availability, single-use handling, dismissal, acceptance, prompt failure, installed/standalone state, blocked session storage, and listener cleanup with temporary local simulations. These are targeted implementation checks, not actual browser/device install verification; no test suite or runner was added.
- Physical Android installation, real browser service-worker lifecycle/offline behavior, mobile visual inspection, and future provider handoffs remain release checks. No push, deployment, booking activation, or paid-service setup was performed.
