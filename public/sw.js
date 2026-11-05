/* Only the public, self-contained fallback is stored. Bump when it changes. */
const OFFLINE_CACHE = "hairnthere-offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(OFFLINE_CACHE)
      .then((cache) =>
        cache.add(new Request(OFFLINE_URL, { cache: "reload" })),
      ),
  );
  // Let updates wait until existing windows close; never reload an active form.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("hairnthere-offline-") && key !== OFFLINE_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Only document navigations. Never intercept APIs, POSTs, RSC, or checkout.
  if (
    request.method !== "GET" ||
    request.mode !== "navigate" ||
    url.origin !== self.location.origin ||
    /^\/(?:api|_next|auth|checkout|payments)(?:\/|$)/.test(url.pathname)
  )
    return;

  event.respondWith(
    fetch(request).catch(async () => {
      const fallback = await caches.match(OFFLINE_URL, {
        cacheName: OFFLINE_CACHE,
      });
      return (
        fallback ||
        new Response("You are offline. Reconnect and try again.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      );
    }),
  );
});
