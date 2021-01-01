import React from 'react';
import Context from '../Context';
import * as api from '../api';
import UserList from './UserList';

const User = ({ username }) => {
  const { state, setState } = React.useContext(Context);
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const fetchUser = () => {
      return api.user(state.user.token, username)
        .then(setUser);
    };
    fetchUser();
    return () => setUser(null);
  }, [username]);

  if (!user) return null;
  return <div className='user'>
    <h3>{user.username}</h3>
    <div className='userLists'>
      <UserList beanies={user.wantlist} title={'Want List'} />
      <UserList beanies={user.beanies} title={'Have List'} />
    </div>
  </div>;
};

export default User;
