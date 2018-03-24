'use strict';

import { html } from 'lit-html';

export const notfound = () => html`
	<div class="container">
		<h1>What are you looking for?</h1>
		<h3>The page you tried to access was not found. Did you make a spelling mistake?</h3>
		<a href="/">Back to the home page</a>
	</div>
`;
