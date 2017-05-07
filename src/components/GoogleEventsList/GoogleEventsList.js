import React, { Component } from 'react';
import { Card, Icon } from 'semantic-ui-react'

import './../../semantic/components/card.css'
import './../../semantic/components/icon.css'

import moment from 'moment'

import './GoogleEventsList.css'

import { Button } from 'semantic-ui-react'
import './../../semantic/components/button.css'

class Event extends Component {
  render() {
    const { id, summary, location, start, description,
            addEvent, removeEvent, included } = this.props

    const startMoment = moment(start).format('h:mm a') // We only want the time part

    const header = `${summary} - ${startMoment}` 

    let locationComponent = null
    let descriptionComponent = null
    let addRemoveComponent = null

    if (location) {
      locationComponent = ( 
        <Card.Content extra>
          <Icon name='location arrow' />
          {location}
        </Card.Content>
      )
    }

    if (description) {
      descriptionComponent = ( 
        <Card.Content description={description} />
      )
    }

    if (included) {
      addRemoveComponent = (
          <Card.Content extra>
            <Button 
              color='red' 
              floated='right' 
              size='mini' 
              onClick={() => {removeEvent(id)}}
            >
              Remove from Journal Entry
            </Button>
          </Card.Content>
        )
    } else {
      addRemoveComponent = (
          <Card.Content extra>
            <Button 
              color='green' 
              floated='right' 
              size='mini' 
              onClick={() => {addEvent({id, summary, location, start, description})}}
            >
              Add to Journal Entry
            </Button>
          </Card.Content>
        )
    }

    return (
      <Card key={id}>
        <Card.Content header={header} />
        {descriptionComponent}
        {locationComponent}
        {addRemoveComponent}
      </Card>
    )
  }
}


class GoogleEventsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      loading: true
    }
  }

  grabEvents = (auth, date) => {
    if (!auth || !date) {
      return
    }

    this.setState({
      loading: true
    })

    const momentCopy = moment(date)

    // Moment objects are changable, adding a day below will actually change the object, we don't want to do that.
    const searchStart = momentCopy.toISOString()
    const searchEnd = momentCopy.add(1, 'days').toISOString()

    let url = `https://www.googleapis.com/calendar/v3/calendars/${auth.profileObj.email}/events?fields=items(summary,id,location,start,description)&timeMin=${searchStart}&timeMax=${searchEnd}`

    fetch(url, { 
      method: 'get', 
      headers: {
        'Authorization': 'Bearer ' + auth.accessToken
      }
    }).then((response) => {
      return response.json()
    }).then((res) => {
      let events = []

      for (let event of res.items) {
        console.log(event)
        events.push(event)
      }

      this.setState({
        events: events,
        loading: false
      })

    }).catch((err) => {
      console.error(err)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.date !== nextProps.date || this.props.auth !== nextProps.auth) {
      this.grabEvents(nextProps.auth,nextProps.date)
    }
  }

  componentDidMount() {
    const { auth, date } = this.props
    this.grabEvents(auth,date)
  }

  render() {
    const { auth, date, addEvent, removeEvent, selected } = this.props
    const { events, loading } = this.state

    if (!auth || !date) {
      return null
    }

    if (loading) {
      return (
        <p>Loading Google Calendar</p>
      )
    }

    const eventItems = events.map((event) =>
      <Event 
        id={event.id} 
        key={event.id}
        summary={event.summary} 
        location={event.location} 
        start={event.start.dateTime} 
        description={event.description}
        addEvent={addEvent}
        removeEvent={removeEvent}
        included={selected.includes(event.id)}
      />
    );

    return (
      <div className="eventslist">
        <h3>Google Calendar Events</h3>
        {eventItems}
      </div>
    )
  }
}

export default GoogleEventsList;