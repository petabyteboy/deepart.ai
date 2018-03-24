'use strict';

import { apiUri } from './config';

class Api {
	constructor() {
		this.token = localStorage.getItem('token');
	}

	async login(username, password) {
		let res = await fetch(apiUri + '../generate-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		}).then(res => res.json());

		if (res.token) {
			this.token = res.token;
			localStorage.setItem('token', this.token);
			return true;
		} else {
			return false;
		}
	}

	get(path, params) {
		if (params && params.length) {
			if (!path.endsWith('?')) path += '?';
			path += + Object.keys(params).map(key => key + '=' + params[key]).join('&');
		}

		return fetch(apiUri + path, {
			method: 'GET',
			headers: {
				Authorization: 'Token ' + this.token
			}
		}).then(res => res.json());
	}

	post(path, params) {
		return fetch(apiUri + path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: 'Token ' + this.token
			},
			body: JSON.stringify(params)
		}).then(res => res.json());
	}

	put(path, params) {
		return fetch(apiUri + path, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				Authorization: 'Token ' + this.token
			},
			body: JSON.stringify(params)
		}).then(res => res.json());
	}
}

export let api = new Api();
