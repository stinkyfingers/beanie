import React from 'react';
import {
 Switch,
 Route,
 Link
} from 'react-router-dom'
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Password from './components/Password';

// Removed from App for now - seems redundant
export const Nav = () =>
  <div className='nav'>
    <nav>
      <Link className='link' to='/'>Main</Link>
    </nav>
    <nav>
      <Link className='link' to='/users'>Users</Link>
    </nav>
  </div>;

export const Router = () =>
  <Switch>
    <Route path="/users">
      <Users />
    </Route>
    <Route path="/password">
      <Password />
    </Route>
    <Route path="/">
      <Dashboard />
    </Route>
  </Switch>;
