/**
@license
*/

export const BOOK_REQUEST = 'BOOK_REQUEST';
export const BOOK_RECEIVE = 'BOOK_RECEIVE';

import { didChangeBook } from '../actions/change.js';

const receiveBook = (book, object) => (dispatch, getState) => {
    dispatch({ type: BOOK_RECEIVE, book, object });
    if (object) {
	getState().change.iching.setBookObj(book, object);
	dispatch(didChangeBook(book));
    }
}

const requestBook = (book) => (dispatch) => {
    dispatch({ type: BOOK_REQUEST, book });
}

const fetchBook = (book) => async (dispatch, getState) => {
    // console.log(`fetchBook(${book})`);
    dispatch(requestBook(book))
    var module = null;
    switch (book) {
    case 'wilhelm':
	module = await import('../text/wilhelm.js');
	break;
    case 'wilhelm-baynes':
	module = await import('../text/wilhelm-baynes.js');
	break;
    case 'wilhelm-google':
	module = await import('../text/wilhelm-google.js');
	break;
    case 'legge':
	module = await import('../text/legge.js');
	break;
    case 'yizhou':
	module = await import('../text/yizhou.js');
	break;
    default:
	console.log(`unknown book in fetchBook(${book})`);
    }
    if (module) {
	// console.log(`fetchBook got module = ${module ? 'mod' : '???'}`);
	dispatch(receiveBook(book, module.ChangesText));
    } else {
	dispatch(receiveBook(book, null));
    }
}

const shouldFetchBook = (state, book) => {
    // console.log(`shouldFetchBook(${state}, ${book})`);
    if ( ! state[book]) return true;
    if (state[book].isFetching) return false;
    if ( ! state[book].object) return true;
    return false;
}

export const fetchBookIfNeeded = (book) => (dispatch, getState) => {
    // console.log(`fetchBookIfNeeded(${book})`);
    if (shouldFetchBook(getState().books, book)) {
	// Dispatch a thunk from thunk!
	return dispatch(fetchBook(book))
    } else {
	// Let the calling code know there's nothing to wait for.
	return Promise.resolve()
    }
}
