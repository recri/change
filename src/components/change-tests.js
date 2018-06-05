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

class ChangeTests extends connect(store)(PageViewElement) {

    static get properties() {
	return {
	    _iching: Object,
	}
    }

    _render({_iching}) {
	const makeBigBarCharts = (cast) => {
	    var init = {}, fini = {}
	    const n = 10000
	    for (let i = 0; i < 10000; i += 1) {
		const c = cast();
		const s = _iching.backward(c);
		const f = _iching.forward(c);
		if (init[s]) init[s] += 1; else init[s] = 1;
		if (fini[f]) fini[f] += 1; else fini[f] = 1;
	    }
	    return html``;
	}
	const sample = (dist) => _iching.choosen(_iching.hist_for_dist(dist, '6789'), 1000);
	const makeBarChart = (dist) => {
	    const keys = '6789';
	    const str = sample(dist)
	    const n = str.length;
	    let counts = { }
	    for (let d of keys.split('')) counts[d] = 0
	    for (let d of str.split('')) counts[d] += 1;
	    console.log(`counts: ${'6789'.split('').map(d => d+': '+counts[d])}`);
	    return html`<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="20px">
			  <g fill="black" stroke="black">
			    <rect x="0" y="0"  width$="${counts['6']*100/n}" height="20"></rect>
			    <rect x="0" y="25" width$="${counts['7']*100/n}" height="20"></rect>
			    <rect x="0" y="50" width$="${counts['8']*100/n}" height="20"></rect>
			    <rect x="0" y="75" width$="${counts['9']*100/n}" height="20"></rect>
			  </g>
			</svg>`;
	}
	return html`
      ${SharedStyles}
      <style>
	div.action { text-align: center; }
      </style>
      <section>
        <h2>Tests</h2>
	<p>Yarrow Distribution (${_iching.distYarrow})</p>
	<div>
	  ${makeBarChart(_iching.distYarrow)}
	</div>
	<p>Coins Distribution (${_iching.distCoins})</p>
	<div>
  	  ${makeBarChart(_iching.distCoins)}
	</div>
	<p>Uniform Distribution (${_iching.distUniform})</p>
	<div>
  	  ${makeBarChart(_iching.distUniform)}
	</div>
	<p>Custom Distribution(${_iching.getCustom()})</p>
	<div>
  	  ${makeBarChart(_iching.getCustom())}
	</div>
	<p>Result Distribution (1/64th)</p>
	<div>
	  ${makeBigBarCharts(() => _iching.cast(''))}
	</div>
      </section>
    `
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
    }
}

window.customElements.define('change-tests', ChangeTests);
