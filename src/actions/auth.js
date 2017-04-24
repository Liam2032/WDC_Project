import * as types from './actions';

export const authorise = (token) => {
  return {
    type: types.AUTHORISE,
    token: token
  };
}

export const deauthorise = () => {
  return {
    type: types.DEAUTHORISE
  };
}
