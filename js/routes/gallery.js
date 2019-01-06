'use strict';

import { html, render } from '../lit-html.js';
import { tag, cssClass, selAll, id, sleep } from '../util.js';

const size = 128;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.height = size;
canvas.width = size;

const galleryTemplate = (images, loading) => html`
	<div class="container gallery">
		<div class="grid-container">
			<div class="grid">
				${images.map(image => html`
					<div class="image">
						<img data-id="${image.id}" src="${image.url}">
						${image.selected ? html`
							<div class="selected">
								<span>${image.selected}</span>
							</div>
						` : ''}
					</div>
				`)}
			</div>
		</div>
	</div>
	${loading ? html`
		<div class="loading">
			<div class="spinner"></div>
		</div>
	` : ''}
	<div class="nav">
		<div class="container">
			<span>Select the image you like most</span>
			<a id="next">next &rarr;</a>
		</div>
	</div>
`;

const renderImage = (artwork) => {
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
			obj['points'].forEach((point) => {
				ctx.lineTo(point['x'] * size, point['y'] * size);
			});
		}
		ctx.closePath();
		ctx.fill();
	});
	return canvas.toDataURL("image/png");
};

export const galleryRoute = async () => {
	const apiUri = '/api/';

	const get = (path) => fetch(apiUri + path, {cache: "no-store"});

	let nnId = '';
	let data = {};

	const nextSet = async (selected) => {
		render(galleryTemplate([], true), tag('main'));

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
		let images = Object.keys(data).map(index => {
			return {
				id: index,
				url: renderImage(data[index])
			};
		});
		render(galleryTemplate(images), tag('main'));
	};

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
		nextSet(0);
	};
};

