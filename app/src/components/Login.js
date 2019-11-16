import React, { useContext, useState } from 'react';
import UserContext from '../UserContext';
import { login, register } from '../api';
import '../css/login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const userState = useContext(UserContext);
  const [isNew, setNew] = useState(false);
  const [user, setUser] = useState(null);
  const buttonText = isNew ? 'Create User' : 'Log In';
  const handleClick = async() => {
    try {
      const u = isNew ? await register(user) : await login(user);
      localStorage.setItem('user', JSON.stringify(u));
      if (u.error) {
        console.warn(u.error);
        return;
      }
      userState.setUser(u);
    } catch (err) {
      console.warn(err) // TODO
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    userState.setUser(null);
  }
  const logoutElement = (<div><button  className='login' onClick={handleLogout}>Log Out</button></div>);
  const emailElement = (
    <label className='login' htmlFor='email'>Email:
      <input type='text' name='email' className='login' onChange={(e) => setUser({...user, email: e.target.value})}/>
    </label>);

  const loginElement = (<div>
      <div>
        <button className='login' onClick={() => setNew(!isNew)}>{isNew ? 'Switch to login' : 'Register new user'}</button>
      </div>
      <label className='login' htmlFor='name'>Username:
        <input type='text' name='name' className='login' onChange={(e) => setUser({...user, username: e.target.value})}/>
      </label>
      <label className='login' htmlFor='password'>Password:
        <input type='password' name='password' className='login' onChange={(e) => setUser({...user, password: e.target.value})}/>
      </label>
      {isNew ? emailElement : null}
      <div>
        <button className='login' onClick={handleClick}>{buttonText}</button>
      </div>
      <Link to='/password'>Forgot Password</Link>
    </div>
  );

  return (
    <div className='login'>
      {userState.user ? logoutElement : loginElement}
    </div>
  );
}

export default Login;
