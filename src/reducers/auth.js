import * as types from '../actions/actions';

export default (state = null, action) => {
  switch (action.type) {
    case types.AUTHORISE:
      return action.token;
    case types.DEAUTHORISE:
      return null;
    default:
      return state;
  }
};