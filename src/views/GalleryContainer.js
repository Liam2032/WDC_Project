import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Gallery from './../components/Gallery/Gallery'
import Introduction from './../components/Introduction/Introduction'
import CalendarCard from './../components/CalendarCard/CalendarCard'
import JournalEntry from './../components/JournalEntry/JournalEntry'

import { Button } from 'semantic-ui-react'
import './../semantic/components/button.css'


class GalleryContainer extends Component {

  constructor(props) {
    super(props)

    this.onCalendarChange = this.onCalendarChange.bind(this)

    this.state = {
      filter: null
    }
  }

  onCalendarChange(value) {
    console.log(value)
  }

  render() {
    const { entries, go, loggedin } = this.props

    let loginButton = (  
      <div>
        <Button onClick={() => {go('/login')}} floated='right' color='blue'>Login</Button>
      </div>
    )

    // Filter the entries:
    // TODO

    // Build the cards for each entry
    let childElements = entries.map(function(entry){
      const viewurl = '/view/' + entry.id

      return (
        <JournalEntry title={entry.title} date={entry.date} text={entry.text} id={entry.id} key={entry.id} viewurl={viewurl} go={go}/>
      );
    });

    // If we haven't got any entries, stick the introduction on the top.
    if (entries.length === 0) {
      const introduction = <Introduction/>
      childElements.push(introduction)
    }

    // Add the calendar to the front
    const calendar = <CalendarCard onChange={this.onCalendarChange}/>
    childElements.unshift(calendar)
    
    // Login Button Logic
    if (loggedin) {
      loginButton = null
    }

    return (
      <div>
        <Gallery elements={childElements}/>

        <div className='gallery-buttons'>
          <Button onClick={() => {go('/add')}} floated='left' color='green'>Add New</Button>
        </div>
        {loginButton}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    entries: state.journal,
    loggedin: false
  };
}

function mapDispatchToProps(dispatch) {
  return {
    go: (where) => {dispatch(push(where))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GalleryContainer);