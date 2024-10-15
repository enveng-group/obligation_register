// Define the putInCache function
async function putInCache(request, response) {
    const cache = await caches.open('my-cache');
    await cache.put(request, response);
}

async function addResourcesToCache(resources) {
    const cache = await caches.open('my-cache');
    await cache.addAll(resources);
}

self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        const response = await fetch(event.request);
        await putInCache(event.request, response.clone());
        return response;
    })());
});

self.addEventListener('install', async (event) => {
    event.waitUntil(await addResourcesToCache([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
    ]));
});
