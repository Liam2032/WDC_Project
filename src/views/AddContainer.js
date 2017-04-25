import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import * as journalActions from '../actions/journal'

import AddForm from './../components/AddForm/AddForm'


class AddContainer extends Component {
  render() {
    const { go, actions, auth } = this.props

    return (
      <div>
        <div>
          <AddForm create={actions.addJournalEntry} go={go} auth={auth}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    auth: state.auth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(journalActions, dispatch),
    go: (where) => {dispatch(push(where))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddContainer);
