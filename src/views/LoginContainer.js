import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Login from './../components/Login/Login'

import { Button } from 'semantic-ui-react'
import './../semantic/components/button.css'

class LoginContainer extends Component {
  render() {

    const { go } = this.props

    return (
      <div>
        <Login go={go}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);