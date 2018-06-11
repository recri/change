/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

export const CHANGE_UPDATE = 'CHANGE_UPDATE';

export const CHANGE_DIST = 'CHANGE_DIST';
export const CHANGE_FORMAT = 'CHANGE_FORMAT';
export const CHANGE_PROTOCOL = 'CHANGE_PROTCOL';
export const CHANGE_BOOK = 'CHANGE_BOOK';

export const changeUpdate = (change) => (dispatch) => dispatch({ type: CHANGE_UPDATE, change });

const persist = (name, value) => {
    if (window && window.localStorage)
	window.localStorage.setItem(name, value);
    return value;
}

const restore = (name, defval) => {
    if ( ! window || ! window.localStorage)
	return defval;
    const s = window.localStorage
    for (let i = 0; i < s.length; i += 1)
	if (name === s.key(i))
	    return s.getItem(name);
    return persist(name, defval);
}

export const changeDist = (dist) => {
    persist('dist', dist);
    return { type: CHANGE_DIST, dist };
}
export const changeFormat = (format) => {
    persist('format', format);
    return { type: CHANGE_FORMAT, format };
}
export const changeProtocol = (protocol) => {
    persist('protocol', protocol);
    return { type: CHANGE_PROTOCOL, protocol };
}

import { fetchBookIfNeeded } from '../actions/books.js';

export const changeBook = (book) => (dispatch) =>  {
    dispatch(fetchBookIfNeeded(book));
}

export const didChangeBook = (book) => {
    persist('book', book);
    return { type: CHANGE_BOOK, book };
}

//
// restore the state that may have been persisted
// oh, default values are set here, the value of the
// first restore from saved settings when there are no
// saved settings.
//
export const changeRestore = () => (dispatch) => {
    // 'full', 'yarrow', 'invert', 'coins', 'uniform', '6-scored-as-2', '6-scored-as-3', /[1-9]{4}/
    dispatch(changeDist(restore('dist', 'full')));
    // 'single', 'multiple', 'linked', 'threaded'
    dispatch(changeFormat(restore('format', 'single'))),
    // 'one-per-cast', 'six-per-cast', 'eighteen-per-cast'
    dispatch(changeProtocol(restore('protocol', 'one-per-cast')));
    // wilhelm, wilhelm-google, wilhelm-baynes, yizhou, legge
    dispatch(changeBook(restore('book', 'wilhelm-baynes')));
}
