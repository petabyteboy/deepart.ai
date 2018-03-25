'use strict';

import { html } from 'lit-html';

export const gallery = (images) => html`
	<div class="container gallery">
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
	<div class="nav">
		<div class="container">
			<span>Select the images you like most</span>
			<a id="next">next &rarr;</a>
		</div>
	</div>
`;
