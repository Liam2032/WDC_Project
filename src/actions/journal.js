import * as types from './actions';

let globalID = new Date().valueOf();

export const addJournalEntry = (title, date, text, events) => {
  globalID = new Date().valueOf();
  return {
    type: types.ADD_JOURNAL_ENTRY,
    id: globalID,
    title: title, 
    date: date, 
    text: text,
    events: events
  };
}
