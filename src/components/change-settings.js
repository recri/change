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
import { changeDist, changeFormat, changeProtocol, changeBook } from '../actions/change.js';

class ChangeSettings extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    _dist: String,
	    _format: String,
	    _protocol: String,
	    _book: String,
	}
    }

    _render({_dist, _format, _protocol, _book}) {
	// console.log(`change-settings _render ${_dist} ${_format} ${_protocol} ${_book}`);
	const title = {
	    'distribution': "The frequencies of the lines of the hexagram depend on the mechanism for casting.",
	    'distribution-yarrow': "A yarrow cast with 4n+2 stalks, 6:7:8:9 :: 1:5:7:3.",
	    'distribution-coins': "A yarrow cast with 4n+1 stalks, 6:7:8:9 :: 1:3:3:1.",
	    'distribution-invert': "A yarrow cast with 4n+0 stalks, 6:7:8:9 :: 3:7:5:1.",
	    'distribution-6-scored-as-3': "A yarrow cast with 4n+3 stalks, 6 scored as 3, 6:7:8:9 :: 0:4:8:4.",
	    'distribution-6-scored-as-2': "A yarrow cast with 4n+3 stalks, 6 scored as 2, 6:7:8:9 :: 4:8:4:0.",
	    'distribution-uniform': "A uniform cast produces the lines 6:7:8:9 in frequencies of 1:1:1:1.",
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
	const select_option =(id, lbl, chk, dis) =>
	      html`<option value="${id}" selected?=${chk} disabled?=${dis}>${lbl}</option>`;
	// ${select_option('manual', 'Manual entry', _protocol==='manual', true)}
	return html`
      ${SharedStyles}
      <style>
	div.action { text-align: center; }
      </style>
      <section>
        <h2>Settings</h2>
	<p title="${title.text}">Text: 
	  <select on-input=${e => store.dispatch(changeBook(e.target.value))} value="${_book}">
	    ${select_option('yizhou', 'Yizhou', _book==='yizhou')}
	    ${select_option('legge', 'Legge', _book==='legge')}
	    ${select_option('wilhelm', 'Wilhelm', _book==='wilhelm')}
	    ${select_option('wilhelm-baynes', 'Wilhelm/Baynes', _book==='wilhelm-baynes')}
	    ${select_option('wilhelm-google', 'Wilhelm/Google', _book==='wilhelm-google')}
          </select>
	</p>
	<p title="${title.format}">Reading format:
	  <select on-input=${e => store.dispatch(changeFormat(e.target.value))} value="${_format}">
	    ${select_option('single', 'Single casts', _format==='single')}
	    ${select_option('multiple', 'Multiple casts', _format==='multiple')}
	  </select>
	</p>
	<p title="${title.protocol}">Clicks per cast:
	  <select on-input=${e => store.dispatch(changeProtocol(e.target.value))} value="${_protocol}">
	    ${select_option('one-per-cast', '1', _protocol==='one-per-cast')}
	    ${select_option('one-per-line', '6', _protocol==='one-per-line')}
	    ${select_option('three-per-line', '18', _protocol==='three-per-line')}
	  </select>
	</p>
	<p title="${title.distribution}">Line distribution:
	  <select on-input=${e => store.dispatch(changeDist(e.target.value))} value="${_dist}">
	    ${select_option('coins', 'coins', _dist==='coins')}
	    ${select_option('yarrow', 'yarrow', _dist==='yarrow')}
	    ${select_option('invert', 'invert', _dist==='invert')}
	  </select>
	</p>
	<div class="action">
	  <button title="Reset the settings to the default values." on-click="${_ => this._resetClick()}">Reset</button>
	</div>
      </section>
    `
    }

    _stateChanged(state) {
	// console.log(`change-settings._stateChanged(_book=${state.change.book})`);
	this._dist = state.change.dist;
	this._format = state.change.format;
	this._protocol = state.change.protocol;
	this._book = state.change.book;
    }
    
    _resetClick() {
	// console.log("change-settings _resetClick");
	store.dispatch(changeDist('coins'));
	store.dispatch(changeFormat('single'));
	store.dispatch(changeProtocol('one-per-cast'));
	store.dispatch(changeBook('wilhelm-baynes'));
    }

}

window.customElements.define('change-settings', ChangeSettings);
