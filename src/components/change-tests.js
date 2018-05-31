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

class ChangeTests extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    _iching: Object,
	}
    }

    _render({_iching}) {
	return html`
      ${SharedStyles}
      ${ButtonSharedStyles}
      <style>
	div.action { text-align: center; }
      </style>
      <section>
        <h2>Tests</h2>
	<p>Yarrow Distribution</p>
	<div>
	  ${this._makeBarChart('6789', _iching.choosen(_iching.distYarrow), 1000)}
	</div>
	<p>Coins Distribution</p>
	<div>
  	  ${this._makeBarChart('6789', _iching.choosen(_iching.distCoins), 1000)}
	</div>
	<p>Uniform Distribution</p>
	<div>
  	  ${this._makeBarChart('6789', _iching.choosen(_iching.distUniform), 1000)}
	</div>
	<p>Custom Distribution</p>
	<div>
  	  ${this._makeBarChart('6789', _iching.choosen(_iching.getCustom()), 1000)}
	</div>
      </section>
    `
    }

    _stateChanged(state) {
	console.log(`change-tests stateChanged ${state.change.iching}`);
	this._iching = state.change.iching;
    }
    
    _makeBarChart(str) {
	const n = str.length;
	let counts = { '6':0, '7': 0, '8': 0, '9': 0 }
	for (let d of str.split('').sort()) counts[d]++
	const bar = (d) => html`${d.repeat(Math.round(counts[d]/20))}<br/>`
	return html`<div>${['6', '7', '8', '9'].map(bar)}</div>`
    }
	
}

window.customElements.define('change-tests', ChangeTests);
