'use strict';

let preCache = [
	'./',
	'./main.js',
	'./manifest.json',
	'./fonts/source-code-pro-v7-latin-regular.woff2',
	'./fonts/source-code-pro-v7-latin-500.woff2',
	'./fonts/source-code-pro-v7-latin-700.woff2',
	'./deepart.ai.png',
	'./deepart.ai.svg',
	'./deepart.ai128.png',
	'./deepart.ai256.png',
	'./deepart.ai512.png',
	'./deepart.ai64.png',
	'./main.css',
	'./main.js',
	'./router.js',
	'./routes/about.js',
	'./routes/feed.js',
	'./routes/gallery.js',
	'./routes/header.js',
	'./routes/index.js',
	'./routes/notfound.js',
	'./templates/about.js',
	'./templates/feed.js',
	'./templates/gallery.js',
	'./templates/header.js',
	'./templates/index.js',
	'./templates/notfound.js',
	'./util.js',
	'./manifest.json'
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

