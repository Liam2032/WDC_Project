import React, { Component } from 'react';
import { Input, Button, Form, TextArea, Grid, Segment } from 'semantic-ui-react'

import './../../semantic/components/segment.css'
import 'moment'

import './JournalEntryDetail.css'


class JournalEntryDetail extends Component {
  render() {
    const { title, date, text } = this.props

    const formattedDate = date.format("dddd, MMMM Do YYYY")

    
    return (
      <div className="detail">
        <Segment>
          <h2>{title}</h2>
          <h3>{formattedDate}</h3>
          <p>{text}</p>
        </Segment>
      </div>
    )
  }
}

export default JournalEntryDetail;