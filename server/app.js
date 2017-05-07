import express from 'express';
import morgan from 'morgan';
import path from 'path';
import GoogleAuth from 'google-auth-library';
import bodyParser from 'body-parser';


const auth = new GoogleAuth;

const CLIENT_ID = "596455318063-8qffgligtrbjkju13pn4p2a8o4ce46ch.apps.googleusercontent.com";
const client = new auth.OAuth2(CLIENT_ID, '', '');

const app = express();

// We're just sending json back and forth so automatically parse the body of requests
app.use(bodyParser.json());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets produced by the build step
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// enable cors for testing, be sure to remove this later
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.options("*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

// We catch api routes here to authenticate
app.all('/api/*', function(req, res, next){
  let token = false

  // Check that there's an authorisation
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  // they have to send their token to interact with the api
  if (!token) {
    res.sendStatus(403);
    return
  }

  // verify the token
  client.verifyIdToken(
    token,
    CLIENT_ID,
    (e, login) => {
      if (e) { // Expiry is automatically checked, and an error will be thrown if it has expired
        res.sendStatus(403);
        return
      }

      var payload = login.getPayload();

      // They've submitted a token with another google app
      if (payload['aud'] !== CLIENT_ID) { 
        res.sendStatus(403);
        return
      }

      // They've submitted a token signed by not google
      if (payload['iss'] !== 'accounts.google.com') { 
        res.sendStatus(403);
        return
      }

      // Set the user property of the request to their Google ID
      req.user = payload['sub'];
      next(); // callback back, send it on to the route
    });
});

// pretend to be a database

let hashMap = {} // Hashmaps are O(1), lets pretend like this is how databases work
let globalID = 0

function getAutoID() {
  return globalID++
}


function getUserEntries(userID) {
  return hashMap[userID] || [] // if they don't have any entries return an empty array
}


function addJournalEntry(userID, journal) {
  // Check that they have an array to add to
  if (!hashMap[userID]) {
    hashMap[userID] = []
  }

  // grab a global id and throw it into the journal entry
  const newJournal = Object.assign({}, journal, {globalID: getAutoID()})

  // remove the temp id
  delete newJournal['tempid']

  // add it to the array
  hashMap[userID].push(newJournal)

  // return the global id
  return newJournal.globalID
}


function deleteJournalEntry(userid, journalID) {
  if (!hashMap[userid]) {
    return false // couldn't delete it
  }

  // iterate through and delete it
  for(var i = 0; i < hashMap[userid].length; i++) {
    if(hashMap[userid][i].globalID == journalID) {
      hashMap[userid].splice(i, 1);
      return true; // found and deleted
    }
  }

  return false // couldn't find it
}


// Getting entries
app.get('/api/journalentries', (req, res) => {
  console.log('Getting Journal Entries');
  res.json(getUserEntries(req.user));
});


// Posting an entry
app.post('/api/journalentries', (req, res) => {
  // The body should be an array of entries
  if (!Array.isArray(req.body)) {
    console.log(req.body)
    res.sendStatus(422)
    return
  }

  let tempToGlobal = {};

  for (let entry of req.body) {
    if (!entry.tempid) {
      res.sendStatus(422); // entries must have a temporary ID so we can change it, so we can delete the entry later
      return
    }
    // add the entry and grab the new ID
    const globalID = addJournalEntry(req.user, entry);
    tempToGlobal[entry.tempid] = globalID;
  }

  // give them the map of old IDs to new
  res.json(tempToGlobal)
});


// Deleting an entry 
app.delete('/api/journalentries/:id', (req, res) => {
  console.log('Deleting Journal Entry');
  const id = req.params['id'] // pull out the id from the params
  
  if (deleteJournalEntry(req.user, id)) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});


// Otherwise return the main index.html, react-router will render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

export default app