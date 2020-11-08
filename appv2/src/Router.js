import React from 'react';
import {
 Switch,
 Route
} from 'react-router-dom'
import Dashboard from './components/Dashboard';
// import Users from './components/Users';
import Password from './components/Password';

const Router = () =>
  <Switch>
    <Route path="/password">
      <Password />
    </Route>
    <Route path="/">
      <Dashboard />
    </Route>
  </Switch>;

export default Router;
