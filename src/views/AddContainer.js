import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import * as journalActions from '../actions/journal'

import AddForm from './../components/AddForm/AddForm'
import { Button } from 'semantic-ui-react'
import './../semantic/components/button.css'


class AddContainer extends Component {
  render() {
    const { go, actions } = this.props

    return (
      <div>
        <div>
          <AddForm create={actions.addJournalEntry} go={go}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(journalActions, dispatch),
    go: (where) => {dispatch(push(where))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddContainer);
