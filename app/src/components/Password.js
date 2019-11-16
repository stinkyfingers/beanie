import React, {useState} from 'react';
import { resetPassword } from '../api';
import { Link } from 'react-router-dom';

const Password = () => {
  const [username, setUsername] = useState(null);
  const [sent, setSent] = useState(false);

  const handleClick = async() => {
    try {
    await resetPassword({username});
      setSent(true);
    } catch (err) {
      console.warn(err); //TODO
    }
  };


  return (
    <div className='passwordReset'>
      <h3>Password Reset</h3>
      <label className='username' htmlFor='email'>Username:
        <input type='text' name='username' className='username' onChange={(e) => setUsername(e.target.value)}/>
      </label>
      <button onClick={handleClick}>Submit</button>
      {sent ? <div className='sent'>Sent</div> : null}
      <div><Link to='/'>Back Home</Link></div>
    </div>
  )
}


export default Password
