import React, { Component } from 'react';
import './Layout.css';


class Layout extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <span id="title">WDC Project </span>
            {/*<nav>
                <input type="text" id="Search" enabled/>}
            </nav>*/}
        </header>
        <section className="container">
            {this.props.children}
        </section>
      </div>
    );
  }
}

export default Layout;