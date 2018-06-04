/**
@license

*/

import {
    CHANGE_UPDATE, 
    CHANGE_DIST, CHANGE_CUSTOM, CHANGE_FORMAT, CHANGE_PROTOCOL
} from '../actions/change.js';

import { ChangesText } from '../code/text-wilhelm-google.js';
import { Change } from '../code/change.js';

const iching = new Change(ChangesText);

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
	persist(name, defval);
    }
    return defval;
}

const change = (state = { 
    iching: iching,
    change: '',
    dist: restore('dist', 'yarrow'),			// 'yarrow', 'coins', 'uniform', 'custom'
    custom: restore('custom', '3113'),			// /^[1-9]{4}$/
    format: restore('format', 'single'),		// 'single', 'multiple', 'linked', 'threaded'
    protocol: restore('protocol', 'one-per-cast')	// 'one-per-cast', 'one-per-line', 'three-per-line'
}, action) => {

    switch (action.type) {
    case CHANGE_UPDATE: return { ...state, change: action.change };
    case CHANGE_DIST: return { ...state, dist: persist('dist', action.dist) };
    case CHANGE_CUSTOM: return { ...state, custom: persist('custom', action.custom) };
    case CHANGE_FORMAT: return { ...state, format: persist('format', action.format) };
    case CHANGE_PROTOCOL: return { ...state, protocol: persist('protocol', action.protocol) };
    default: return state;
    }
}

export default change;
