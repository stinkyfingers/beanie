import React from 'react';
import {
 Switch,
 Route,
 Link
} from 'react-router-dom'
import User from './components/User';
import All from './components/All';

export const Nav = () =>
  <div>
    <nav>
      <Link to='/user'>User</Link>
    </nav>
    <nav>
      <Link to='/beanies'>Beanies</Link>
    </nav>
  </div>;

export const Router = () =>
  <Switch>
    <Route path="/user">
      <User />
    </Route>
    <Route path="/beanies">
      <All />
    </Route>
  </Switch>;
