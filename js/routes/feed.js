'use strict';

import { html, render } from '../lit-html.js';
import { tag } from '../util.js';

const feedTemplate = (images) => html`
	${images.map(image => html`
		<img id="image-${image.id}" src="${image.url}">
	`)}
`;

export const feedRoute = () => {
	const notes = JSON.parse(localStorage.getItem('notes') || "[]")
	render(feedTemplate(notes), tag('main'));
};


