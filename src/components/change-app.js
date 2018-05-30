/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';

import { menuIcon } from './change-icons.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

import { store } from '../store.js';

import { navigate, updateDrawerState, updateLayout, installPrompt } from '../actions/app.js';

class ChangeApp extends connect(store)(LitElement) {
    _render({appTitle, _page, _drawerOpened, _wideLayout, _change, _install}) {
	// Anything that's related to rendering should be done in here.
	// construct an install button when 
	const installPrompt = _install ?
	      html`<button on-click="${this._installPrompt.bind(this)(_install)}">Install</button>` :
	      html``;
	
	return html`
    <style>
      :host {
        --app-drawer-width: 256px;
        display: block;

        --app-primary-color: #E91E63;
        --app-secondary-color: #293237;
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: white;
        --app-section-even-color: #f7f7f7;
        --app-section-odd-color: white;

        --app-header-background-color: white;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-primary-color);

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: #78909C;
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
	right: 0;
        text-align: center;
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color);
        border-bottom: 1px solid #eee;
      }

      .toolbar-top {
        background-color: var(--app-header-background-color);
      }

      [main-title] {
	/* text-transform: lowercase; */
        font-size: 30px;
        margin-right: 44px;
      }

      .menu-btn {
        background: none;
        border: none;
        fill: var(--app-header-text-color);
        cursor: pointer;
        height: 44px;
        width: 44px;
      }

      .drawer-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 24px;
        background: var(--app-drawer-background-color);
        position: relative;
      }

      .drawer-list > a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list > a[selected] {
        color: var(--app-drawer-selected-color);
      }

      .drawer-list > button {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
	background-color: transparent;
        line-height: 40px;
        padding: 0 24px;
      }

      .main-content {
        padding-top: 64px;
        min-height: 100vh;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      footer {
        padding: 24px;
        background: var(--app-drawer-background-color);
        color: var(--app-drawer-text-color);
        text-align: center;
      }
      footer a {
        color: var(--app-drawer-text-color);
      }

     /* Wide layout */
     @media (min-width: 768px) {
       app-header,
       .main-content,
       footer {
         margin-left: var(--app-drawer-width);
      }

        .menu-btn {
          display: none;
        }

        [main-title] {
          margin-right: 0;
        }
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" title="Menu" on-click="${_ => store.dispatch(updateDrawerState(true))}">${menuIcon}</button>
        <div main-title>${appTitle}</div>
      </app-toolbar>

    </app-header>

    <!-- Drawer content -->
    <app-drawer opened="${_drawerOpened}" persistent="${_wideLayout}"
        on-opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
      <nav class="drawer-list">
        <a selected?="${_page === 'view'}" href="/">View</a>
        <a selected?="${_page === 'settings'}" href="/settings">Settings</a>
        <a selected?="${_page === 'about'}" href="/about">About</a>
	${installPrompt}
      </nav>
    </app-drawer>

    <!-- Main content -->
    <main class="main-content">
      <change-view class="page" active?="${_page === 'view'}"></change-view>
      <change-settings class="page" active?="${_page === 'settings'}"></change-settings>
      <change-about class="page" active?="${_page === 'about'}"></change-about>
      <change-view404 class="page" active?="${_page === 'view404'}"></change-view404>
    </main>

    <footer>
      <p>
	Inner Truth.  Pigs and fishes.
      </p></p>
	<a href="https://elf.org" target="_blank" title="home page">elf.org</a>
      </p></p>
	2018-05-30-17-04
      <p>
    </footer>

    `;
    }

    static get properties() {
	return {
	    appTitle: String,
	    _page: String,
	    _drawerOpened: Boolean,
	    _wideLayout: Boolean,
	    _change: String,
	    _install: Object
	}
    }

    constructor() {
	super();
	// To force all event listeners for gestures to be passive.
	// See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
	setPassiveTouchGestures(true);
	// prepare for install to home screen event
	window.addEventListener('beforeinstallprompt', (e) => installPrompt(e))          
    }

    _firstRendered() {
	installRouter((location) => store.dispatch(navigate(window.decodeURIComponent(location.pathname))));
	installMediaQueryWatcher(`(min-width: 768px)`,
				 (matches) => store.dispatch(updateLayout(matches)));
    }

    _didRender(properties, changeList) {
	if ('_page' in changeList) {
	    const pageTitle = properties.appTitle + ' - ' + changeList._page;
	    updateMetadata({
		title: pageTitle,
		description: pageTitle
		// This object also takes an image property, that points to an img src.
	    });
	}
    }

    _stateChanged(state) {
	this._page = state.app.page;
	this._drawerOpened = state.app.drawerOpened;
	this._wideLayout = state.app.wideLayout;
	this._change = state.app.change;
	this._installPrompt = null;
    }

    _installPrompt(_install) {
	// clear the prompt
	installPrompt(null);
	// Show the prompt
	_install.prompt()
    }
}

window.customElements.define('change-app', ChangeApp);
