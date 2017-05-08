import * as types from './actions';

export const addJournalEntry = (title, date, text, events, id, globalID) => {
  return {
    type: types.ADD_JOURNAL_ENTRY,
    id: id,
    title: title, 
    date: date, 
    text: text,
    events: events,
    hasGlobalID: globalID ? true : false
  };
}

export const reIDJournalEntry = (tempID, globalID) => {
  return {
    type: types.REID_JOURNAL_ENTRY,
    tempID: tempID,
    globalID: globalID
  };
}

export const deleteJournalEntry = (id) => {
  return {
    type: types.DELETE_JOURNAL_ENTRY,
    id: id
  };
}
