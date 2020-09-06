import React from 'react';
import { Route, IndexRoute } from 'react-router';

/**
 * Import all page components here
 */
import App from './components/App';
import Main from './components/main';
import TourPage from './components/tourpage';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path='./components/tourpage' component={TourPage} />
  </Route>
);