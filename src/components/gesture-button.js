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
//
// gesture events are tailored to work the same on mouse and touch devices
// they were a big point in Polymer-1.0 and Polymer-2.0 but Polymer-3.0 
// isn't clear on whether they're there or not.
//

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

export class GestureButton extends GestureEventListeners(PageViewElement) {

    static get properties() {
	return {
	}
    }

    constructor() {
	super();
	Gestures.addListener(this, 'tap', this.tapHandler.bind(this));
	Gestures.addListener(this, 'down', this.downHandler.bind(this));
	Gestures.addListener(this, 'up', this.upHandler.bind(this));
    }
    disconnectedCallback() {
	super.disconnectedCallback();
	Gestures.removeListener(this, 'tap', this.tapHandler.bind(this));
	Gestures.removeListener(this, 'down', this.downHandler.bind(this));
	Gestures.removeListener(this, 'up', this.upHandler.bind(this));
    }
    
    _render(props) {
	return html`
		<style>
		  button {
		    background: none;
		    border: none;
		    fill: var(--app-header-text-color);
		    cursor: pointer;
		  }
		</style>
		<button><slot></slot></button>`;
    }

    tapHandler(e) { }
    downHandler(e) { }
    upHandler(e) { }

}

window.customElements.define('gesture-button', GestureButton);
