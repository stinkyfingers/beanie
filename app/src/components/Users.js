import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import UserList from './UserList';
import { users } from '../api';
import '../css/users.css';

const Users = () => {
  const userState = useContext(UserContext);
  const [allUsers, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const allUsers = async() => {
      try {
        const resp = await users(userState.user.token);
        setUsers(resp);
      } catch (err) {
        console.warn(err)
      }
    }
    allUsers(userState.user.token);
    return setUsers(null);
  }, []);

  const renderUsers = () => {
    if (!allUsers) return null;
    const all = [];
    for (const u of allUsers) {
      all.push(<li key={u.username} onClick={() => setUser(u)}>{u.username}</li>);
    }
    return (<ul className='allUsers'>{all}</ul>)
  }

  return (
    <div className='users'>
      {renderUsers()}
      {user ? <UserList beanies={user.beanies} /> : null}
      {user ? <UserList beanies={user.wantlist} want={true} /> : null}
    </div>
  )
}

export default Users;
