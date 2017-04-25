import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react'
import { Card, Icon } from 'semantic-ui-react'

import './../../semantic/components/card.css'
import './../../semantic/components/icon.css'
import './../../semantic/components/segment.css'

import moment from 'moment'

import './JournalEntryDetail.css'


class Event extends Component {
  render() {
    const { id, summary, location, start, description } = this.props

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


class JournalEntryDetail extends Component {
  render() {
    const { title, date, text, events } = this.props

    const formattedDate = date.format("dddd, MMMM Do YYYY")

    // events is an object so we can't use the usual map iterator, we have to iterate over the keys
    let eventItems = Object.keys(events).map((key, index) => {
      const event = events[key]
      return (
        <Event 
          id={event.id} 
          key={event.id}
          summary={event.summary} 
          location={event.location} 
          start={event.start} 
          description={event.description}
        />
      )
    });

    let eventHeader = null

    if (Object.keys(events).length > 0) {
      eventHeader = <h4>Google Events</h4>
    }

    return (
      <div className="detail">
        <Segment>
          <h2>{title}</h2>
          <h3>{formattedDate}</h3>
          <p>{text}</p>
          {eventHeader}
          {eventItems}
        </Segment>
      </div>
    )
  }
}

export default JournalEntryDetail;