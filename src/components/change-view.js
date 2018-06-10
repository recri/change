/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, LitElement } from '@polymer/lit-element';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { SharedStyles } from './shared-styles.js';

import { kua } from './kua.js';

export class ChangeView extends connect(store)(LitElement) {
    static get properties() {
	return {
	    _iching: Object,
	    _change: String,	// /^(([6789]{6})(,[6789]{6})*)?$/
	    _book: String,
	}
    }

    _render({_iching, _change, _book}) {
	const breakAtNewlines = (str, skipFirst) => str ?
	      str.split('\n').map((x) => html`${x}<br/>\n`) : undefined;
	const getText = (hex,value) => _iching.getBookText(_book, hex, value);
	const getBoolean = (hex,value) => _iching.getBookBoolean(_book, hex, value);
	const getCommentary = (hex,value) => _iching.getCommentary(hex, value);
	const getNumber = (hex) => getText(hex,"number");
	// const getCharacter = (hex) => getText(hex,"character");
	// const getHexagram = (hex) => getText(hex,"hexagram");
	const getHexagram = (hex) => kua(hex);
	// const getName = (hex) => getText(hex,"name");
	const getName = (hex) => getText(hex,"name");
	// const getPinyin = (hex) => getText(hex,"pinyin");
	const getJudgment = (hex) => breakAtNewlines(getText(hex,"judgment"));
	// const getImage = (hex) => breakAtNewlines(getText(hex,"image"));
	const getLine = (hex,line) => breakAtNewlines(getText(hex,`line-${line}-text`));
	const getLineOrdinal = (hex,line) => getText(hex,`line-${line}-ordinal`);
	// const getLineGoverning = (hex,line) => getBoolean(hex, `line-${line}-governing-ruler`)
	// const getLineConstituting = (hex,line) => getBoolean(hex, `line-${line}-constituting-ruler`)
	
	const isMovingLine = (line) => (line === '6' || line === '9');
	const isStationaryLine = (line) => (line === '7' || line === '8');
	const renderHex = (hex) => {
	    /* <div class="image" title="Image">${getImage(hex)}</div> */
	    return html`
		<div class="hexagram" title="${getNumber(hex)}. ${getName(hex)}">
		${getHexagram(hex)}
		<div class="judgment ${_book}" title="Judgment">${getJudgment(hex)}</div>
		</div>
	    `;
	}

	const renderLink = (link, linkIndex, links) => {
	    const hex = _iching.backward(link);
	    const finisHex = _iching.forward(link);
	    const lines = link.split('')
	    const allMoving = lines.every(isMovingLine);
	    const allStationary = lines.every(isStationaryLine)
	    const isLast = linkIndex === links.length-1
	    const start = renderHex(hex);
	    const finis = isLast ? renderHex(finisHex) : html``;
	    const startNumber = getNumber(hex);
	    const finisNumber = getNumber(finisHex);
	    const startName = getName(hex);
	    const finisName = getName(finisHex);
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
		  html`<div class="lines" title="${startNumber}. ${startName} \u{2192} ${finisNumber}. ${finisName}">
			${getHexagram(link)}
			${lines.map(renderLine)}
			${bonus}
			</div>`;
	    return html`
		<section>
		${ allStationary ? start : ''}
		${ ! allStationary ? moving : ''}
		</section>`;
	}

	const links = _change.split(',');

	if (_iching.getBook() !== _book) _iching.setBook(_book);

	return html`
		${SharedStyles}
		<style>
		  div { border-style: solid; border-width: 2px; border-radius: 5px; margin: 5px; padding: 5px }
		  svg.kua { width: 24px; height: 24px; }
		  svg.kua .kua-line { stroke: black; }
		  svg.kua .kua-mark { stroke: black; }
		</style>
		${links.length > 0 && links[0].length > 0 ? links.map(renderLink) : ''}`;
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
	this._book = state.change.book;
    }


}

window.customElements.define('change-view', ChangeView);
