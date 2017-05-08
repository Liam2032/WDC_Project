import * as types from './actions';
import { syncWithServer } from './sync.js';

function _authorise(token) {
  return {
    type: types.AUTHORISE,
    token: token
  };
}

export const authorise = (token) => {
  return function (dispatch) {
    dispatch(_authorise(token)) // put our token in the state
    dispatch(syncWithServer()) // put our token in the state
  };
}

export const deauthorise = () => {
  return {
    type: types.DEAUTHORISE
  };
}
