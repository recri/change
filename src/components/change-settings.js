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
	const title = {
	    'distribution': "The frequencies of the lines of the hexagram depend on the mechanism for casting.",
	    'distribution-yarrow': "The yarrow stalk cast produces the lines 6:7:8:9 in proportions of 1:5:7:3.",
	    'distribution-coins': "The coin cast produces the lines 6:7:8:9 in frequencies of 1:3:3:1.",
	    'distribution-uniform': "A uniform cast produces the lines 6:7:8:9 in frequencies of 1:1:1:1.",
	    'distribution-custom': "A custom cast produces the lines 6:7:8:9 in the frequencies specified below.",
	    'custom': "The custom cast allows arbitrary frequencies of lines.",
	    'format': "The format determines whether and how multiple casts are formatted.",
	    'format-single': "Only one cast is displayed.",
	    'format-multiple': "Multiple casts are displayed in the order thrown.",
	    'protocol': "The cast button can require different user interactions.",
	    'protocol-one-per-cast': "Cast a reading when pressed.",
	    'protocol-one-per-line': "Cast one line of a reading for each press.",
	    'protocol-three-per-line': "Cast one third of a line of a reading for each press.",
	    'protocol-manual': "Allow the lines of the cast to be entered manually."
	};
	const input_radio = (id, name, chk, onclick, label, dis) =>
	      html`
		<label title="${title[name+'-'+id]}">
		  <input type="radio" disabled?=${dis} id="${id}" name="${name}" value="${id}" checked?=${chk} on-click="${onclick}"></input>
		  ${label}</label>
		`;
	const distribution = (id, label, disabled) =>
	      disabled ? html`` :
	      html`${input_radio(id, 'distribution', _dist===id, _ => this._distClick.bind(this)(id), label, disabled)}`
	const format = (id, label, disabled) =>
	      disabled ? html`` :
	      html`${input_radio(id, 'format', _format===id, _ => this._formatClick.bind(this)(id), label, disabled)}`;
	const protocol = (id, label, disabled) =>
	      disabled ? html`` :
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
      ${ButtonSharedStyles}
      <style>
	div.action { text-align: center; }
      </style>
      <section>
        <h2>Settings</h2>
	<form on-submit="${(e) => e.preventDefault()}">
	<p title="${title.format}">Reading format:</p>
	  <div>
	    ${format('single', 'Single casts', false)}
	    ${format('multiple', 'Multiple casts', false)}
	  </div>
	<p title="${title.protocol}">Casting protocol:</p>
	<div>
	  ${protocol('one-per-cast', 'One click/cast', false)}
	  ${protocol('one-per-line', 'One click/line', true)}
	  ${protocol('three-per-cast', 'Three clicks/line', true)}
	  ${protocol('manual', 'Manual entry', true)}
	</div>
	<p title="${title.distribution}">Line distribution:</p>
	  <div>
	    ${distribution('yarrow', 'Yarrow')}
	    ${distribution('coins', 'Coins')}
	    ${distribution('uniform', 'Uniform')}
	    ${distribution('custom', 'Custom')}
	  </div>
	<p title="${title.custom}">Custom distribution:</p>
	<div>
	  6:7:8:9 :: 
	  ${custom_select(0, _custom.charAt(0), 'old-yin')}:
	  ${custom_select(1, _custom.charAt(1), 'young-yang')}:
	  ${custom_select(2, _custom.charAt(2), 'young-yin')}:
	  ${custom_select(3, _custom.charAt(3), 'old-yang')}
	</div>
	<div class="action">
	  <button title="Reset the settings to the default values." on-click="${_ => this._resetClick.bind(this)()}">Reset</button>
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
