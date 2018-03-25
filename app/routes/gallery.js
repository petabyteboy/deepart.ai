'use strict';

import { render } from 'lit-html';
import { api } from '../api';
import { tag, cssClass, selAll, id, sleep } from '../util';
import { gallery as galleryTemplate } from '../templates';

export const gallery = async () => {
	let nnId = '';
	let images = [];
	let data = {};
	let j = 0;
	for (let i = 0; i < 25; i++) {
		images.push({
			id: j++,
			url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAq0lEQVQ4T2NkQAKr11s4/Gdg2o8sRojNSFUD1q83EPjNwPWekK3I8iguAEmsWmf5gIGRUZ5YQzAMWLneqgEoWE+2AQYM/QJ58zZd5RH8KUWMIRguABlQtX61AsP//weAXuEnZAiGATAN4AD9z7WAgZHBH6ch//9/xGkATNPK9ZYBQEUODP8ZDIAusge67CFQDhjQ/xewMvzYQNAAsr1ASCNMftQFDMBYphAAAJVKLC5aXnWRAAAAAElFTkSuQmCC'
		});
	}

	const nextSet = async (selected) => {
		images = [];

		if (selected !== undefined) await fetch('/api/answer/' + nnId + '/' + selected).then(resp => resp.json());
		do {
			newId = await fetch('/api/get_latest_id').then(resp => resp.text());
			await sleep(50);
		} while (newId === nnId);
		data = await fetch('/api/get_latest_data').then(resp => resp.json());

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
					ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
				} else {
					obj['points'].forEach((point) => {
						ctx.lineTo(point['x'] * size, point['y'] * size);
					});
				}
				ctx.closePath();
				ctx.fill();
			});
			images.push({
				id: index++,
				url: canvas.toDataURL("image/png")
			});
		});

		render(galleryTemplate(images), tag('main'));
	}

	render(galleryTemplate(images), tag('main'));

	await nextSet();

	let i = 0;

	cssClass('grid').onclick = (evt) => {
		if (evt.target.tagName !== 'IMG') return;
		let id = evt.target.getAttribute('data-id');
		images[id].selected = ++i;
		render(galleryTemplate(images), tag('main'));
	};

	id('next').onclick = () => {
		i = 0;
		let selectedId = images.filter(i => i.selected === 1)[0].id;
		nextSet(selectedId);
	};

	return true;
};

