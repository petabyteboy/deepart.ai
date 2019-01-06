'use strict';

import { html, render } from '../lit-html.js';
import { tag } from '../util.js';

const notfoundTemplate = () => html`
	<div class="container">
		<h1>What are you looking for?</h1>
		<h3>The page you tried to access was not found. Did you make a spelling mistake?</h3>
		<a href="/">Back to the home page</a>
	</div>
`;

export const notfoundRoute = () => {
	render(notfoundTemplate(), tag('main'));
};

