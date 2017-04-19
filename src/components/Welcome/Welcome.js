import React, { Component } from 'react';

import { Button } from 'semantic-ui-react'
import './../../semantic/components/button.css'

import './Welcome.css'

class Welcome extends Component {
  render() {

  	const { go } = this.props

  	return (
      	<div className="welcome">
        	<section id="header">

        		<h1>Google Calendar Journal</h1>
	
        		<h2>A WDC Project</h2>

        		<div>
          			<Button inverted basic color='white' className="welButton" onClick={() => {go('/gallery')}}>Begin</Button>
        		</div>
	
        	</section>
      	</div>

      	
    )
  }
}

export default Welcome;