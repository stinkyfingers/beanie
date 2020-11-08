import React from 'react';
import Context from '../Context';
import Error from './Error';
import * as api from '../api';
import '../css/settings.css';

const Settings = () => {
  const { state, setState } = React.useContext(Context);
  const [newPassword, setNewPassword] = React.useState({});

  const handleChange = (e) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value, error: null });
  };

  const handleClick = () => {
    if (newPassword.confirmPassword !== newPassword.newPassword) {
      setNewPassword({ error: 'New passwords typed do not match.' });
      return;
    }
    const u = { ...state.user, newPassword: newPassword.newPassword, password: newPassword.password }
    return api.newPassword(state.user.token, u)
      .then(resp => {
        if (resp.error) setNewPassword({ ...newPassword, error: resp.error });
      })
      .catch(err => setNewPassword({ ...newPassword, error: err }));
  };

  if (!state.user) return null;

  return <div className='settings'>
    <h3>{state.user.username}</h3>
    <h5>Change Password</h5>
    <label>Current Passowrd</label>
    <input type='password' name='password' onChange={handleChange} />
    <label>New Passowrd</label>
    <input type='password' name='newPassword' onChange={handleChange} />
    <label>Retype New Passowrd</label>
    <input type='password' name='confirmPassword' onChange={handleChange} />
    <button onClick={handleClick}>Submit</button>
    {newPassword.error ? <Error msg={newPassword.error} /> : null}
  </div>;
};

export default Settings;
