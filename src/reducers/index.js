import journal from './journal.js';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  journal,
  router: routerReducer
});

export default rootReducer;
