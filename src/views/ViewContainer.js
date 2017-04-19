import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import * as journalActions from '../actions/journal'
import JournalEntryDetail from './../components/JournalEntryDetail/JournalEntryDetail'

import { Button } from 'semantic-ui-react'
import './../semantic/components/button.css'


class ViewContainer extends Component {
  render() {

    const { entries, go, match } = this.props

    const id = parseInt(match.params.id, 10)

    // grabs the matching ones with a filter
    let entryList = entries.filter(function( obj ) {
      return obj.id === id;
    });

    // obviously IDs are unique so just grab it
    let entry = entryList[0]

    return (
      <div>
        <JournalEntryDetail title={entry.title} date={entry.date} text={entry.text} id={entry.id} key={entry.id}/>

        <div className="detail-go-back">
          <Button onClick={() => {go('/')}}>Go Back</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    entries: state.journal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    go: (where) => {dispatch(push(where))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);