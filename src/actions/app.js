/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_WIDE_LAYOUT = 'UPDATE_WIDE_LAYOUT';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const INSTALL_PROMPT = 'INSTALL_PROMPT'

export const CHANGE_CAST = 'CHANGE_CAST';
export const CHANGE_REDO = 'CHANGE_UNDO';
export const CHANGE_UNDO = 'CHANGE_UNDO';
export const CHANGE_CLEAR = 'CHANGE_CLEAR';
export const CHANGE_UPDATE = 'CHANGE_UPDATE';
export const CHANGE_DOWN = 'CHANGE_DOWN';

export const CHANGE_DIST = 'CHANGE_DIST';
export const CHANGE_CUSTOM = 'CHANGE_CUSTOM';
export const CHANGE_FORMAT = 'CHANGE_FORMAT';
export const CHANGE_PROTOCOL = 'CHANGE_PROTCOL';

export const navigate = (path) => (dispatch) => {
    // Extract the page name from path.
    var page = path === '/' ? 'view' : path.slice(1);

    if (/^([6789]{6})([;,-][6789]{6})*$/.test(page)) {
	dispatch(changeUpdate(page));
	page = 'view';
    }

    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));

    // Close the drawer - in case the *path* change came from a link in the drawer.
    dispatch(updateDrawerState(false));
};

const loadPage = (page) => async (dispatch) => {
    switch(page) {
    case 'view':
	await import('../components/change-view.js');
	break;
    case 'settings':
	await import('../components/change-settings.js');
	break;
    case 'about':
	await import('../components/change-about.js');
	break;

    default:
	await import('../components/change-view404.js');
	break;
    }

    dispatch(updatePage(page));
}

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
}

export const updateLayout = (wideLayout) => (dispatch, getState) => {
   dispatch({
     type: UPDATE_WIDE_LAYOUT,
     wideLayout
  })
  // Open the drawer when we are switching to wide layout and close it when we are
  // switching to narrow.
  dispatch(updateDrawerState(wideLayout));
}

export const updateDrawerState = (opened) => (dispatch, getState) => {
  const app = getState().app;
  // Don't allow closing the drawer when it's in wideLayout.
  if (app.drawerOpened !== opened && (!app.wideLayout || opened)) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
}

export const installPrompt = (e) => (dispatch) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Show the prompt
    e.prompt();
}

export const changeType = (t) => (dispatch) => {
    dispatch({ type: t });
    dispatch(updateDrawerState(false));
}

export const changeCast = () => (dispatch) => dispatch(changeType(CHANGE_CAST));
export const changeRedo = () => (dispatch) => dispatch(changeType(CHANGE_REDO));
export const changeUndo = () => (dispatch) => dispatch(changeType(CHANGE_UNDO));
export const changeClear = () => (dispatch) => dispatch(changeType(CHANGE_CLEAR));
export const changeDown = () => (dispatch) => dispatch(changeType(CHANGE_DOWN));

export const changeUpdate = (change) => (dispatch) => {
    dispatch({ type: CHANGE_UPDATE, change});
    dispatch(updateDrawerState(false));
}
export const changeDist = (dist) => (dispatch) => {
    dispatch({ type: CHANGE_DIST, dist});
    dispatch(updateDrawerState(false));
}
export const changeCustom = (custom) => (dispatch) => {
    dispatch({ type: CHANGE_CUSTOM, custom});
    dispatch(updateDrawerState(false));
}
export const changeFormat = (format) => (dispatch) => {
    dispatch({ type: CHANGE_FORMAT, format});
    dispatch(updateDrawerState(false));
}
export const changeProtocol = (protocol) => (dispatch) => {
    dispatch({ type: CHANGE_PROTOCOL, protocol});
    dispatch(updateDrawerState(false));
}



