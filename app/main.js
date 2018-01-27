'use strict';

import { html, render } from 'lit-html';

console.log('hello world!');

const pad = number => number > 9 ? number : ('0' + number);

const clockTemplate = date => html`
	<span>${pad(date.getHours())}</span>:
	<span>${pad(date.getMinutes())}</span>:
	<span>${pad(date.getSeconds())}</span>
`;

const renderClock = () => {
	console.log(new Date().getMilliseconds());
	render(clockTemplate(new Date()), document.getElementById('clock'));
	setTimeout(renderClock, 1000 - new Date().getMilliseconds());
	console.log(new Date().getMilliseconds());
};

renderClock();
