# Authentication

We're using OAuth JWTs for authentication.

When unpacked on the server they look this:

```
{
 "azp": "...",
 "aud": "...",
 "sub": "...",
 "email": "...",
 "email_verified": "...",
 "at_hash": "...",
 "iss": "...",
 "iat": "...",
 "exp": "...",
 "name": "...",
 "picture": "...",
 "given_name": "...",
 "family_name": "...",
 "locale": "...",
 "alg": "...",
 "kid": "..."
}
```

- To verify the token we check that it's properly signed by Google using their public key.

- We check that the `aud` property is our Google app's client ID. (`596455318063-8qffgligtrbjkju13pn4p2a8o4ce46ch.apps.googleusercontent.com`, set in components -> Login.js)

- We check that the `iss` property is `accounts.google.com` (or the TLS version of that URI)

- We check the expiry time (`exp`) hasn't passed already.

We can then use the `sub` property as our unique identifier of the user. (We're not using the email since it isn't always verified)


# Database Schema

One table

- id - an autoincrementing INT.
- owner - a varchar, this is the `sub` property of the JWT.
- title - a string, the title
- date - a date, the day of the journal entry
- text - a text entry, the journal text
- events - a text entry, if there were a native JSON object that would be used. Contains all the data about the Google calendar events.


### Why is all the calendar data stored and not just the ID?

It's bad UX for someone to type something about a calendar event, then change the calendar event on the calendar side, and have what they wrote now mean nothing in context. Frequently people delete recurring events after they've been used, which would resort in that data going stale.

Additionally, the response time from the API is not very fast, performance is the best UX improvement someone can make.

# API Endpoints with our server


## GET /journalentries

Headers:

- `Authorisation: Bearer <OAuthTokenId>`

Response:

- JSON list of journal entries. 200 If there are any, 204 if there are none.

Journal Object Structure:

```
{
  id: INT,
  owner: VARCHAR,
  title: VARCHAR, 
  date: DATE, 
  text: TEXT,
  events: TEXT (JSON encoded)
}
```

The owner is the `sub` property of the JWT token.

### Why are the calendar events stored in the same table?

We don't need to search through the google calendar events separate from the journal entries. We filter clientside by the journal entries themselves - therefore we can JSON encode the events and store them in a single column in the database instead of a separate table with a foreignkey relationship to the journal entries.

## POST /journalentries

Headers:

- `Authorisation: Bearer <OAuthTokenId>`

Response:

- 201 if successful, a JSON encoded object mapping the temporary IDs to the new global ones. The client will replace the old IDs upon receiving this, allowing them to delete content. eg: 
`
{
  "tempid1": 4564,
  "tempid2": 4596,
  "tempid3": 4764
}
`

Body:

- JSON encoded list of journal entries to save, same structure as above.

## DELETE /journalentries/$id


Headers:

- `Authorisation: Bearer <OAuthTokenId>`

Processing:

- Check that the id provided is owned by the `sub` in the token provided.

Response:

- 204 if successful


# Regular HTTP handling for our content


## GET /*

Express pushes the static files from the build folder regardless of route (routing is handled on the client).


# API interactions with Google Calendar

## GET Calendar Events

Currently we only support the default calendar, defined by the email associated with the google account.

Headers:

- `Authorisation: Bearer <OAuthAccessToken>`

Query variables:

- `/<email>/` - default email associated with the google account
- `fields=...` - the content we want 
- `timeMin=<searchStart>` - the day you're looking for
- `timeMax=<searchEnd>` - the day after, since it's exclusive

Url Structure: `https://www.googleapis.com/calendar/v3/calendars/<email>/events?fields=items(summary,id,location,start,description)&timeMin=<searchStart>&timeMax=<searchEnd>`

The response is a JSON list of events in this structure:

```
{
  id,
  summary,
  location,
  description,
  start: {
    dateTime
  }
}
```

All strings except the dateTime.