import express from 'express'
import morgan from 'morgan'
import path from 'path'
import GoogleAuth from 'google-auth-library'
import bodyParser from 'body-parser'

import { config } from 'dotenv'
import { Sequelize } from 'sequelize'

// Execute the dotenv config to grab the database credentials
config()

// Setup the ORM to the database, read out of the .env file

// Obviouslly you need to create the mariadb database server and
// database, and username and password before you can use this.
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
)

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

// Setup database schema
// Under the hood this is running
/*
CREATE TABLE `journalentries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `events` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
*/
// the first time this server is booted with a db

const JournalEntry = sequelize.define(
  'journalentry',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    owner: { type: Sequelize.STRING, allowNull: false },
    title: { type: Sequelize.STRING, allowNull: false },
    date: { type: Sequelize.STRING, allowNull: false },
    text: { type: Sequelize.TEXT, allowNull: false },
    events: { type: Sequelize.TEXT, allowNull: false } /* JSON */
  },
  { timestamps: false } // We don't need timestamps added
)

// Perform migrations
sequelize
  .sync()
  .then(() => {
    console.log('Migrations completed successfully.')
  })
  .catch(err => {
    console.error('Unable to migratrate the database:', err)
  })

// Setup the Google Auth library
const auth = new GoogleAuth()

const CLIENT_ID =
  '596455318063-8qffgligtrbjkju13pn4p2a8o4ce46ch.apps.googleusercontent.com'
const client = new auth.OAuth2(CLIENT_ID, '', '')

const app = express()

// We're just sending json back and forth so automatically parse the body of requests
app.use(bodyParser.json())

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
)

// Serve static assets produced by the build step
app.use(express.static(path.resolve(__dirname, '..', 'build')))

// enable cors for testing, be sure to remove this later
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.options('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  )
  res.sendStatus(200)
})

// For fun, before authentication
app.get('/api/teapot', (req, res) => {
  res.sendStatus(418)
})

// We catch api routes here to authenticate
app.all('/api/*', function(req, res, next) {
  let token = false

  // Check that there's an authorisation
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1]
    }
  }

  // they have to send their token to interact with the api
  if (!token) {
    res.sendStatus(403)
    return
  }

  // verify the token
  client.verifyIdToken(token, CLIENT_ID, (e, login) => {
    if (e) {
      // Expiry is automatically checked, and an error will be thrown if it has expired
      res.sendStatus(403)
      return
    }

    var payload = login.getPayload()

    // They've submitted a token with another google app
    if (payload['aud'] !== CLIENT_ID) {
      res.sendStatus(403)
      return
    }

    // They've submitted a token signed by not google
    if (payload['iss'] !== 'accounts.google.com') {
      res.sendStatus(403)
      return
    }

    // Set the user property of the request to their Google ID
    req.user = payload['sub']
    next() // callback back, send it on to the route
  })
})

// Under the hood this is executing this:

// SELECT `id`, `owner`, `title`, `date`, `text`, `events`,
// FROM `journalentries` AS `journalentry`
// WHERE `journalentry`.`owner` = 'userID';
// JournalEntry SHOWN in 58 - 74
function getUserEntries(userID) {
  return JournalEntry.findAll({ //~~ FROM.SELECT
    where: {  //~~ WHERE
      owner: userID
    }
  }).then(entries => {
    let unserialisedEntries = []

    for (let entry of entries) {
      let entryWithSerialisedEvents = entry.get()
      let newObject = Object.assign({}, entryWithSerialisedEvents, {
        events: JSON.parse(entryWithSerialisedEvents.events)
      })
      unserialisedEntries.push(newObject)
    }

    return unserialisedEntries
  })
}

// this will execute something like this:
// INSERT INTO `journalentries` (`id`,`owner`,`title`,`date`,`text`,`events`)
// VALUES (DEFAULT,'userID','adf', '2017-05-26T09:22:15.528Z','sadfgsdfg','{}');
function addJournalEntry(userID, journal) {
  return JournalEntry.create({
    owner: userID,
    title: journal.title,
    date: journal.date,
    text: journal.text,
    events: JSON.stringify(journal.events)
  }).then(entry => {
    return entry.get('id') // pass the ID back
  })
}

// DELETE FROM `journalentries` WHERE `owner` = 'userID' AND `id` = 'whatever'
function deleteJournalEntry(userid, journalID) {
  return JournalEntry.destroy({
    where: {
      owner: userid,
      id: journalID
    }
  }).then(count => {
    // return true if it deleted one record, false if it deleted none
    return count == 1
  })
}

// Getting entries
app.get('/api/journalentries', async (req, res) => {
  const entries = await getUserEntries(req.user)

  res.json(entries)
})

// Posting an entry
app.post('/api/journalentries', async (req, res) => {
  // The body should be an array of entries
  if (!Array.isArray(req.body)) {
    console.error('not an array', req.body)
    res.sendStatus(422)
    return
  }

  let tempToGlobal = {}

  for (let entry of req.body) {
    if (entry.id && entry.hasGlobalID) {
      continue // this isn't illegal so just continue
    }

    if (!entry.id) {
      console.error(
        'entries must have an ID so we can change it',
        entry.id,
        req.body
      )
      res.sendStatus(422) // entries must have an ID so we can change it, so we can delete the entry later
      return
    }
    // add the entry and grab the new ID
    const globalID = await addJournalEntry(req.user, entry)

    tempToGlobal[entry.id] = globalID
  }

  // give them the map of old IDs to new
  res.json(tempToGlobal)
})

// Deleting an entry
app.delete('/api/journalentries/:id', async (req, res) => {
  const id = req.params['id'] // pull out the id from the params

  const deleted = await deleteJournalEntry(req.user, id)
  if (deleted) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})

// Otherwise return the main index.html, react-router will render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

export default app
