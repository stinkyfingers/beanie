import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import BeanieContext from '../BeanieContext';
import UserList from './UserList';
import Beanie from './Beanie';
import { users } from '../api';
import '../css/users.css';

// TODO - port over (this is just copied from v1)

const Users = () => {
  const userState = useContext(UserContext);
  const beanieContext = useContext(BeanieContext);
  const [allUsers, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const allUsersFunc = async() => {
      try {
        const resp = await users(userState.user.token);
        setUsers(resp);
      } catch (err) {
        console.warn(err)
      }
    }
    allUsersFunc()
    return setUsers(null);
  }, [userState.user.token]);

  const renderUsers = () => {
    if (!allUsers) return null;
    const all = [];
    for (const u of allUsers) {
      all.push(<li key={u.username} onClick={() => setUser(u)}>{u.username}</li>);
    }
    return (
      <React.Fragment>
        <h5 className='userHeader'>
        Users
        </h5>
        <ul className='allUsers'>{all}</ul>
      </React.Fragment>
    );
  };

  return (
    <div className='users'>
      {renderUsers()}
      <h4>{user ? `Selected user: ${user.username}` : ''}</h4>
      <div className='userData'>
        {user ? <UserList beanies={user.beanies} setBeanie={beanieContext.setBeanie} /> : <UserList />}
        {user ? <UserList beanies={user.wantlist} want={true} setBeanie={beanieContext.setBeanie} /> : <UserList want={true} />}
        {beanieContext.beanie ? <Beanie beanie={beanieContext.beanie} /> : null}
      </div>
    </div>
  )
}

export default Users;
