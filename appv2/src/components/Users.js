import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import Beanie from './Beanie';
import { users } from '../api';

const Users = ({ handleClick, setError }) => {
  const { state, setState } = React.useContext(Context);
  const [allUsers, setUsers] = useState([]);

  useEffect(() => {
    const allUsersFunc = () => {
      return users(state.user.token)
        .then(setUsers)
        .catch(err => { setError(err)});
    };
    allUsersFunc();
    return setUsers([]);
  }, [state.user.token]);

  const renderUsers = () => {
    return <table className='users'>
        <thead>
          <tr>
            <th>
              Users
            </th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(user => <tr key={user.username}><td onClick={() => handleClick(user)}>{user.username}</td></tr>)}
        </tbody>
      </table>;
  };

  return (
    <div className='users'>
      {renderUsers()}
    </div>
  )
}

export default Users;
