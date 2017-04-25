import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Login from './../components/Login/Login'
import { bindActionCreators } from 'redux'
import * as authActions from '../actions/auth'

class LoginContainer extends Component {
  render() {

    const { go, actions } = this.props

    return (
      <div>
        <Login authorise={actions.authorise} go={go}/>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch),
    go: (where) => {dispatch(push(where))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);