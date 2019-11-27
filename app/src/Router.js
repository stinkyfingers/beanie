import React from 'react';
import {
 Switch,
 Route,
 Link
} from 'react-router-dom'
import User from './components/User';
import Users from './components/Users';
import Password from './components/Password';

// Removed from App for now - seems redundant
export const Nav = () =>
  <div className='nav'>
    <nav>
      <Link to='/'>Main</Link>
    </nav>
    <nav>
      <Link to='/users'>Users</Link>
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
      <User />
    </Route>
  </Switch>;
