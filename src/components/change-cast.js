/**
@license
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
import { changeUpdate } from '../actions/change.js';

import { ChangeView } from './change-view.js';
import { GestureButton } from './gesture-button.js';

import { kua } from '../code/kua.js';

export class ChangeCast extends connect(store)(PageViewElement) {
    static get properties() {
	return {
	    _iching: Object,
	    _change: String,	// /^(([6789]{6})(,[6789]{6}))?*$/
	    _dist: String,	// /^(yarrow|coins|uniform|custom)$/
	    _custom: String,	// /^[1-9]{4}$/
	    _format: String,	// /^(single|multiple)$/
	    _protocol: String,	// /^(one-per-cast|one-per-line|three-per-line)$/
	    _book: String	// 
	}
    }

    _render({_iching, _change, _dist, _custom, _format, _protocol, _book}) {
	// cast button becomes conditional on protocol
	const cast_down = this._castDown.bind(this);
	const cast_tap = this._castTap.bind(this);
	const cast_button = () => html`<gesture-button active on-down="${cast_down}" on-tap="${cast_tap}">Cast</gesture-button>`;
	const clear_button = () => _change === '' || _format === 'single' || _change.length < 13 ? 
	      html`` : 
	      html`<gesture-button active "button" on-tap="${_ => store.dispatch(changeUpdate(''))}">Clear</gesture-button>`;
	const undo_change = _iching.undo(_change)
	const undo_button = () => _change === '' || undo_change === '' || _format === 'single' ? 
	      html`` : 
	      html`<gesture-button active "button" on-tap="${_ => store.dispatch(changeUpdate(undo_change))}">Undo</gesture-button>`;

	if (_iching.getCustom() !== _custom) _iching.setCustom(_custom);
	if (_iching.getDist() !== _dist) _iching.setDist(_dist);
	if (_iching.getFormat() !== _format) _iching.setFormat(_format);

	return html`
		${SharedStyles}
		<style>
		  div { border-style: solid; border-width: 2px; border-radius: 5px; margin: 5px; padding: 5px }
		  div.action { text-align: right; }
		</style>
		<section>
		  <div class="action">
		    ${clear_button()}
		    ${undo_button()}
		    ${cast_button()}
		  </div>
		  <change-view _change="${_change}" _iching="${_iching}" _book="${_book}"></change-view>
		</section>`;
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
	this._change = state.change.change;
	this._dist = state.change.dist;
	this._custom = state.change.custom
	this._format = state.change.format;
	this._protocol = state.change.protocol;
	this._book = state.change.book;
    }

    _castDown() {
	this._downtime = Date.now();
    }

    _castTap() {
	const taptime = Date.now();
	this._iching.srandom(taptime+(taptime-this._downtime));
	switch (this._format) {
	case 'single': store.dispatch(changeUpdate(this._iching.cast(''))); break;
	case 'multiple': store.dispatch(changeUpdate(this._iching.cast(this._change))); break;
	}
    }
}

window.customElements.define('change-cast', ChangeCast);
