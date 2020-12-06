import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import Beanie from './Beanie';
import Error from './Error';
import { users } from '../api';

const Users = ({ handleClick, setError }) => {
  const { state, setState } = React.useContext(Context);
  const [allUsers, setUsers] = useState([]);
  const token = state?.user?.token;

  useEffect(() => {
    const allUsersFunc = () => {
      return users(token)
        .then(setUsers)
        .catch(err => { setError(err) });
    };
    allUsersFunc();
    return setUsers([]);
  }, [token]);

  const renderUsers = () => {
    if (allUsers.error) return <Error msg={allUsers.error} />
    if (!allUsers || !allUsers.length) return null;
    return <table className='users'>
        <thead>
          <tr>
            <th>
              Users
            </th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(user => <tr key={user}><td onClick={() => handleClick(user)}>{user}</td></tr>)}
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
