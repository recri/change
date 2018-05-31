/**
@license
*/


export const CHANGE_UPDATE = 'CHANGE_UPDATE';

export const CHANGE_DIST = 'CHANGE_DIST';
export const CHANGE_CUSTOM = 'CHANGE_CUSTOM';
export const CHANGE_FORMAT = 'CHANGE_FORMAT';
export const CHANGE_PROTOCOL = 'CHANGE_PROTCOL';

export const changeUpdate = (change) => (dispatch) => dispatch({ type: CHANGE_UPDATE, change});

export const changeDist = (dist) => (dispatch) => dispatch({ type: CHANGE_DIST, dist});
export const changeCustom = (custom) => (dispatch) => dispatch({ type: CHANGE_CUSTOM, custom});
export const changeFormat = (format) => (dispatch) => dispatch({ type: CHANGE_FORMAT, format});
export const changeProtocol = (protocol) => (dispatch) => dispatch({ type: CHANGE_PROTOCOL, protocol});

