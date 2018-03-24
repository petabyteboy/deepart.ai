'use strict';

import { html } from 'lit-html';

export const about = (error) => html`
	<div class="container about">
		<section>
			<a href="/account">
				<h3>Sign up</h3>
				<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum. </p>
			</a>
			<a href="/gallery">
				<h3>Gallery</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
			</a>
			<a href="/feed">
				<h3>Feed</h3>
				<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. </p>
			</a>
		</section>
	</div>
`;
