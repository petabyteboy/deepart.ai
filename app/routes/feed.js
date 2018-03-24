'use strict';

import { render } from 'lit-html';
import { api } from '../api';
import { tag } from '../util';
import { feed as feedTemplate } from '../templates';

export const feed = async () => {
	let images = await api.get('images/');
	render(feedTemplate(notes), tag('main'));
	return true;
};


