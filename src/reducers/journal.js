import * as types from '../actions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case types.ADD_JOURNAL_ENTRY:
      return [...state, Object.assign({}, {
        id: action.id,
        title: action.title, 
        date: action.date, 
        text: action.text,
        events: action.events
      })];
    default:
      return state;
  }
};