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

class ChangeShow extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    _change: String
	}
    }

    _render({_change}) {
	return html`
      ${SharedStyles}
      ${ButtonSharedStyles}
      <style>
	div { width: 100%; text-align: center; }
      </style>
      <section>
        <h2>Show URL</h2>
	<div>
	  <p>This URL for your current reading can be copied and pasted into another browser or shared.</p>
	  <textarea>https://change.elf.org/${_change}</textarea>
        </div>
      </section>
    `;
    }

    _stateChanged(state) {
	this._change = state.change.change;
    }
}

window.customElements.define('change-show', ChangeShow);
