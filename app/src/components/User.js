import React, {useState, useContext} from 'react';
import UserContext from '../UserContext';
import UserList from './UserList';
import { updateWantList, updateMyBeanies } from '../api';
import '../css/user.css';

const User = ({ want, setShowWant }) => {
  const userState = useContext(UserContext);

  const [beanie, setBeanie] = useState(null);

  if (!userState || !userState.user) return null;


  const handleRemoveFromWantList = async(beanie) => {
    const user = userState.user;
    user.wantlist = user.wantlist.filter((value) => {
      return value !== beanie;
    });
    if (user.wantlist.length === 0) {
      delete user.wantlist;
    }

    try {
      const updatedUser = await updateWantList(user);
      localStorage.setItem('user', JSON.stringify({...user, wantlist: updatedUser.wantlist}));
      userState.setUser({...user, wantlist: updatedUser.wantlist});
    } catch (err) {
      console.warn(err)
    }
  };

  const handleRemoveFromMyBeanies = async(beanie) => {
    const user = userState.user;
    user.beanies = user.beanies.filter((value) => {
      return value !== beanie;
    });
    if (user.beanies.length === 0) {
      delete user.beanies;
    }

    try {
      const updatedUser = await updateMyBeanies(user);
      localStorage.setItem('user', JSON.stringify({...user, beanies: updatedUser.beanies}));
      userState.setUser({...user, beanies: updatedUser.beanies});
    } catch (err) {
      console.warn(err)
    }
  };

  return (
    <div className='user'>
      <div className='lists'>
        <button onClick={() => setShowWant(!want)}>{want ? 'Show My Beanies' : 'Show Want List'}</button>
        {want ?
          <UserList beanies={userState.user.wantlist} setBeanie={setBeanie} rmFunc={handleRemoveFromWantList} want={want} /> :
          <UserList beanies={userState.user.beanies} setBeanie={setBeanie} rmFunc={handleRemoveFromMyBeanies} want={want} />
        }
        </div>
    </div>
  );
}

export default User;
