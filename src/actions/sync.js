import { reIDJournalEntry, addJournalEntry, deleteJournalEntry } from './journal.js';

const SERVER_URI = 'http://localhost:9000/api/journalentries/' // notice the slash

// all the functions here are asynchronous thunks
// https://github.com/gaearon/redux-thunk

import moment from 'moment';

export const getEntries = () => {
  return function (dispatch, getState) {
    const { auth } = getState();

    const token = auth['tokenId']

    // return a promise
    return fetch(SERVER_URI, { 
      method: 'get', 
      headers: {
        'Authorization': 'Bearer ' +  token,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      // this is the return in the lambda function not for the outer function 
      return response.json() // UNSERIALISING 
    }).then((response) => {
      for (let entry of response) {
        console.log('server replied', entry)
        dispatch(addJournalEntry(entry.title, moment(entry.date), entry.text, entry.events, entry.id, true))
      }
    })
  };
}

export const postEntries = (entries) => {
  return function (dispatch, getState) {
    const { auth } = getState();

    const token = auth['tokenId']

    // return a promise
    return fetch(SERVER_URI, { 
      method: 'post', 
      headers: {
        'Authorization': 'Bearer ' +  token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entries)
    }).then((response) => {
      // extract json out of the response
      return response.json()
    }).then((response) => {
      // reID each
      for (let tempID of Object.keys(response)) {
        console.log(tempID, ':', response[tempID])
        // dispatch the action to reID
        dispatch(reIDJournalEntry(tempID, response[tempID]))
      }
    })
  };
}

export const syncWithServer = () => {
  return function (dispatch, getState) {
    const { journal } = getState();

    let journalEntriesToSync = []

    // find the journal entries that haven't been saved to the server yet
    for (let entry of journal) {
      if (!entry.hasGlobalID) { // if it hasn't already been synced, send it up
        journalEntriesToSync.push(entry)
      }
    }

    // get any entries
    dispatch(getEntries()).then(() => {
      // then send up our ones
      if (journalEntriesToSync.length > 0) {
        dispatch(postEntries(journalEntriesToSync))
      }
    })
    // this avoids a race condition where we're adding ones, then getting them back, then also getting back an ID reassignment, resulting in two copies
  };
}

export const addAndSaveJournalEntry = (title, date, text, events) => {
  return function (dispatch, getState) {
    const { auth } = getState();

    let tempID = new Date().valueOf();

    // if we're authenticated
    if (auth) {
      const token = auth['tokenId']
      // post the array of the single object containing our entry
      dispatch(postEntries([{
        id: tempID,
        title: title, 
        date: date, 
        text: text,
        events: events,
        hasGlobalID: false
      }]))
    }
    
    dispatch(addJournalEntry(title, date, text, events, tempID, false))
  };
}

export const deleteEntry = (id) => {
  return function (dispatch, getState) {
    const { auth } = getState();

    let tempID = new Date().valueOf();

    // if we're authenticated
    if (auth) {
      const token = auth['tokenId']
      // delete the object on the server
      fetch(SERVER_URI + id, { // SERVER_URI has a slash on the end so we can just concatenate
        method: 'delete', 
        headers: {
          'Authorization': 'Bearer ' +  token,
          'Content-Type': 'application/json'
        }
      })
    }

    // delete it clientside
    dispatch(deleteJournalEntry(id))
  };
}