import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import UserList from './UserList';
import Beanie from './Beanie';
import { users } from '../api';
import '../css/users.css';

const Users = () => {
  const userState = useContext(UserContext);
  const [allUsers, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [beanie, setBeanie] = useState(null);

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
      <h4>{user ? `Selected user: ${user.username}` : ''}</h4>
      <div className='userData'>
        {user ? <UserList beanies={user.beanies} setBeanie={setBeanie} /> : null}
        {user ? <UserList beanies={user.wantlist} want={true} setBeanie={setBeanie} /> : null}
        {beanie ? <Beanie beanie={beanie} /> : null}
      </div>
    </div>
  )
}

export default Users;
