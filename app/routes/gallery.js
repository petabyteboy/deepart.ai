'use strict';

import { render } from 'lit-html';
import { tag, cssClass, selAll, id, sleep } from '../util';
import { gallery as galleryTemplate } from '../templates';

export const gallery = async () => {
	const apiUri = 'http://127.0.0.1:5000/api/';

	const get = (path) => fetch(apiUri + path, {cache: "no-store"});

	let nnId = '';
	let images = [];
	let data = {};
	let j = 0;


	const nextSet = async (selected) => {
		render(galleryTemplate(images, true), tag('main'));
		images = [];

		let newId;
		if (selected !== undefined) {
			await get('answer/' + nnId + '/' + selected);
			do {
				newId = await get('get_latest_id').then(resp => resp.text());
				await sleep(200);
			} while (newId === nnId);
			nnId = newId;
		} else {
			nnId = await get('get_latest_id').then(resp => resp.text());
		}
		data = await get('get_latest_data').then(resp => resp.json());

		j = 0;
		let size = 128;
		let canvas = document.createElement('canvas');
		canvas.height = size;
		canvas.width = size;
		let ctx = canvas.getContext('2d');
		Object.keys(data).forEach((index) => {
			let artwork = data[index];
			ctx.clearRect(0, 0, size, size);
			artwork['objects'].forEach((obj) => {
				let first = obj['points'].shift();
				let x = first['x'] * size;
				let y = first['y'] * size;
				let r = Math.round(first['r']*255);
				let g = Math.round(first['g']*255);
				let b = Math.round(first['b']*255);
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
				ctx.moveTo(x, y);
				ctx.beginPath();
				if (obj['radius']) {
					let radius = obj['radius'] * size;
					if (radius < 0) {
						console.warn('oops, radius was < 0: ' + radius);
					} else {
						ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
					}
				} else {
					let second = obj['points'][0];
					let x2 = second['x'] * size;
					let y2 = second['y'] * size;
					let r2 = Math.round(second['r']*255);
					let g2 = Math.round(second['g']*255);
					let b2 = Math.round(second['b']*255);
					let grd = ctx.createLinearGradient(x, y, x2, y2);
					grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
					grd.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, 1)`);
					ctx.fillStyle = grd;
					console.log(obj['points'].length);
					obj['points'].forEach((point) => {
						ctx.lineTo(point['x'] * size, point['y'] * size);
					});
				}
				ctx.closePath();
				ctx.fill();
			});
			images.push({
				id: index,
				url: canvas.toDataURL("image/png")
			});
		});

		render(galleryTemplate(images), tag('main'));
	}

	await nextSet();

	let i = 0;

	cssClass('grid').onclick = (evt) => {
		if (evt.target.tagName !== 'IMG') return;
		let id = evt.target.getAttribute('data-id');
		/*images[id].selected = ++i;
		render(galleryTemplate(images), tag('main'));
		i = 0;
		let selectedId = images.filter(i => i.selected === 1)[0].id;*/
		nextSet(id);
	};

	id('next').onclick = () => {
		i = 0;
		let selectedId = images.filter(i => i.selected === 1)[0].id;
		nextSet(selectedId);
	};

	return true;
};

