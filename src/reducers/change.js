/**
@license

*/

import {
    CHANGE_UPDATE,
    CHANGE_DIST, CHANGE_FORMAT, CHANGE_PROTOCOL, CHANGE_BOOK
} from '../actions/change.js';

import { store } from '../store.js';

import { ChangesText } from '../text/wilhelm-baynes.js';
import { Change } from '../components/change.js';

const change = (state = { 
    iching: new Change(ChangesText),
    change: '',
}, action) => {
    switch (action.type) {
    case CHANGE_UPDATE: return { ...state, change: action.change };
    case CHANGE_DIST: return { ...state, dist: action.dist };
    case CHANGE_FORMAT: return { ...state, format: action.format };
    case CHANGE_PROTOCOL: return { ...state, protocol: action.protocol };
    case CHANGE_BOOK: return { ...state, book: action.book };
    default: return state;
    }
}

export default change;
