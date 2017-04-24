import journal from './journal.js';
import auth from './auth.js';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  journal,
  auth,
  router: routerReducer
});

export default rootReducer;
