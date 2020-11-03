import React, { useState } from 'react';
import { resetPassword } from '../api';
import Error from './Error';

const Password = ({ handleBackToLogin }) => {
  const [username, setUsername] = useState(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState();

  const handleClick = async() => {
    return resetPassword({ username })
      .catch(err => setError(err))
      .finally(() => setSent(true));
  };

  if (error) return <Error msg={error} />;

  return (
    <div className='password'>
      <label className='password' htmlFor='email'>Username:
        <input type='text' name='username' className='username' onChange={(e) => setUsername(e.target.value)}/>
      </label>
      <button onClick={handleClick}>Submit</button>
      {sent ? <div className='sent'>Sent</div> : null}
      <div className='link'>
        <a onClick={handleBackToLogin}>Back To Login</a>
      </div>
    </div>
  );
};

export default Password;
