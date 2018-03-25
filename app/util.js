'use strict';

export const id = document.getElementById.bind(document);
export const sel = document.querySelector.bind(document);
export const selAll = document.querySelectorAll.bind(document);
export const tag = (elTag) => document.getElementsByTagName(elTag)[0];
export const tagAll = (elTag) => document.getElementsByTagName(elTag)[0];
export const cssClass = (className) => document.getElementsByClassName(className)[0];
export const cssClassAll = (className) => document.getElementsByClassName(className);

export const sleep = (duration) => new Promise((resolve) => {
	setTimeout(resolve, duration);
});
