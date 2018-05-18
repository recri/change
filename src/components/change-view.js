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

import { ChangeChain } from './change-chain.js';
import { ChangeLink } from './change-link.js';
import { ChangeLine } from './change-line.js'

import { Change } from '../code/change.js';
import { Changes } from '../code/changes.js';

export class ChangeView extends PageViewElement {
    static get properties() {
	return {
	    change: String,
	    index: Number
	}
    }

    _render({change}) {
	const isMovingLine = (line) => (line === '6' || line === '9');
	const renderLine = (line, lineIndex, lines) => {
	    return isMovingLine(line) ?
		html`<div class="line">${line} in the ${lineIndex+1} place.</div>` :
		html``;
	}
	const renderHex = (hex) => {
	    return html`
		<div class="judgment">judgment ${hex}</div>
		<div class="image">image ${hex}</div>
	    `;
	}
	const renderLink = (link, linkIndex, links) => {
	    const lines = link.split('')
	    const allMoving = lines.every(isMovingLine);
	    const isLast = linkIndex === links.length-1
	    var rendered = [];
	    rendered.push(html`<div>link ${link}</div>`);
	    rendered.push(html`${renderHex(Change.backward(link))}`);
	    rendered.push(html`<div class="link">${lines.map(renderLine)}</div>`);
	    if (allMoving) {
		// look for possible bonus line reading
	    }
	    if (isLast) {
		// last link in chain, render result hexagram
		rendered.push(html`${renderHex(Change.forward(link))}`);
	    }
	    return html`${rendered}`;
	}
	const renderChain = (chain, chainIndex, chains) => {
	    const links = chain.split(',')
	    return html`<div class="chain">${links.map(renderLink)}</div>`;
	}
	if (change === '') {
	    return html``;
	} else {
	    const chains = change.split(';');
	    return html`
		${SharedStyles}
		<section>
		  <div class="change">${chains.map(renderChain)}</div>
		</section>`;
	}
    }
}

window.customElements.define('change-view', ChangeView);
