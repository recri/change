/**
@license
*/

export const CHANGE_UPDATE = 'CHANGE_UPDATE';

export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_DIST = 'CHANGE_DIST';
export const CHANGE_CUSTOM = 'CHANGE_CUSTOM';
export const CHANGE_FORMAT = 'CHANGE_FORMAT';
export const CHANGE_PROTOCOL = 'CHANGE_PROTCOL';
export const CHANGE_BOOK = 'CHANGE_BOOK';

export const changeUpdate = (change) => (dispatch) => dispatch({ type: CHANGE_UPDATE, change });

const persist = (name, value) => {
    // console.log(`persist(${name},${value}) called`);
    if (window && window.localStorage) {
	window.localStorage.setItem(name, value);
	// console.log(`persist(${name}, ${value})`)
    }
    return value;
}

const restore = (name, defval) => {
    // console.log(`restore(${name},${defval}) called`);
    if (window && window.localStorage) {
	let s = window.localStorage
	for (let i = 0; i < s.length; i += 1) {
	    let sname = s.key(i);
	    if (name === sname) {
		// console.log(`restore ${sname} to ${s.getItem(sname)}`);
		return s.getItem(sname);
	    }
	}
	console.log(`restore defaults ${name} to ${defval}`);
	return persist(name, defval);
    } else {
	return defval;
    }
}

export const changeDist = (dist) => {
    persist('dist', dist);
    return { type: CHANGE_DIST, dist };
}
export const changeCustom = (custom) => {
    persist('custom', custom);
    return { type: CHANGE_CUSTOM, custom };
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

export const changeBook = (book) => (dispatch) => 
    dispatch(fetchBookIfNeeded(book));

export const didChangeBook = (book) => {
    persist('book', book);
    return { type: CHANGE_BOOK, book };
}

// restore the state that might have been persisted
export const changeRestore = () => (dispatch) => {
    // 'drunken', 'yarrow', 'coins', 'uniform', 'custom'
    dispatch(changeDist(restore('dist', 'yarrow')));
    // /^[1-9]{4}$/
    dispatch(changeCustom(restore('custom', '3113')));
    // 'single', 'multiple', 'linked', 'threaded'
    dispatch(changeFormat(restore('format', 'single'))),
    // 'one-per-cast', 'one-per-line', 'three-per-line'
    dispatch(changeProtocol(restore('protocol', 'one-per-cast')));
    // wilhelm, wilhelm-google, wilhelm-baynes
    dispatch(changeBook(restore('book', 'wilhelm-google')));
}
