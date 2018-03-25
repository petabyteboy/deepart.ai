'use strict';

class Router {
	constructor() {
		this.routes = [];

		window.onpopstate = (evt) => {
			this.go(window.location.pathname);
		};

		document.onclick = (evt) => {
			for (let el of evt['composedPath']()) {
				if (el.href && el.href.startsWith(window.location.origin) && this.go(el.pathname)) {
					evt.preventDefault();
					return false;
				}
			}
			return true;
		};
	}

	go(path) {
		let routes = this.routes.map(r => { return { route: r, match: r.path.exec(path) } }).filter(r => r.match);

		if (!routes.length) return false;

		history.pushState({}, '', path);

		let self = this;
		// returns a promise, which is truthy
		return (async () => {
			for (let { route, match } of routes) {
				let res = await route.func(match);
				if (res) break;
			}
		}) ();
	}

	route(path, func) {
		this.routes.push({
			path: path,
			func: func
		});
	}
}

export const router = new Router();
