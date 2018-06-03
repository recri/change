/**
@license
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';

import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { changeUpdate } from '../actions/change.js';

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
		  <change-view change="${_iching.wholeBook}" iching="${iching}></change-view>
		</section>`;
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
    }

}

window.customElements.define('change-book', ChangeBook);
