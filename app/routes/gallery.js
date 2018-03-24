'use strict';

import { render } from 'lit-html';
import { api } from '../api';
import { tag } from '../util';
import { gallery as galleryTemplate } from '../templates';

export const gallery = async () => {
	let images = await api.get('images/');
	render(galleryTemplate(notes), tag('main'));
	return true;
};


