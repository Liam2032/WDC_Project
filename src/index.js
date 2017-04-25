// React
import React from 'react';
import ReactDOM from 'react-dom';

// Global page css, layout
import './index.css';
import Layout from './layout/Layout';

// Redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

// The state machine
import rootReducer from './reducers';

// Routing components
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'

// Views
import GalleryContainer from './views/GalleryContainer'
import AddContainer from './views/AddContainer'
import ViewContainer from './views/ViewContainer'
import LoginContainer from './views/LoginContainer'

// Create a browser history
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  rootReducer,
  applyMiddleware(middleware)
)

// Render the application in the layout according to the url route
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Layout>
        <Route exact path="/" component={GalleryContainer}/>
        <Route path="/add" component={AddContainer}/>
        <Route path="/view/:id" component={ViewContainer}/>
        <Route path="/login" component={LoginContainer}/>
      </Layout>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);