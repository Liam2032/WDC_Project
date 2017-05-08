import React, { Component } from 'react';
import './Layout.css';


class Layout extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <span id="title">WDC PROJECT</span>
        </header>
        <section className="container">
            {this.props.children}
        </section>
      </div>
    );
  }
}

export default Layout;