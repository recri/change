/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';

import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { ChangeView } from './change-view.js';

export class ChangeBook extends connect(store)(PageViewElement) {
    static get properties() {
	return {
	    _iching: Object,
	    _book: String,
	}
    }

    _render({_iching, _book}) {
	return html`
		${SharedStyles}
		<change-view _change="${_iching.wholeBook()}" _iching="${_iching}" _book="${_book}"></change-view>`;
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
	this._book = state.change.book;
    }

}

window.customElements.define('change-book', ChangeBook);
