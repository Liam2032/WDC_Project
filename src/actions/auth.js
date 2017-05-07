import * as types from './actions';


function _authorise(token) {
  return {
    type: types.AUTHORISE,
    token: token
  };
}


const SERVER_URI = 'http://localhost:9000/api/journalentries/'

export const getEntries = (token) => {
  return fetch(SERVER_URI, { 
    method: 'get', 
    headers: {
      'Authorization': 'Bearer ' +  token
    }
  }).then((response) => {
    return response.json()
  })
}

/*
export const postEntries = (entries) => {
  return fetch(SERVER_URI, { 
    method: 'post', 
    headers: {
      'Authorization': 'Bearer ' +  token
    },
    body: JSON.stringify(entries)
  }).then((response) => {
    return response.json()
  })
}
*/

export const authorise = (token) => {
  return function (dispatch) {
    dispatch(_authorise(token)) // put our token in the state
    const tokenID = token['tokenId']
    getEntries(tokenID).then((jsn) => {
      console.log(jsn)
    })
  };
}

export const deauthorise = () => {
  return {
    type: types.DEAUTHORISE
  };
}
