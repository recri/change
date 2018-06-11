/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

import {
    BOOK_REQUEST, BOOK_RECEIVE
} from '../actions/books.js';

import { store } from '../store.js';

const books = (state = { 
    			// books which are already available
}, action) => {
    switch (action.type) {
    case BOOK_REQUEST: 
	// console.log(`books(..., { ${action.type}, ${action.book} })`);
	return { ...state, [action.book]: { book: action.book, isFetching: true }};
    case BOOK_RECEIVE: 
	// console.log(`books(..., { ${action.type}, ${action.book}, ${action.module ? 'obj' : '???' }})`);
	return { ...state, [action.book]: { ...state[action.book], isFetching: false, module: action.module }};
    default: 
	return state;
    }
}

export default books;
