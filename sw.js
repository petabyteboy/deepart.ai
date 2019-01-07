'use strict';

const CACHE = 'cache-v50';

let preCache = [
	'./',
	'./js/',
	'./js/lit-html.js',
	'./js/main.js',
	'./js/ai.js',
	'./js/router.js',
	'./js/sw.js',
	'./js/util.js',
	'./js/routes',
	'./js/routes/about.js',
	'./js/routes/notfound.js',
	'./js/routes/gallery.js',
	'./js/routes/feed.js',
	'./deepart.ai128.png',
	'./deepart.ai256.png',
	'./deepart.ai512.png',
	'./deepart.ai64.png',
	'./deepart.ai.png',
	'./deepart.ai.svg',
	'./fonts/source-code-pro-v7-latin-500.woff',
	'./fonts/source-code-pro-v7-latin-500.woff2',
	'./fonts/source-code-pro-v7-latin-700.woff',
	'./fonts/source-code-pro-v7-latin-700.woff2',
	'./fonts/source-code-pro-v7-latin-regular.woff',
	'./fonts/source-code-pro-v7-latin-regular.woff2',
	'./manifest.json',
	'./main.css'
];

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
			return fetch(evt.request);
		}
	}));
});

self.addEventListener('activate', function (event) {
	event.waitUntil(clients.claim());
	event.waitUntil(clients.claim().then(function () {
		return caches.keys().then(function (cacheNames) {
			return Promise.all(cacheNames.filter(c => c !== CACHE).map(c => caches.delete(c)));
		});
	}));
});

function fromCache (request) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request);
	});
}
