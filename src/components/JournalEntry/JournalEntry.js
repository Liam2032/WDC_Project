import React, { Component } from 'react';

import './JournalEntry.css'

import { Card } from 'semantic-ui-react'
import './../../semantic/components/card.css'

import 'moment'

class JournalEntry extends Component {

  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e, pro) { 
    const { go, viewurl } = this.props
    go(viewurl)
  }

  render() {
    const { title, date, text } = this.props

    const formattedDate = date.format("dddd, MMMM Do YYYY")


    return (
      <div className="item-container">
        <Card onClick={this.handleClick}>
          <Card.Content>
            <Card.Header>{title}</Card.Header>
            <Card.Meta>{formattedDate}</Card.Meta>
            <Card.Description>{text}</Card.Description>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

export default JournalEntry;