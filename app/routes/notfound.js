'use strict';

import { render } from 'lit-html';
import { tag } from '../util';
import { notfound as notfoundTemplate } from '../templates';

export const notfound = async () => {
	render(notfoundTemplate(), tag('main'));
	return true;
};


