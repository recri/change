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
import { changeDist, changeCustom, changeFormat, changeProtocol } from '../actions/app.js';

class ChangeSettings extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    _dist: String,
	    _format: String,
	    _custom: String,
	    _protocol: String
	}
    }

    _render({_dist, _format, _custom, _protocol}) {
	const input_radio = (id, name, chk, onclick, label, dis) =>
	      html`
		<label>
		  <input type="radio" disabled?=${dis} id="${id}" name="${name}" value="${id}" checked?=${chk} on-click="${onclick}"></input>
		  ${label}</label>
		`;
	const distribution = (id, label, disabled) =>
	      html`${input_radio(id, 'distribution', _dist===id, _ => this._distClick.bind(this)(id), label, disabled)}`
	const format = (id, label, disabled) =>
	      html`${input_radio(id, 'format', _format===id, _ => this._formatClick.bind(this)(id), label, disabled)}`;
	const protocol = (id, label, disabled) =>
	      html`${input_radio(id, 'protocol', _protocol===id, _ => this._protocolClick.bind(this)(id), label, disabled)}`;

	const custom_select = (i,d,name) => {
	    const option = (v) => html`<option value="${v}" selected?=${v == d}>${v}</option>`
	    return html`
		<select name="${name}" on-change=${e => this._customClick.bind(this)(e,i,name)}>
		  ${[1,2,3,4,5,6,7,8,9].map(v => option(v))}
		</select>
		`;
	}

	return html`
      ${SharedStyles}
      <style>
	div.action { text-align: center; }
      </style>
      <section>
        <h2>Settings</h2>
	<form on-submit="${(e) => e.preventDefault()}">
	<p>Line distribution:</p>
	  <div>
	    ${distribution('yarrow', 'Yarrow stalks (1375)')}
	    ${distribution('coins', 'Coins (1331)')}
	    ${distribution('uniform', 'Uniform (1111)')}
	    ${distribution('custom', 'Custom')}
	  </div>
	<p>Custom distribution:</p>
	<div>
	  6:7:8:9 :: 
	  ${custom_select(0, _custom.charAt(0), 'old-yin')}:
	  ${custom_select(1, _custom.charAt(1), 'young-yang')}:
	  ${custom_select(2, _custom.charAt(2), 'young-yin')}:
	  ${custom_select(3, _custom.charAt(3), 'old-yang')}
	</div>
	<p>Reading format:</p>
	  <div>
	    ${format('single', 'Single casts', false)}
	    ${format('multiple', 'Multiple casts', true)}
	    ${format('linked', 'Linked casts', false)}
	    ${format('threaded', 'Threaded casts', true)}
	  </div>
	<p>Casting protocol:</p>
	<div>
	  ${protocol('one-per-cast', 'One click/cast', false)}
	  ${protocol('one-per-line', 'One click/line', true)}
	  ${protocol('three-per-cast', 'Three clicks/line', true)}
	</div>
	<div class="action">
	  <button on-click="${_ => this._resetClick.bind(this)()}">Reset to default</button>
	</div>
	</form>
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
