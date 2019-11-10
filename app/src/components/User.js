import React, {useState} from 'react';
import UserContext from '../UserContext';
import Beanies from './Beanies';
import { updateWantList, updateMyBeanies } from '../api';

const User = () => {
  const userState = React.useContext(UserContext);

  const [want, setShowWant] = useState(false);


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

  const renderMyList = (beanies, rmFunc) => {
    if (!beanies) return;
    const rows = [];
    for (const beanie of beanies) {
      rows.push(<tr key={beanie} onClick={() => rmFunc(beanie)}><td>{beanie}</td></tr>)
    }
    return (
      <table className='mylist'>
        <thead>
          <tr><td>{want ? 'Want List' : 'My Beanies'}</td></tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
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

  const addBeanieToMyBeanies= async(beanie) => {
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
    <div>
      <h3>Username {userState.user ? userState.user.username : null}</h3>
      <button onClick={() => setShowWant(!want)}>{want ? 'Show My Beanies' : 'Show Want List'}</button>
      {renderMyList(want ? userState.user.wantlist : userState.user.beanies, want ? handleRemoveFromWantList : handleRemoveFromMyBeanies)}
      <Beanies setBeanie={want ? addBeanieToWantList : addBeanieToMyBeanies}/>
    </div>
  );
}

export default User;
