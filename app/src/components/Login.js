import React, { useContext, useState } from 'react';
import UserContext from '../UserContext';
import { login } from '../api';

const Login = () => {
  const userState = useContext(UserContext);
  const [isNew, setNew] = useState(false);
  const [user, setUser] = useState(null);
  const buttonText = isNew ? 'Create User' : 'Log In';
  const handleClick = async() => {
    try {
      const u = await login(user);
      localStorage.setItem('user', JSON.stringify(u));
      userState.setUser(u);
    } catch (err) {
      console.warn(err) // TODO
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    userState.setUser(null);
  }
  const logoutElement = (<div><button onClick={handleLogout}>Log Out</button></div>);
  const loginElement = (<div>
      <button onClick={() => setNew(!isNew)}>{isNew ? 'Switch to login' : 'Register new user'}</button>
      <label htmlFor='name'>Username:
        <input type='text' name='name'  onChange={(e) => setUser({...user, username: e.target.value})}/>
      </label>
      <label htmlFor='password'>Password:
        <input type='password' name='password'  onChange={(e) => setUser({...user, password: e.target.value})}/>
      </label>
      <button onClick={handleClick}>{buttonText}</button>
    </div>
  );

  return (
    <div>
      {userState.user ? logoutElement : loginElement}
    </div>
  );
}

export default Login;
