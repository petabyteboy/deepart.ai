'use strict';

import { route, go } from './router.js';
import { tag } from './util.js';
import { html, render } from './lit-html.js';

import { aboutRoute } from './routes/about.js';
import { feedRoute } from './routes/feed.js';
import { galleryRoute } from './routes/gallery.js';
import { notfoundRoute } from './routes/notfound.js';

export const headerTemplate = () => html`
	<a href="#/" class="container">
		<svg
			 viewBox="0 0 12.7 12.7"
			 height="48"
			 width="48">
			<g
				 transform="translate(0,-284.3)"
				 id="layer1">
				<ellipse
					 ry="2.6679778"
					 rx="2.629283"
					 cy="290.64999"
					 cx="6.3499999"
					 id="path18"
					 style="fill:#ffffff;fill-opacity:1;stroke:#ffffff;stroke-width:0.42345163;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
				<ellipse
					 ry="6.0293493"
					 rx="6.0293498"
					 transform="scale(1,-1)"
					 cy="-290.64999"
					 cx="6.3500004"
					 id="path828"
					 style="fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.64130098;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
			</g>
		</svg>
		<h1>deepart.ai</h1>
	</a>
`;
render(headerTemplate(), tag('header'));

route(/^\/$/, aboutRoute);
route(/^\/feed$/, feedRoute);
route(/^\/gallery$/, galleryRoute);
route(/^.*$/, notfoundRoute);

if (!window.location.hash.length) go('/');

const sw = navigator.serviceWorker;
if (sw) {
	sw.register('/sw.js', {
		scope: '/'
	});
}

