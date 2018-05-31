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
import { ButtonSharedStyles } from './button-shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { changeDist, changeCustom, changeFormat, changeProtocol } from '../actions/app.js';

class ChangeTests extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    _iching: Object,
	    _random: Object,
	    _yarrowHist: Array,
	    _coinsHist: Array,
	    _uniformHist: Array,
	    _customHist: Array
	}
    }

    _render({_iching, _random, _yarrowHist, _coinsHist, _uniformHist, _customHist}) {
	return html`
      ${SharedStyles}
      ${ButtonSharedStyles}
      <style>
	div.action { text-align: center; }
      </style>
      <section>
        <h2>Tests</h2>
	<p>Yarrow Distribution</p>
	<div></div>
	<p>Coins Distribution</p>
	<div></div>
	<p>Uniform Distribution</p>
	<div></div>
	<p>Custom Distribution</p>
	<div></div>
      </section>
    `
    }

    _stateChanged(state) {
	this._dist = state.app.dist;
	this._custom = state.app.custom;
	this._format = state.app.format;
	this._protocol = state.app.protocol;
    }
    
    _resetClick() {
	// console.log("change-settings _resetClick");
	store.dispatch(changeDist('yarrow'));
	store.dispatch(changeCustom('3113'));
	store.dispatch(changeFormat('single'));
	store.dispatch(changeProtocol('one-per-cast'));
    }
    
    _distClick(tag) { 
	// console.log(`change-settings _distClick(${tag})`); 
	store.dispatch(changeDist(tag));
    }
    _customClick(e, i, tag) {
	// this._custom[i] = e.target.value
	var dist = this._custom.split('').map((c,ci) => ci===i ? e.target.value : c).join('');
	store.dispatch(changeCustom(dist));
    }
    _formatClick(tag) {
	// console.log(`change-settings _formatClick(${tag})`);
	store.dispatch(changeFormat(tag));
    }
    _protocolClick(tag) {
	// console.log(`_protocolClick(${tag})`);
	store.dispatch(changeProtocol(tag));
    }
}

window.customElements.define('change-settings', ChangeSettings);
