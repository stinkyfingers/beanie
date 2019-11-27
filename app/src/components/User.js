import React, {useState, useContext} from 'react';
import UserContext from '../UserContext';
import Beanies from './Beanies';
import Beanie from './Beanie';
import UserList from './UserList';
import { updateWantList, updateMyBeanies } from '../api';
import '../css/user.css';

const User = () => {
  const userState = useContext(UserContext);

  const [want, setShowWant] = useState(false);
  const [beanie, setBeanie] = useState(null);

  if (!userState || !userState.user) return null;


  const handleRemoveFromWantList = async(beanie) => {
    const user = userState.user;
    user.wantlist = user.wantlist.filter((value) => {
      return value !== beanie;
    });

    try {
      const updatedUser = await updateWantList(user);
      localStorage.setItem('user', JSON.stringify({...user, wantlist: updatedUser.wantlist}));
      userState.setUser({...user, wantlist: updatedUser.wantlist});
    } catch (err) {
      console.warn(err)
    }
  }

  const handleRemoveFromMyBeanies = async(beanie) => {
    const user = userState.user;
    user.beanies = user.beanies.filter((value) => {
      return value !== beanie;
    });

    try {
      const updatedUser = await updateMyBeanies(user);
      localStorage.setItem('user', JSON.stringify({...user, beanies: updatedUser.beanies}));
      userState.setUser({...user, beanies: updatedUser.beanies});
    } catch (err) {
      console.warn(err)
    }
  }

  const addBeanieToWantList = async(beanie) => {
    const user = userState.user;
    if (!user.wantlist) {
      user.wantlist = [];
    }
    if (user.wantlist.includes(beanie.name)) return;
    user.wantlist.push(beanie.name);
    try {
      const updatedUser = await updateWantList(user);
      localStorage.setItem('user', JSON.stringify({...user, wantlist: updatedUser.wantlist}));
      userState.setUser({...user, wantlist: updatedUser.wantlist});
    } catch (err) {
      console.warn(err)
    }
  }

  const addBeanieToMyBeanies = async(beanie) => {
    const user = userState.user;
    if (!user.beanies) {
      user.beanies = [];
    }
    if (user.beanies.includes(beanie.name)) return;
    user.beanies.push(beanie.name);
    try {
      const updatedUser = await updateMyBeanies(user);
      localStorage.setItem('user', JSON.stringify({...user, beanies: updatedUser.beanies}));
      userState.setUser({...user, beanies: updatedUser.beanies});
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <div className='user'>
      <div className='lists'>
        <div className='userData'>
          <h3>Username {userState.user ? userState.user.username : null}</h3>
          <button onClick={() => setShowWant(!want)}>{want ? 'Show My Beanies' : 'Show Want List'}</button>
          {want ?
            <UserList beanies={userState.user.wantlist} setBeanie={setBeanie} rmFunc={handleRemoveFromWantList} /> :
            <UserList beanies={userState.user.beanies} setBeanie={setBeanie} rmFunc={handleRemoveFromMyBeanies} />
          }
        </div>

        <div className='all'>
        {beanie ? <Beanie beanie={beanie} /> : null}
        <Beanies addBeanie={want ? addBeanieToWantList : addBeanieToMyBeanies} setBeanie={setBeanie} />
        </div>
      </div>
    </div>
  );
}

export default User;
