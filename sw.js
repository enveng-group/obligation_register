/*
 * Obligation Register
 * Copyright (C) 2024 Enveng Group
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const CACHE_NAME = 'v1';
const OFFLINE_URL = '404.html';

const addresourcestocache = async (resources) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
};

const putincache = async (request, response) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
};

const cacheFirst = async ({request, preloadResponsePromise, fallbackUrl}) => {
    // First try to get the resource from the cache
    const responseFromCache = await caches.match(request);
    
    if (responseFromCache)
        return responseFromCache;
    
    // Next try to use the preloaded response, if it's there
    const preloadResponse = await preloadResponsePromise;
    
    if (preloadResponse) {
        console.info('using preload response', preloadResponse);
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }
    
    // Next try to get the resource from the network
    try {
        const responseFromNetwork = await fetch(request.clone());
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch {
        const fallbackResponse = await caches.match(fallbackUrl);
        
        if (fallbackResponse)
            return fallbackResponse;
        
        return new Response('Network error happened', {
            status: 408,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
};

const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload)
        await self.registration.navigationPreload.enable();
};

self.addEventListener('activate', (event) => {
    event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
    event.waitUntil(addResourcesToCache([
        '/',
        '404.html',
        'public/assets/css/style.css',
        'public/assets/js/app.js',
        'public/assets/js/pages/users.js',
        'favicon.ico',
        'icon.png',
        'icon.svg',
        'site.webmanifest',
    ]));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst({
        request: event.request,
        preloadResponsePromise: event.preloadResponse,
        fallbackUrl: OFFLINE_URL,
    }));
});
}