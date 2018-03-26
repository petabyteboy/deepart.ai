'use strict';

import { html } from 'lit-html';

export const gallery = (images, loading) => html`
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
