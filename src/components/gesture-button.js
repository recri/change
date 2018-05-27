//
// gesture events are tailored to work the same on mouse and touch devices
//
import { html, LitElement } from '@polymer/lit-element';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

export class GestureButton extends GestureEventListeners(LitElement) {

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
	return html`<style></style><button><slot></slot></button>`;
    }

    tapHandler(e) { }
    downHandler(e) { }
    upHandler(e) { }

}

window.customElements.define('gesture-button', GestureButton);
