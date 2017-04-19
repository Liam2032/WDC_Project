import React, { Component } from 'react';

import './Introduction.css'

import { Card } from 'semantic-ui-react'
import './../../semantic/components/card.css'


class Introduction extends Component {
  render() {
    return (
      <div className="item-container introduction">
        <Card color='green'>
          <Card.Content>
            <Card.Header>Welcome!</Card.Header>
            <Card.Description>I'm Introduction Text! Click add new.</Card.Description>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

export default Introduction;