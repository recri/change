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
	const breakAtNewlines = (str, skipFirst) => skipFirst ?
	      str.split('\n').slice(1).map((x) => html`${x}<br/>\n`) :
	      str.split('\n').map((x) => html`${x}<br/>\n`);
	const getChange = (hex,value) => Changes.changes[Changes.lines[hex]][value];
	const getNumber = (hex) => getChange(hex,"number");
	// const getCharacter = (hex) => getChange(hex,"character");
	const getHexagram = (hex) => getChange(hex,"hexagram");
	// const getName = (hex) => getChange(hex,"name");
	const getNameInterpretation = (hex) => getChange(hex,"name-interpretation");
	// const getPinyin = (hex) => getChange(hex,"pinyin");
	// const getAbove = (hex) => getChange(hex,"above");
	// const getAboveInterpretation = (hex) => getChange(hex,"above-interpretation");
	// const getBelow = (hex) => getChange(hex,"below");
	// const getBelowInterpretation = (hex) => getChange(hex,"below-interpretation");
	const getJudgment = (hex) => breakAtNewlines(getChange(hex,"judgment"), false);
	const getImage = (hex) => breakAtNewlines(getChange(hex,"image"), false);
	const getLine = (hex,line) => breakAtNewlines(getChange(hex,`line-${line}`), true);
	const getLineOrdinal = (hex,line) => getChange(hex,`line-${line}`).split('\n')[0];
	
	const isMovingLine = (line) => (line === '6' || line === '9');
	const isStationaryLine = (line) => (line === '7' || line === '8');
	const renderHex = (hex) => {
	    return html`
		<div class="hexagram" title="${getNameInterpretation(hex)}">
		<h1>${getHexagram(hex)}</h1>
		<div class="judgment" title="Judgment">${getJudgment(hex)}</div>
		<div class="image" title="Image">${getImage(hex)}</div>
		</div>
	    `;
	}
	const renderLink = (link, linkIndex, links) => {
	    const hex = Change.backward(link);
	    const finisHex = Change.forward(link);
	    const lines = link.split('')
	    const allMoving = lines.every(isMovingLine);
	    const allStationary = lines.every(isStationaryLine)
	    const isLast = linkIndex === links.length-1
	    const start = renderHex(hex);
	    const finis = isLast ? renderHex(finisHex) : html``;
	    const startName = getNameInterpretation(hex);
	    const finisName = getNameInterpretation(finisHex);
	    const bonus = allMoving && getLine(hex,7) !== undefined ?
		  html`<div class="line">${getLine(hex, lineIndex+1)}</div>` :
		  html``;
	    const renderLine = (line, lineIndex) => {
		return isMovingLine(line) ?
		    // ${line} in the ${lineIndex+1} place.<br/>
		    html`<div class="line" title="${getLineOrdinal(hex, lineIndex+1)}">${getLine(hex, lineIndex+1)}</div>` :
		    html``;
	    }
	    const moving = ! allStationary ? 
		  html`<div class="lines" title="${startName} -> ${finisName}">
			<h1>${getHexagram(hex)} -> ${getHexagram(finisHex)}</h1>
			${lines.map(renderLine)}
			${bonus}
			</div>` :
		  html``;
	

	    return html`
		${start}
		${moving}
		${finis}`;
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
