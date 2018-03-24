'use strict';

import { html } from 'lit-html';

export const feed = (images) => html`
	${images.map(image => html`
		<img id="image-${image.id}" src="${image.url}">
	`)}
`;
