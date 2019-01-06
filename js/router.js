'use strict';

const routes = [];

export const route = (pattern, handler) => {
	routes.push({
		pattern: pattern,
		handler: handler
	});
};

export const go = (dest) => {
	window.location.hash = '#' + dest;
};

const handler = (dest) => {
	for (let route of routes) {
		const match = route.pattern.exec(dest);
		if (!match) continue;
		return route.handler(match.slice(1));
	}
};

window.addEventListener('hashchange', evt => handler(window.location.hash.slice(1)));

document.addEventListener("DOMContentLoaded", () => handler(window.location.hash.slice(1)));
