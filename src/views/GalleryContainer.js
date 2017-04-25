import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Gallery from './../components/Gallery/Gallery'
import Introduction from './../components/Introduction/Introduction'
import CalendarCard from './../components/CalendarCard/CalendarCard'
import JournalEntry from './../components/JournalEntry/JournalEntry'

import { bindActionCreators } from 'redux'
import * as authActions from '../actions/auth'

import { Button } from 'semantic-ui-react'
import './../semantic/components/button.css'

import moment from 'moment'

class GalleryContainer extends Component {

  constructor(props) {
    super(props)

    this.onCalendarChange = this.onCalendarChange.bind(this)

    this.state = {
      filter: null
    }
  }

  onCalendarChange(value) {
    this.setState({filter: value})
  }

  render() {
    const { entries, go, authed, actions } = this.props
    const { filter } = this.state

    // Filter the entries:
    // TODO

    // Build the cards for each entry
    let childElements = entries.map(function(entry){
      const viewurl = '/view/' + entry.id

      if (filter) {
        console.log(Math.abs(entry.date.diff(filter, 'hours')))
        if (Math.abs(entry.date.diff(filter, 'hours')) > 20) { // since timezone stuff makes this fuzzy
          return
        }
      }

      return (
        <JournalEntry title={entry.title} date={entry.date} text={entry.text} id={entry.id} key={entry.id} viewurl={viewurl} go={go}/>
      );
    });

    // If we haven't got any entries, stick the introduction on the top.
    if (entries.length === 0) {
      const introduction = <Introduction key="intro"/>
      childElements.push(introduction)
    }

    // Add the calendar to the front
    const calendar = <CalendarCard onChange={this.onCalendarChange} key="calendar"/>
    childElements.unshift(calendar)
    
    let loginButton = (  
      <div>
        <Button onClick={() => {go('/login')}} floated='right' color='blue'>Login</Button>
      </div>
    )

    // Login Button Logic
    if (authed) {
      loginButton = (  
        <div>
          <Button onClick={() => {actions.deauthorise()}} floated='right' color='grey'>Logout</Button>
        </div>
      )
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
    authed: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch),
    go: (where) => {dispatch(push(where))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GalleryContainer);