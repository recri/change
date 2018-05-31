/**
@license

*/

import {
    CHANGE_UPDATE, 
    CHANGE_DIST, CHANGE_CUSTOM, CHANGE_FORMAT, CHANGE_PROTOCOL
} from '../actions/change.js';

import { Changes } from '../code/changes.js';
import { Change } from '../code/change.js';

const iching = new Change(Changes);

const change = (state = { 
    iching: iching,
    change: '',
    dist: 'yarrow',		// 'yarrow', 'coins', 'uniform', 'custom'
    custom: '3113',		// /^[1-9]{4}$/
    format: 'single',		// 'single', 'multiple', 'linked', 'threaded'
    protocol: 'one-per-cast'	// 'one-per-cast', 'one-per-line', 'three-per-line'
}, action) => {

    switch (action.type) {
    case CHANGE_UPDATE: return { ...state, change: action.change };
    case CHANGE_DIST:   return { ...state, dist: action.dist };
    case CHANGE_CUSTOM: return { ...state, custom: action.custom };
    case CHANGE_FORMAT: return { ...state, format: action.format };
    case CHANGE_PROTOCOL: return { ...state, protocol: action.protocol };
    default: return state;
    }
}

export default change;
