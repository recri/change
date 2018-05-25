/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
There are too many of these, I think, or maybe not.
Does each change of page view require an action?
I cannot see where these are getting generated in the code.
*/
import { UPDATE_PAGE, UPDATE_OFFLINE, UPDATE_WIDE_LAYOUT,
         OPEN_SNACKBAR, CLOSE_SNACKBAR, UPDATE_DRAWER_STATE,
	 CHANGE_CAST, CHANGE_LINK, CHANGE_UNDO, CHANGE_CLEAR, CHANGE_UPDATE, 
	 CHANGE_SAVE, CHANGE_RESTORE, CHANGE_SETTINGS, CHANGE_ABOUT,
	 CHANGE_DIST
       } from '../actions/app.js';

// import { Changes } from '../code/changes.js';
import { Change } from '../code/change.js';
import { Random } from '../code/random.js';

const random = new Random();
const iching = new Change(random);

import('../code/changes.js').then((mod) => {
    console.log("import changes got mod");
    iching.setText(mod.Changes);
    console.log("import changes called iching.setText(mod.Changes)")
    // console.log(`import changes.js completed with ${mod}`);
    // console.log(mod);
});

const app = (state = {drawerOpened: false, change: '', iching: iching, dist: 'yarrow'}, action) => {
    switch (action.type) {
    case CHANGE_CAST:
	random.srandom(Date.now());
	return {
	    ...state,
	    change: iching.cast(state.change)
	};
    case CHANGE_LINK:
	random.srandom(Date.now());
	return {
	    ...state,
	    change: iching.link(state.change)
	};
    case CHANGE_UNDO:
	return {
	    ...state,
	    change: iching.undo(state.change)
	};
    case CHANGE_CLEAR:
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
	    dist: iching.setDist(action.change)
	};
    case CHANGE_SAVE:
	return {
	    ...state,
	    saved: true
	};
    case CHANGE_RESTORE:
	return {
	    ...state,
	    restored: true
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
