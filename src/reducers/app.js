/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { UPDATE_PAGE, UPDATE_OFFLINE,
         OPEN_SNACKBAR, CLOSE_SNACKBAR, UPDATE_DRAWER_STATE,
	 CHANGE_CAST, CHANGE_RECAST, CHANGE_RESTART, CHANGE_SAVE, CHANGE_RESTORE,
	 CHANGE_SETTINGS, CHANGE_ABOUT
       } from '../actions/app.js';

const change_extend = (change) => {
    if (change.length() === 0) {
	// create initial change
    } else {
	// extend current change
    }
}

const app = (state = {drawerOpened: false}, action) => {
    switch (action.type) {
    case CHANGE_CAST:
	return {
	    ...state,
	    change: change_extend(state.change)
	};
    case CHANGE_RECAST:
	switch (state.change.length()) {
	case 0:
	    return {
		...state,
		change: change_extend(state.change)
	    };
	case 4:
	    return {
		...state,
		change: change_extend('')
	    };
	default:
	    return {
		...state,
		change: change_extend(state.change.slice(0, -2))
	    };
	}
    case CHANGE_RESTART:
	return {
	    ...state,
	    change: change_extend('')
	};
    case CHANGE_SAVE:
	return {
	    ...state,
	    saved: true
	};
    case CHANGE_RESTORE:
	return {
	    ...state,
	    saved: true
	};
	
    case UPDATE_PAGE:
	return {
            ...state,
            page: action.page
	};
    case UPDATE_OFFLINE:
	return {
            ...state,
            offline: action.offline
	};
    case UPDATE_DRAWER_STATE:
	return {
            ...state,
            drawerOpened: action.opened
	}
    case OPEN_SNACKBAR:
	return {
            ...state,
            snackbarOpened: true
	};
    case CLOSE_SNACKBAR:
	return {
            ...state,
            snackbarOpened: false
	};
    default:
	return state;
    }
}

export default app;
