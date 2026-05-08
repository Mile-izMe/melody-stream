const CACHE_VERSION = "v1";
const PROXY_CACHE_NAME = `melody-stream-proxy-${CACHE_VERSION}`;
const PROXY_PREFIX = "/api/s3/proxy/";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("melody-stream-proxy-"))
          .filter((cacheName) => cacheName !== PROXY_CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (!url.pathname.startsWith(PROXY_PREFIX)) {
    return;
  }

  if (request.headers.has("range")) {
    return;
  }

  event.respondWith(cacheProxyRequest(request));
});

async function cacheProxyRequest(request) {
  const cache = await caches.open(PROXY_CACHE_NAME);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw new Error(
      "Network request failed and no cached proxy response was available.",
    );
  }
}
