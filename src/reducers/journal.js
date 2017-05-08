import * as types from '../actions/actions';

export default (state = [], action) => {
  let newState
  switch (action.type) {
    case types.ADD_JOURNAL_ENTRY:

      // if it's a global ID, just do a sanity check to make sure we haven't already downloaded it
      // (for example if we logged out then in again this might occur)
      if (action.hasGlobalID) {
        for(let i = 0; i < state.length; i++) {
          if(state[i].id == action.id && state[i].hasGlobalID) { // we found one with a matching ID and its a global id
            return state // no need to add it, just continue through the state machine
          }
        }
      }

      // we couldn't find the global id, so add it
      return [...state, Object.assign({}, {
        id: action.id,
        title: action.title, 
        date: action.date, 
        text: action.text,
        events: action.events,
        hasGlobalID: action.hasGlobalID
      })];
    case types.REID_JOURNAL_ENTRY: // the server has accepted our posted journal entry, we need to reID it
      newState = state.slice(); // copy the array

      let journalEntry
        for(let i = 0; i < state.length; i++) {
          if(newState[i].id == action.tempID) { // find the journal entry with this tempID
            journalEntry = Object.assign({}, newState[i]) // copy the journal entry
            newState.splice(i, 1); // remove it from the newState array
            
            // and add it back 
            return [...newState, Object.assign({}, {
              id: action.globalID, // replace the globalID
              title: journalEntry.title, 
              date: journalEntry.date, 
              text: journalEntry.text,
              events: journalEntry.events,
              hasGlobalID: true
            })];
          }
        }

      // this should never happen - couldn't find the tempID
      return state 
    case types.DELETE_JOURNAL_ENTRY:
      newState = state.slice(); // copy the array so we're not mutating
      for(let i = 0; i < newState.length; i++) {
        if(newState[i].id == action.id) { // find the journal entry with this ID
          newState.splice(i, 1);
          return newState; // found and deleted, return the state and stop iterating
        }
      }
      // if we reach here the ID has already been deleted, just return the state
      return state
    case types.DEAUTHORISE: // if we log out, clear the data on the page
      return []
    default:
      return state;
  }
};