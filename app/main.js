'use strict';

import { router } from './router';

router.go(window.location.pathname);

/*const sw = navigator.serviceWorker;
if (sw) {
	sw.register('/sw.js', {
		scope: '/'
	});
}*/
