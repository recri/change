/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { UPDATE_PAGE, UPDATE_WIDE_LAYOUT, UPDATE_DRAWER_STATE,
	 CHANGE_CAST, CHANGE_REDO, CHANGE_UNDO, CHANGE_CLEAR, CHANGE_UPDATE, 
	 CHANGE_DIST, CHANGE_FORMAT, CHANGE_DOWN
       } from '../actions/app.js';

import { Random } from '../code/random.js';
import { Changes } from '../code/changes.js';
import { Change } from '../code/change.js';

const random = new Random();
const iching = new Change(random, Changes);

const app = (state = { drawerOpened: false, change: '', iching: iching, dist: 'yarrow', format: 'single'}, action) => {
    switch (action.type) {
    case CHANGE_CAST: {
	const timestamp = Date.now()
	random.srandom(timestamp+(timestamp+state.timestamp));
	switch (state.format) {
	case 'single':
	    return {
		...state,
		change: iching.cast(iching.clear(state.change))
	    };
	case 'multiple':
	    return {
		...state,
		change: iching.cast(state.change)
	    };
	case 'linked':
	    return {
		...state,
		change: iching.link(state.change)
	    };
	}
    }

    case CHANGE_REDO: {
	const timestamp = Date.now()
	random.srandom(timestamp+(timestamp+state.timestamp))
	switch (state.format) {
	case 'single':
	    return {
		...state,
		change: iching.cast(iching.clear(state.change))
	    };
	case 'multiple':
	    return {
		...state,
		change: iching.cast(iching.undo(state.change))
	    };
	case 'linked':
	    return {
		...state,
		change: iching.link(iching.undo(state.change))
	    };
	}
    }

    case CHANGE_DOWN:
	return {
	    ...state,
	    timestamp: Date.now()
	};

    case CHANGE_UNDO:
	if (window.location.pathname.length > 1) window.location.pathname = ''
	return {
	    ...state,
	    change: iching.undo(state.change)
	};
    case CHANGE_CLEAR:
	if (window.location.pathname.length > 1) window.location.pathname = ''
	return {
	    ...state,
	    change: iching.clear(state.change)
	};
    case CHANGE_UPDATE:
	return {
	    ...state,
	    change: iching.update(action.change)
	};

    case CHANGE_DIST:
	return {
	    ...state,
	    dist: iching.setDist(action.dist)
	};
    case CHANGE_FORMAT:
	return {
	    ...state,
	    format: iching.setFormat(action.format)
	};
	
    case UPDATE_PAGE:
	return {
            ...state,
            page: action.page
	};
    case UPDATE_WIDE_LAYOUT:
	return {
            ...state,
            wideLayout: action.wideLayout
	};
    case UPDATE_DRAWER_STATE:
	return {
            ...state,
            drawerOpened: action.opened
	}
    default:
	return state;
    }
}

export default app;
