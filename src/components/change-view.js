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
	const breakAtNewlines = (str) => str.split('\n').map((x) => html`${x}<br/>\n`);
	const getChange = (hex,value) => Changes.changes[Changes.lines[Change.backward(hex)]][value];
	const getNumber = (hex) => getChange(hex,"number");
	const getCharacter = (hex) => getChange(hex,"character");
	const getHexagram = (hex) => getChange(hex,"hexagram");
	const getName = (hex) => getChange(hex,"name");
	const getNameInterpretation = (hex) => getChange(hex,"name-interpretation");
	const getPinyin = (hex) => getChange(hex,"pinyin");
	const getAbove = (hex) => getChange(hex,"above");
	const getAboveInterpretation = (hex) => getChange(hex,"above-interpretation");
	const getBelow = (hex) => getChange(hex,"below");
	const getBelowInterpretation = (hex) => getChange(hex,"below-interpretation");
	const getJudgment = (hex) => breakAtNewlines(getChange(hex,"judgment"));
	const getImage = (hex) => breakAtNewlines(getChange(hex,"image"));
	const getLine = (hex,line) => breakAtNewlines(getChange(hex,`line-${line}`));
	
	const isMovingLine = (line) => (line === '6' || line === '9');
	const renderHex = (hex) => {
	    return html`
		<div class="hexagram" title="${getNameInterpretation(hex)}">
		<div class="judgment" title="Judgment">${getJudgment(hex)}</div>
		<div class="image" title="Image">${getImage(hex)}</div>
		</div>
	    `;
	}
	const renderLink = (link, linkIndex, links) => {
	    const lines = link.split('')
	    const allMoving = lines.every(isMovingLine);
	    const isLast = linkIndex === links.length-1
	    const renderLine = (line, lineIndex, lines) => {
		return isMovingLine(line) ?
		    // ${line} in the ${lineIndex+1} place.<br/>
		    html`<div class="line">${getLine(link, lineIndex+1)}</div>` :
		    html``;
	    }
	    var rendered = [];
	    rendered.push(html`${renderHex(Change.backward(link))}`);
	    rendered.push(html`<div class="lines" title="Moving Lines">`);
	    rendered.push(html`${lines.map(renderLine)}`);
	    if (allMoving && getLine(link,7) !== undefined) {
		// look for possible bonus line reading
		rendered.push(html`<div class="line">${getLine(link, lineIndex+1)}</div>`);
	    }
	    rendered.push(html`</div>`);
	    if (isLast) {
		// last link in chain, render result hexagram
		rendered.push(html`${renderHex(Change.forward(link))}`);
	    }
	    return html`${rendered}`;
	}
	if (change === '') {
	    return html``;
	} else {
	    const links = change.split(',');
	    return html`
		${SharedStyles}
		<style>
		  div { outline-style: solid; outline-width: 1px; padding: 4px }
		</style>
		<section>
		  ${links.map(renderLink)}
		</section>`;
	}
    }
}

window.customElements.define('change-view', ChangeView);
