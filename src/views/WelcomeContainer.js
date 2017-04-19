import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Welcome from './../components/Welcome/Welcome'

import { Button } from 'semantic-ui-react'
import './../semantic/components/button.css'


class WelcomeContainer extends Component {
  render() {

    const { go } = this.props

    return (
      <div>
        
        {/* Passing down go to the child */}
        <Welcome go={go}/>

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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeContainer);