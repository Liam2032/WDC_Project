import React, { Component } from 'react';
import { Button, Checkbox, Form, Segment } from 'semantic-ui-react'

import './../../semantic/components/form.css'
import './../../semantic/components/button.css'
import './../../semantic/components/segment.css'

import './Login.css'

import GoogleLogin from './../GoogleLogin/GoogleLogin'

class Login extends Component {
  res = (res) => {
    const { go, authorise } = this.props

    // Actually check that it succeeded
    if (res.accessToken) {
      authorise(res)
      go('/')
    }
  }

  render() {

    const { go } = this.props

    return (
      <div className="login">
        <Segment stacked clearing>
          <Form>
            <GoogleLogin
              clientId={'596455318063-8qffgligtrbjkju13pn4p2a8o4ce46ch.apps.googleusercontent.com'}
              onSuccess={this.res}
              onFailure={this.res}
              offline={false}
              tag="div"
              style={{}}
              scope="profile email https://www.googleapis.com/auth/calendar.readonly"
              responseType="authorization_code"
            >
              <Button color='green' className="LogButton" fluid>Login with Google</Button>
            </GoogleLogin>

          </Form>

          <div className="login-button-holder">
            <Button floated="left" onClick={() => {go('/')}}>Go Back</Button>
          </div>
           
         </Segment>

      </div>
    )
  }
}

export default Login;