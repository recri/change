/**
@license
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
	    _iching: Object
	}
    }

    _render({_iching}) {

	return html`
		${SharedStyles}
		<section>
		  <change-view _change="${_iching.wholeBook()}" _iching="${_iching}"></change-view>
		</section>`;
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
    }

}

window.customElements.define('change-book', ChangeBook);
