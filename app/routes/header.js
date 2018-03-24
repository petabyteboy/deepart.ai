'use strict';

import { render } from 'lit-html';
import { tag } from '../util';
import { header as headerTemplate } from '../templates';

export const header = async () => {
	render(headerTemplate(), tag('header'));
	return false;
};


