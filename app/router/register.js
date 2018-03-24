'use strict';

import { router } from '../router';
import * as routes from '../routes';

router.route(/^.*$/, routes.header);
router.route(/^\/?$/, routes.about);
router.route(/^\/feed$/, routes.feed);
router.route(/^\/gallery$/, routes.gallery);
router.route(/^.*$/, routes.notfound);
