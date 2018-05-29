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
import { changeUpdate } from '../actions/app.js';

import { GestureButton } from './gesture-button.js';

import { kua } from '../code/kua.js';

import { Random } from '../code/random.js';
import { Changes } from '../code/changes.js';
import { Change } from '../code/change.js';

const random = new Random();
const iching = new Change(random, Changes);

export class ChangeView extends connect(store)(PageViewElement) {
    static get properties() {
	return {
	    _change: String,	// /^(([6789]{6})([-,;][6789]{6}))?*$/
	    _dist: String,	// /^(yarrow|coins|uniform|custom)$/
	    _custom: String,	// /^[1-9]{4}$/
	    _format: String,	// /^(single|multiple|linked|threaded)$/
	    _protocol: String	// /^(one-per-cast|one-per-line|three-per-line)$/
	}
    }

    _render({_change, _dist, _custom, _format, _protocol}) {
	const breakAtNewlines = (str, skipFirst) => str ?
	      str.split('\n').slice(skipFirst ? 1 : 0).map((x) => html`${x}<br/>\n`) : undefined;
	const getText = (hex,value) => iching.getText(hex, value);
	const getBoolean = (hex,value) => iching.getBoolean(hex, value);
	const getCommentary = (hex,value) => iching.getCommentary(hex, value);
	const getNumber = (hex) => getText(hex,"number");
	// const getCharacter = (hex) => getText(hex,"character");
	// const getHexagram = (hex) => getText(hex,"hexagram");
	const getHexagram = (hex) => kua(hex);
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
		<div class="hexagram" title="${getNumber(hex)}. ${getNameInterpretation(hex)}">
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
	    const startNumber = getNumber(hex);
	    const finisNumber = getNumber(finisHex);
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
		  html`<div class="lines" title="${startNumber}. ${startName} \u{2192} ${finisNumber}. ${finisName}">
			${getHexagram(link)}
			${lines.map(renderLine)}
			${bonus}
			</div>`;
	    return html`
		${start}
		${ ! allStationary ? moving : ''}
		${finis}`;
	}
	// cast button becomes conditional on protocol
	const cast_down = this._castDown.bind(this);
	const cast_tap = this._castTap.bind(this);
	const cast_button = () => html`<gesture-button active on-down="${cast_down}" on-tap="${cast_tap}">Cast</gesture-button>`;
	const clear_button = () => _change === '' ? 
	      html`` : 
	      html`<gesture-button active "button" on-tap="${_ => store.dispatch(changeUpdate(''))}">Clear</gesture-button>`;
	const undo_change = iching.undo(_change)
	const undo_button = () => _change === '' || undo_change === '' ? 
	      html`` : 
	      html`<gesture-button active "button" on-tap="${_ => store.dispatch(changeUpdate(undo_change))}">Undo</gesture-button>`;

	const links = _change.split(',');
	// 
	// this is a little hacky, ...
	if (iching.getCustom() !== _custom) iching.setCustom(_custom);
	if (iching.getDist() !== _dist || 'custom' === _dist) iching.setDist(_dist);
	if (iching.getFormat() !== _format) iching.setFormat(_format);

	return html`
		${SharedStyles}
		<style>
		  div { border-style: solid; border-width: 2px; border-radius: 5px; margin: 5px; padding: 5px }
		  div.action { text-align: center; }
		  svg.kua { width: 24px; height: 24px; }
		  svg.kua .kua-line { stroke: black; }
		  svg.kua .kua-mark { stroke: black; }
		</style>
		<section>
		  <div class="action">
		    ${cast_button()}
		    ${undo_button()}
		    ${clear_button()}
		  </div>
		  ${links.length > 0  && links[0].length > 0 ? links.map(renderLink) : ''}
		</section>`;
    }

    _stateChanged(state) {
	this._change = state.app.change;
	this._dist = state.app.dist;
	this._custom = state.app.custom
	this._format = state.app.format;
	this._protocol = state.app.protocol;
    }

    _castDown() {
	this._downtime = Date.now();
    }
    _castTap() {
	const taptime = Date.now();
	random.srandom(taptime+(taptime-this._downtime));
	switch (this._format) {
	case 'single': store.dispatch(changeUpdate(iching.cast(''))); break;
	case 'multiple': store.dispatch(changeUpdate(iching.cast(this._change))); break;
	case 'linked': store.dispatch(changeUpdate(iching.link(this._change))); break;
	}
    }
}

window.customElements.define('change-view', ChangeView);
