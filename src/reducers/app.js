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
	 INSTALL_PROMPT,
	 CHANGE_UPDATE, 
	 CHANGE_DIST, CHANGE_CUSTOM, CHANGE_FORMAT, CHANGE_PROTOCOL
       } from '../actions/app.js';

const app = (state = { drawerOpened: false, change: '',
		       dist: 'yarrow', // 'yarrow', 'coins', 'uniform', 'custom'
		       custom: '3113', // /^[1-9]{4}$/
		       format: 'single', // 'single', 'multiple', 'linked', 'threaded'
		       protocol: 'one-per-cast', // 'one-per-cast', 'one-per-line', 'three-per-line'
		       install: null		 // install to home screen event
		     }, action) => {

    switch (action.type) {
    case CHANGE_UPDATE: return { ...state, change: action.change };
    case CHANGE_DIST: return { ...state, dist: action.dist };
    case CHANGE_CUSTOM: return { ...state, custom: action.custom };
    case CHANGE_FORMAT: return { ...state, format: action.format };
    case CHANGE_PROTOCOL: return { ...state, protocol: action.protocol };
    case INSTALL_PROMPT: return { ...state, install: action.install };
    case UPDATE_PAGE: return { ...state, page: action.page };
    case UPDATE_WIDE_LAYOUT: return { ...state, wideLayout: action.wideLayout };
    case UPDATE_DRAWER_STATE: return { ...state, drawerOpened: action.opened }
    default: return state;
    }
}

export default app;
