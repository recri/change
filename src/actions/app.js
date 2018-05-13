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
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const CHANGE_CAST = 'CHANGE_CAST';
export const CHANGE_RECAST = 'CHANGE_RECAST';
export const CHANGE_RESTART = 'CHANGE_RESTART';
export const CHANGE_SAVE = 'CHANGE_SAVE';
export const CHANGE_RESTORE = 'CHANGE_RESTORE';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_ABOUT = 'CHANGE_ABOUT';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'view1' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage = (page) => async (dispatch) => {
    switch(page) {
    case 'cast':
    case 'recast':
    case 'restart':
    case 'save':
    case 'restore':
    case 'settings':
    case 'about':
	await import('../components/change-'+page+'.js');
	break;

    case /^([0-7][0-7])*$/:
	// the 'page' is a sequence of hexagrams in octal
	await import('../components/change-view.js');
	break;

    default:
	page = 'view404';
	await import('../components/change-'+page+'.js');
	break;
	// old code
    case 'view1':
	await import('../components/my-view1.js');
	// Put code here that you want it to run every time when
	// navigate to view1 page and my-view1.js is loaded
	break;
    case 'view2':
	await import('../components/my-view2.js');
	break;
    case 'view3':
	await import('../components/my-view3.js');
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

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateLayout = (wide) => (dispatch, getState) => {
  if (getState().app.drawerOpened) {
    dispatch(updateDrawerState(false));
  }
}

export const updateDrawerState = (opened) => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
}
