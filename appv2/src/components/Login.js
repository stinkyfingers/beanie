import React, { useContext, useState } from 'react';
import { login, register } from '../api';
import Context from '../Context';
import { Link } from 'react-router-dom';
import Error from './Error';

const Login = ({ handleForgotPassword }) => {
  const { state, setState } = useContext(Context);
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
      setState({ ...state, user: u, family: localStorage.getItem('family') || 'Beanie Babies' })
    } catch (err) {
      setError(err);
    }
  };

  const handleChange = (e) => {
    setError(null);
    switch (e.target.name) {
      case 'username':
        setUser({...user, username: e.target.value});
        break;
      case 'password':
        setUser({...user, password: e.target.value});
        break;
      default:
    }
  };

  const emailElement = (
    <label className='login' htmlFor='email'>Email:
      <input type='text' name='email' className='login' onChange={(e) => setUser({...user, email: e.target.value})}/>
    </label>);

  return <div className='login'>
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
    <div className='link'>
      <a className='login' onClick={() => setNew(!isNew)}>{isNew ? 'Back To Login' : 'Register New User'}</a>
    </div>
    <div className='link'>
      <a onClick={handleForgotPassword}>Forgot Password</a>
    </div>
    {error ? <Error msg={error} /> : null}
  </div>;
}

export default Login;
