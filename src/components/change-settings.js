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
import { changeDist, changeCustom, changeFormat, changeProtocol, changeBook } from '../actions/change.js';

class ChangeSettings extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    _dist: String,
	    _format: String,
	    _custom: String,
	    _protocol: String,
	    _book: String,
	}
    }

    _render({_dist, _format, _custom, _protocol, _book}) {
	const title = {
	    'distribution': "The frequencies of the lines of the hexagram depend on the mechanism for casting.",
	    'distribution-yarrow': "The yarrow stalk cast produces the lines 6:7:8:9 in proportions of 1:5:7:3.",
	    'distribution-coins': "The coin cast produces the lines 6:7:8:9 in frequencies of 1:3:3:1.",
	    'distribution-uniform': "A uniform cast produces the lines 6:7:8:9 in frequencies of 1:1:1:1.",
	    'distribution-drunken': "A yarrow, inverted yarrow, coin, or uniform distribution in equal proportions.",
	    'distribution-custom': "A custom cast produces the lines 6:7:8:9 in the frequencies specified below.",
	    'custom': "The custom cast allows arbitrary frequencies of lines.",
	    'format': "The format determines whether and how multiple casts are formatted.",
	    'format-single': "Only one cast is displayed.",
	    'format-multiple': "Multiple casts are displayed in the order thrown.",
	    'protocol': "The cast button can require different user interactions.",
	    'protocol-one-per-cast': "Cast a reading when pressed.",
	    'protocol-one-per-line': "Cast one line of a reading for each press.",
	    'protocol-three-per-line': "Cast one third of a line of a reading for each press.",
	    'protocol-manual': "Allow the lines of the cast to be entered manually.",
	    'text': "Choose a translation.", 
	    'text-wilhelm': "Richard Wilhelm's translation into German from Chinese.",
	    'text-wilhelm-baynes': "Cary F. Baynes' translation into English from German.",
	    'text-wilhelm-google': "docs.google.com's translation into English from German.",
	    'text-legge': "Legge's translation into English from Chinese.",
	    'text-yizhou': "Original Chinese text."
	};
	const input_radio = (id, name, chk, onclick, label, dis) =>
	      html`
		<label title="${title[name+'-'+id]}">
		  <input type="radio" disabled?=${dis} id="${id}" name="${name}" value="${id}" checked?=${chk} on-click="${onclick}"></input>
		  ${label}</label>
		`;
	const distribution = (id, label, disabled) =>
	      disabled ? html`` :
	      html`${input_radio(id, 'distribution', _dist===id, _ => store.dispatch(changeDist(id)), label, disabled)}`
	const format = (id, label, disabled) =>
	      disabled ? html`` :
	      html`${input_radio(id, 'format', _format===id, _ => store.dispatch(changeFormat(id)), label, disabled)}`;
	const protocol = (id, label, disabled) =>
	      disabled ? html`` :
	      html`${input_radio(id, 'protocol', _protocol===id, _ => store.dispatch(changeProtocol(id)), label, disabled)}`;
	const book = (id, label, disabled) =>
	      disabled ? html`` :
	      html`${input_radio(id, 'book', _book===id, _ => store.dispatch(changeBook(id)), label, disabled)}`;

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
	<p title="${title.book}">Translation:</p>
	  <div>
	    ${book('wilhelm-google', 'Wilhelm/Google', false)}
	    ${book('wilhelm-baynes', 'Wilhelm/Baynes', false)}
	    ${book('wilhelm', 'Wilhelm', false)}
	    ${book('legge', 'Legge', true)}
	    ${book('yizhou', 'Yizhou', true)}
	  </div>
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
	    ${distribution('drunken', 'Drunken')}
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
	// console.log(`change-settings._stateChanged(_book=${state.change.book})`);
	this._dist = state.change.dist;
	this._custom = state.change.custom;
	this._format = state.change.format;
	this._protocol = state.change.protocol;
	this._book = state.change.book;
    }
    
    _resetClick() {
	// console.log("change-settings _resetClick");
	store.dispatch(changeDist('yarrow'));
	store.dispatch(changeCustom('3113'));
	store.dispatch(changeFormat('single'));
	store.dispatch(changeProtocol('one-per-cast'));
	store.dispatch(changeBook('wilhelm-google'));
    }

    _customClick(e, i, tag) {
	// this._custom[i] = e.target.value
	var dist = this._custom.split('').map((c,ci) => ci===i ? e.target.value : c).join('');
	store.dispatch(changeCustom(dist));
    }
}

window.customElements.define('change-settings', ChangeSettings);
