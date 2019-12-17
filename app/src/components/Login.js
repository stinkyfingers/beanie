import React, { useContext, useState } from 'react';
import UserContext from '../UserContext';
import FamilyContext from '../FamilyContext';
import { login, register } from '../api';
import '../css/login.css';
import { Link } from 'react-router-dom';
import Error from './Error';

const Login = () => {
  const userState = useContext(UserContext);
  const familyState = useContext(FamilyContext);
  const [isNew, setNew] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const buttonText = isNew ? 'Create User' : 'Log In';
  const handleClick = async() => {
    try {
      const u = isNew ? await register(user) : await login(user)
      if (u.error) {
        setError(u.error);
        return;
      }
      localStorage.setItem('user', JSON.stringify(u));
      userState.setUser(u);
      familyState.setFamily(localStorage.getItem('family') || 'Beanie Babies');
    } catch (err) {
      setError(err);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    userState.setUser(null);
  }
  const handleChange = (e) => {
    setError(null);
    switch (e.target.name) {
      case 'username':
        setUser({...user, username: e.target.value});
        break;
      case 'password':
        setUser({...user, password: e.target.value});
        break;
    }
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
      <label className='login' htmlFor='username'>Username:
        <input type='text' name='username' className='login' onChange={handleChange}/>
      </label>
      <label className='login' htmlFor='password'>Password:
        <input type='password' name='password' className='login' onChange={handleChange}/>
      </label>
      {isNew ? emailElement : null}
      <div>
        <button className='login' onClick={handleClick}>{buttonText}</button>
      </div>
      <Link to='/password'>Forgot Password</Link>
      {error ? <Error msg={error} /> : null}
    </div>
  );

  return (
    <div className='login'>
      {userState.user ? logoutElement : loginElement}
    </div>
  );
}

export default Login;
