/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { changeUpdate } from '../actions/change.js';

import { ChangeView } from './change-view.js';

//import { gestureIcon, backspaceIcon, clearIcon } from './change-icons.js';
import { plusIcon, minusIcon, clearIcon } from './change-icons.js';

import { kua } from './kua.js';

export class ChangeCast extends connect(store)(GestureEventListeners(PageViewElement)) {
    static get properties() {
	return {
	    _iching: Object,
	    _change: String,	// /^(([6789]{6})(,[6789]{6}))?*$/
	    _dist: String,	// /^(yarrow|coins|uniform)$/
	    _format: String,	// /^(single|multiple)$/
	    _protocol: String,	// /^(one-per-cast|one-per-line|three-per-line)$/
	    _book: String,	// text to pull reading from
	    _in_cast: Boolean,	// in a cast
	    _partial: String,	// partially cast hexagram
	    _stalks: String	// stalk counts for partially cast hexagram
	}
    }
    constructor() {
	super();
	this._partial = '';
	this._stalks = '';
	this._ignore = _ => true;
	Gestures.addListener(this, 'tap', this._ignore);
	Gestures.addListener(this, 'down', this._ignore);
	Gestures.addListener(this, 'up', this._ignore);
    }
    disconnectedCallback() {
	Gestures.removeListener(this, 'tap', this._ignore);
	Gestures.removeListener(this, 'down', this._ignore);
	Gestures.removeListener(this, 'up', this._ignore);
	super.disconnectedCallback();
    }

    _render({_iching, _change, _dist, _format, _protocol, _book, _in_cast, _partial, _stalks}) {
	// cast button becomes conditional on protocol
	const cast_down = this._castDown.bind(this);
	const cast_tap = this._castTap.bind(this);
	const cast_button = () => 
	      html`<span role="button" class="button" on-down="${_ => this._castDown()}" on-tap="${_ => this._castTap()}" tabindex="0" title="Cast reading">${plusIcon}</span>`;
	const clear_button = () => 
	      _change === '' || _format === 'single' || _change.length < 13 ? 
	      html`` : 
	      html`<span role="button" class="button" on-tap="${_ => this._clear()}" tabindex="0" title="Clear reading">${clearIcon}</span>`;
	const undo_change = _iching.undo(_change)
	const undo_button = () => 
	      _change === '' || _format === 'single' ? 
	      html`` : 
	      html`<span role="button" class="button" on-tap="${_ => this._undo()}" tabindex="0" title="Undo reading">${minusIcon}</span>`;
	const partial_hexagram = () => html`${kua(_partial)}`;

	_iching.setDist(_dist);

	return html`
		${SharedStyles}
		<style>
		  div { border-style: solid; border-width: 2px; border-radius: 5px; margin: 5px; padding: 5px; }
		  div.action { text-align: right; }
		  svg.kua { width: 48px; height: 48px; }
		  svg.kua .kua-line { stroke: black; }
		  svg.kua .kua-mark { stroke: black; }
		  .button { height:auto; width:auto; }
		  .button svg { height:48px; width: 48px; }
		</style>
		<change-view id="top" _change="${_change}" _iching="${_iching}" _book="${_book}"></change-view>
		<section>
		  <div id="cast" class="action">
		    ${partial_hexagram()}
		    ${_partial} ${_stalks}
		    ${clear_button()}
		    ${undo_button()}
		    ${cast_button()}
		  </div>
		</section>
		`;
    }

    _didRender(props, changedProps, prevProps) {
	// this doesn't work, the focus doesn't
	// appear to work either
	// console.log(`scrollIntoView`)
	// const cast = this.shadowRoot.getElementById('cast');
	// cast.focus();
	// cast.scrollIntoView(false);
    }

    _stateChanged(state) {
	this._iching = state.change.iching;
	this._change = state.change.change;
	this._dist = state.change.dist;
	this._format = state.change.format;
	this._protocol = state.change.protocol;
	this._book = state.change.book;
    }

    _castDown() {
	this._downtime = Date.now();
	// start animation of unchosen lines
    }

    _castTap() {
	const taptime = Date.now();
	if ( ! this._in_cast) {
	    this._in_cast = true;
	    this._partial = '';
	    this._stalks = '';
	}
	this._iching.srandom(taptime+(taptime-this._downtime));
	switch (this._protocol) {
	case 'one-per-cast':
	    this._partial = this._iching.cast('');
	    // console.log(`castTap ${this._protocol} ${this._partial} <- ${this._stalks}`);
	    this._finishCast();
	    break;
	case 'one-per-line':
	    this._partial = this._iching.castLine(this._partial); 
	    // console.log(`castTap ${this._protocol} ${this._partial} <- ${this._stalks}`);
	    if (this._partial.length === 6) this._finishCast();
	    break;
	case 'three-per-line':
	    this._stalks = this._iching.castStalks(this._stalks);
	    this._partial = this._iching.translateStalks(this._stalks)
	    // console.log(`castTap ${this._protocol} ${this._partial} <- ${this._stalks}`);
	    if (this._stalks.length === 18) {
		this._finishCast();
	    }
	    break;
	}
    }

    _finishCast() {
	// console.log(`_finishCast() partial = ${this._partial} format = ${this._format}`);
	const partial = this._partial
	const change = this._change
	this._in_cast = false;
	this._partial = '';
	this._stalks = '';
	if (change === '' || this._format === 'single')
	    store.dispatch(changeUpdate(partial));
	else
	    store.dispatch(changeUpdate(change+','+partial));
    }

    _clear() {
	store.dispatch(changeUpdate(''));
    }

    _undo() {
	store.dispatch(changeUpdate(this._iching.undo(this._change)));
    }
}

window.customElements.define('change-cast', ChangeCast);
