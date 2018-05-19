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

class ChangeAbout extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>About Change</h2>
        <p>
	This web app allows you to digitally consult the <i>I Ching</i>,
	which you may read about in <a href="https://en.wikipedia.org/wiki/I_Ching">Wikipedia</a>.
	</p><p>
	The translation is the Wilhelm/Baynes version, 
	but the text was taken from a web site which did not proofread 
	their typists carefully enough.
	I have omitted commentaries and boiler plate in order to give a minimally cluttered rendition.
	</p><p>
	The app uses the line distribution of the yarrow stalk oracle, 
	so old yang lines occur three times as often as old yin lines.
	</p><p>
	Making another cast when a reading is already displayed
	will chain the new cast onto the existing reading.
	</p><p>
	This progressive web app can be downloaded and used off-line.  It was written using
	the <a href="https://github.com/Polymer/pwa-starter-kit">Polymer pwa-starter-kit</a>.
	</p><p>
	More details can be found at <a href="https://elf.org/change">elf.org/change</a>.
        </p>
      </section>
    `
  }
}

window.customElements.define('change-about', ChangeAbout);
