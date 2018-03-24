'use strict';

export const id = document.getElementById.bind(document);
export const sel = document.querySelector.bind(document);
export const selAll = document.querySelectorAll.bind(document);
export const tag = (elTag) => document.getElementsByTagName(elTag)[0];
export const tagAll = (elTag) => document.getElementsByTagName(elTag)[0];
