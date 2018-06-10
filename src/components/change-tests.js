/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, svg } from 'lit-html/lib/lit-extended.js';

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
	const makeBigBarCharts = (dist, cast) => {
	    _iching.setDist(dist);
	    var init = {}, fini = {}
	    const n = 100000
	    for (let i = 0; i < n; i += 1) {
		const c = cast();
		const s = _iching.backward(c);
		const f = _iching.forward(c);
		if (init[s]) init[s] += 1; else init[s] = 1;
		if (fini[f]) fini[f] += 1; else fini[f] = 1;
	    }
	    const inits = Object.getOwnPropertyNames(init).sort();
	    console.log(inits);
	    console.log(inits.map(x => init[x]));
	    const drawBar = (x1, ns, s, i) => {
		const x2 = x1+(8*100*ns/n);
		return svg`
		      <line x1$="${x1}" x2$="${x2}" y1$="${i*4+2}" y2$="${i*4+2}" stroke="black" stroke-width="2">
			<title>${s} ${_iching.getBookText('wilhelm-baynes', s,'name')} ${100*ns/n}%</title>
		      </line>`
	    }
	    return html`
		<svg viewBox="0 0 200 256" preserveAspectRatio="none" width="100%" height="256px">
		  ${inits.map((s,i) => drawBar(0, init[s], s, i))}
		  ${inits.map((s,i) => drawBar(100, fini[s], s, i))}
		</svg>
		`;
	}
	const sample = (dist) => _iching.choosen(_iching.hist_for_dist(dist, '6789'), 1000);
	const makeBarChart = (dist) => {
	    const keys = '6789';
	    const str = sample(dist)
	    const n = str.length;
	    let counts = { }
	    for (let d of keys.split('')) counts[d] = 0
	    for (let d of str.split('')) counts[d] += 1;
	    // console.log(`counts: ${'6789'.split('').map(d => d+': '+counts[d])}`);
	    return html`<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="20px">
			  <g fill="black" stroke="black">
			    <rect x="0" y="0"  width$="${counts['6']*100/n}" height="20"><title>6 ${counts['6']*100/n}%</title></rect>
			    <rect x="0" y="25" width$="${counts['7']*100/n}" height="20"><title>7 ${counts['7']*100/n}%</title></rect>
			    <rect x="0" y="50" width$="${counts['8']*100/n}" height="20"><title>8 ${counts['8']*100/n}%</title></rect>
			    <rect x="0" y="75" width$="${counts['9']*100/n}" height="20"><title>9 ${counts['9']*100/n}%</title></rect>
			  </g>
			</svg>`;
	}
	const distBarChart = (title, dist) => {
	    return html`<p>${title} (${_iching.distByName(dist)})</p><div>${makeBarChart(_iching.distByName(dist))}</div>`
	}
	const distBigBarChart = (title, dist) =>
	      html`
		<p>${title}</p>
		<p>Initial Hexagram ----> Final Hexagram</p>
		<div>
		  ${makeBigBarCharts(dist, () => _iching.cast(''))}
		</div>
		`;

	return html`
      ${SharedStyles}
      <style>
	div.action { text-align: center; }
      </style>
      <section>
        <h2>Tests</h2>
	<h3>Line distributions</h3>
	${distBarChart('Yarrow Distribution', 'yarrow')}
	${distBarChart('Inverted Yarrow Distribution', 'invert')}
	${distBarChart('Coin Distribution', 'coins')}
	${distBarChart('6 Scored As 3 Distribution', '6-scored-as-3')}
	${distBarChart('6 Scored As 2 Distribution', '6-scored-as-2')}
	${distBarChart('Uniform Distribution', 'uniform')}
	<h3>Hexagram distributions</h3>
	${distBigBarChart('Yarrow Distribution', 'yarrow')}
	${distBigBarChart('Inverted Yarrow Distribution', 'invert')}
	${distBigBarChart('Coin Distribution', 'coins')}
	${distBigBarChart('6 Scored As 3 Distribution', '6-scored-as-3')}
	${distBigBarChart('6 Scored As 2 Distribution', '6-scored-as-2')}
	${distBigBarChart('Uniform Distribution', 'uniform')}
      </section>
    `
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
    }
}

window.customElements.define('change-tests', ChangeTests);
