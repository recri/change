/**
@license
*/


export const CHANGE_UPDATE = 'CHANGE_UPDATE';
export const CHANGE_DIST = 'CHANGE_DIST';
export const CHANGE_CUSTOM = 'CHANGE_CUSTOM';
export const CHANGE_FORMAT = 'CHANGE_FORMAT';
export const CHANGE_PROTOCOL = 'CHANGE_PROTCOL';
export const CHANGE_BOOK = 'CHANGE_BOOK';

export const changeUpdate = (change) => (dispatch) => dispatch({ type: CHANGE_UPDATE, change });
export const changeDist = (dist) => (dispatch) => dispatch({ type: CHANGE_DIST, dist });
export const changeCustom = (custom) => (dispatch) => dispatch({ type: CHANGE_CUSTOM, custom });
export const changeFormat = (format) => (dispatch) => dispatch({ type: CHANGE_FORMAT, format });
export const changeProtocol = (protocol) => (dispatch) => dispatch({ type: CHANGE_PROTOCOL, protocol });

export const changeBook = (book) => async (dispatch, getState) => {
    const iching = getState().change.iching;
    var module = null;
    switch(book) {
    case 'wilhelm': 
	module = await import('../text/wilhelm.js');
	break;
    case 'wilhelm-baynes':
	module = await import('../text/wilhelm-baynes.js');
	break;
    case 'wilhelm-google':
	module = await import('../text/wilhelm-google.js');
	break;
	/*
	  case 'legge':
	  module = await import('../text/legge.js');
	  break;
	  case 'yizhou':
	  module = await import('../text/yizhou.js'); 
	  break;
	*/
    default:
	console.log(`unknown book requested ${book}`);
	module = await import('../text/wilhelm-google.js');
	break;
    }
    iching.setBookObj(book, module.ChangesText);
    dispatch({ type: CHANGE_BOOK, book });
}

