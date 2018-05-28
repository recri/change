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
import { navigate, changeDist, changeFormat } from '../actions/app.js';

class ChangeSettings extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    dist: String,
	    format: String
	}
    }

    _render({dist, format}) {
	return html`
      ${SharedStyles}
      <section>
        <h2>Settings</h2>
	<form on-submit="${(e) => this.onSubmit.bind(this)(e)}" on-cancel="${(e) => this.onCancel.bind(this)(e)}">
	<p>Line distribution:</p>
	  <div>
	    <input type="radio" id="distYarrow" name="dist" value="yarrow" checked?=${dist==='yarrow'}>
	    <label for="distYarrow">Yarrow stalks</label>
	    <input type="radio" id="distCoins" name="dist" value="coins" checked?=${dist==='coins'}>
	    <label for="distCoins">Coins</label>
	    <input type="radio" id="distUniform" name="dist" value="uniform" checked?=${dist==='uniform'}>
	    <label for="distUniform">Uniform</label>
	  </div>
	<p>Reading format:</p>
	  <div>
	    <input type="radio" id="formSingle" name="format" value="single" checked?=${format==='single'}>
	    <label for="formSingle">Single casts</label>
	    <input type="radio" id="formMultiple" name="format" value="multiple" checked?=${format==='multiple'}>
	    <label for="formMultiple">Multiple casts</label>
	    <input type="radio" id="formLinked" name="format" value="linked" checked?=${format==='linked'}>
	    <label for="formLinked">Linked casts</label>
	  </div>
	  <div>
	    <button type="submit">Set</button>
	    <button type="reset">Reset</button>
	  </div>
	</form>
      </section>
    `
    }

    _stateChanged(state) {
	this.dist = state.app.dist;
	this.format = state.app.format;
    }

    onSubmit(e) {
	e.preventDefault();
	for (const entry of new FormData(this.shadowRoot.querySelector('form'))) {
	    for (const [name, value] of entry) {
		switch (name) {
		case 'dist':
		    if (value !== dist) store.dispatch(changeDist(value));
		    break;
		case 'format':
		    if (value !== format) store.dispatch(changeFormat(value));
		    break;
		}
	    }
	}
    }
}

window.customElements.define('change-settings', ChangeSettings);
