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
		${getHexagram(hex)} ${getNameInterpretation(hex)}
		<div class="judgment" title="Judgment">${getJudgment(hex)}</div>
		<div class="image" title="Image">${getImage(hex)}</div>
		</div>
	    `;
	}
	const renderLink = (link, linkIndex, links) => {
	    const lines = link.split('')
	    const allMoving = lines.every(isMovingLine);
	    const isLast = linkIndex === links.length-1
	    const start = renderHex(Change.backward(link));
	    const finis = isLast ? renderHex(Change.forward(link)) : html``;
	    const bonus = allMoving && getLine(link,7) !== undefined ?
		  html`<div class="line">${getLine(link, lineIndex+1)}</div>` :
		  html``;
	    const renderLine = (line, lineIndex, lines) => {
		return isMovingLine(line) ?
		    // ${line} in the ${lineIndex+1} place.<br/>
		    html`<div class="line">${getLine(link, lineIndex+1)}</div>` :
		    html``;
	    }
	    return html`
		${start}
		<div class="lines" title="Moving Lines">
		${getHexagram(Change.backward(link))} -> ${getHexagram(Change.forward(link))}
		${lines.map(renderLine)}
		${bonus}
		</div>
		${finis}
		`;
	}
	if (change === '') {
	    return html``;
	} else {
	    const links = change.split(',');
	    return html`
		${SharedStyles}
		<style>
		  div { border-style: solid; border-width: 2px; border-radius: 5px; margin: 5px; padding: 5px }
		</style>
		<section>
		  ${links.map(renderLink)}
		</section>`;
	}
    }
}

window.customElements.define('change-view', ChangeView);
