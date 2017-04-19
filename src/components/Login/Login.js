import React, { Component } from 'react';
import { Button, Checkbox, Form, Segment } from 'semantic-ui-react'

import './../../semantic/components/form.css'
import './../../semantic/components/button.css'
import './../../semantic/components/segment.css'

import './Login.css'

class Login extends Component {
  render() {

    const { go } = this.props

    return (
      <div className="login">
        <Segment stacked clearing>
          <Form>
            <Form.Field>
              <label>Email</label>
              <input placeholder='email@gmail.com' fluid/>
            </Form.Field>
      
            <Form.Field>
              <label>Password</label>
              <input placeholder='password' fluid/>
            </Form.Field>
          </Form>

          <div className="login-button-holder">
            <Button floated="left" onClick={() => {go('/')}}>Go Back</Button>
            <Button floated="right" color='green' className="LogButton" onClick={() => {go('/')}}>Login</Button>
          </div>
           
         </Segment>

      </div>
    )
  }
}

export default Login;