import React from 'react';
import {
 Switch,
 Route,
 Link
} from 'react-router-dom'
import User from './components/User';
import All from './components/All';

// Removed from App for now - seems redundant
export const Nav = () =>
  <div>
    <nav>
      <Link to='/'>User</Link>
    </nav>
    <nav>
      <Link to='/beanies'>Beanies</Link>
    </nav>
  </div>;

export const Router = () =>
  <Switch>
    <Route path="/beanies">
      <All />
    </Route>
    <Route path="/">
      <User />
    </Route>
  </Switch>;
