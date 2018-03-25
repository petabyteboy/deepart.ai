'use strict';

let preCache = [
	'/',
	'/main.js',
	'/manifest.json',
	'/fonts/source-code-pro-v7-latin-regular.woff2',
	'/fonts/source-code-pro-v7-latin-500.woff2',
	'/fonts/source-code-pro-v7-latin-700.woff2'
];

const CACHE = 'cache-${BUILD_DATE}';

self.addEventListener('install', function (evt) {
	self.skipWaiting();
	evt.waitUntil(caches.open(CACHE).then(function (cache) {
		cache.addAll(preCache);
	}));
});

self.addEventListener('fetch', function (evt) {
	evt.respondWith(fromCache(evt.request).then(function (match) {
		if (match) {
			return match;
		} else {
			if (evt.request.method === 'GET' && !evt.request.url.includes('/api/')) {
				return fetchAndCache(evt.request);
			} else {
				return fetch(evt.request);
			}
		}
	}));
});

self.addEventListener('activate', function (event) {
	event.waitUntil(caches.keys().then(function (cacheNames) {
		return Promise.all(cacheNames.filter(c => c !== CACHE).map(c => caches.delete(c)));
	}).then(function() {
		return self.clients.claim();
	}));
});

function fetchAndCache(request) {
	return caches.open(CACHE).then(function (cache) {
		return fetch(request).then(function (response) {
			cache.put(request, response.clone());
			return response;
		});
	});
}

function fromCache (request) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request);
	});
}

