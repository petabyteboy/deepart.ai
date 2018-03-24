'use strict';

import { render } from 'lit-html';
import { tag } from '../util';
import { about as aboutTemplate } from '../templates';

export const about = async () => {
	render(aboutTemplate(), tag('main'));
	return true;
};


