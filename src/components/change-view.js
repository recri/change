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

export class ChangeView extends connect(store)(PageViewElement) {
    static get properties() {
	return {
	    change: String,
	    // index: Number,
	    iching: Object,
	    dist: String
	}
    }

    constructor() {
	super();
    }
    
    _render({change, iching, dist}) {
	const breakAtNewlines = (str, skipFirst) => skipFirst ?
	      str.split('\n').slice(1).map((x) => html`${x}<br/>\n`) :
	      str.split('\n').map((x) => html`${x}<br/>\n`);
	const getText = (hex,value) => this.iching.getText(hex, value);
	const getBoolean = (hex,value) => this.iching.getBoolean(hex, value);
	const getCommentary = (hex,value) => this.iching.getCommentary(hex, value);
	const getNumber = (hex) => getText(hex,"number");
	// const getCharacter = (hex) => getText(hex,"character");
	// const getHexagram = (hex) => getText(hex,"hexagram");
	const getHexagram = (hex) => iching.kua(hex);
	// const getName = (hex) => getText(hex,"name");
	const getNameInterpretation = (hex) => getText(hex,"name-interpretation");
	// const getPinyin = (hex) => getText(hex,"pinyin");
	// const getAbove = (hex) => getText(hex,"above");
	// const getAboveInterpretation = (hex) => getText(hex,"above-interpretation");
	// const getBelow = (hex) => getText(hex,"below");
	// const getBelowInterpretation = (hex) => getText(hex,"below-interpretation");
	const getJudgment = (hex) => breakAtNewlines(getText(hex,"judgment"), false);
	const getImage = (hex) => breakAtNewlines(getText(hex,"image"), false);
	const getLine = (hex,line) => breakAtNewlines(getText(hex,`line-${line}`), true);
	const getLineOrdinal = (hex,line) => getText(hex,`line-${line}`).split('\n')[0];
	const getLineGoverning = (hex,line) => getBoolean(hex, `line-${line}-governing-ruler`)
	const getLineConstituting = (hex,line) => getBoolean(hex, `line-${line}-constituting-ruler`)
	
	const isMovingLine = (line) => (line === '6' || line === '9');
	const isStationaryLine = (line) => (line === '7' || line === '8');
	const renderHex = (hex) => {
	    return html`
		<div class="hexagram" title="${getNameInterpretation(hex)}">
		${getHexagram(hex)}
		<div class="judgment" title="Judgment">${getJudgment(hex)}</div>
		<div class="image" title="Image">${getImage(hex)}</div>
		</div>
	    `;
	}

	const renderLink = (link, linkIndex, links) => {
	    const hex = iching.backward(link);
	    const finisHex = iching.forward(link);
	    const lines = link.split('')
	    const allMoving = lines.every(isMovingLine);
	    const allStationary = lines.every(isStationaryLine)
	    const isLast = linkIndex === links.length-1
	    const start = renderHex(hex);
	    const finis = isLast ? renderHex(finisHex) : html``;
	    const startName = getNameInterpretation(hex);
	    const finisName = getNameInterpretation(finisHex);
	    const bonus = allMoving && getLine(hex,7) !== undefined ?
		  html`<div class="line" title="${getLineOrdinal(hex, 7)}">${getLine(hex, 7)}</div>` :
		  html``;
	    const renderLine = (line, lineIndex) => {
		return isMovingLine(line) ?
		    // ${line} in the ${lineIndex+1} place.<br/>
		    html`<div class="line" title="${getLineOrdinal(hex, lineIndex+1)}">${getLine(hex, lineIndex+1)}</div>` :
		    html``;
	    }
	    const moving =
		  html`<div class="lines" title="${startName} -> ${finisName}">
			${getHexagram(link)}
			${lines.map(renderLine)}
			${bonus}
			</div>`;
	    return html`
		${start}
		${ ! allStationary ? moving : ''}
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
		  svg.kua { width: 24px; height: 24px; }
		  svg.kua .kua-line { stroke: black; }
		  svg.kua .kua-mark { stroke: black; }
		</style>
		<section>
		  ${links.map(renderLink)}
		</section>`;
	}
    }

    _stateChanged(state) {
	const {change, iching, dist} = state.app;
	this.change = change;
	this.iching = iching;
	this.dist = dist;
    }
    _shouldRender(props, changedProps, prevProps) {
	return true
    }
}

window.customElements.define('change-view', ChangeView);
