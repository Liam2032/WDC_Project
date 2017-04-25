import React, { Component } from 'react'
import Calendar from 'rc-calendar'

import './CalendarCard.css'
import 'rc-calendar/assets/index.css';

  
class CalendarCard extends Component {
  render() {
    const { onChange } = this.props
    return (
      <div className="item-container">
        <Calendar 
          onChange={onChange}
          onSelect={onChange}
          />
      </div>
    )
  }
}

export default CalendarCard;