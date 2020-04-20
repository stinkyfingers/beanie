import React, { useContext, useState } from 'react';
import Beanies from './Beanies';
import Beanie from './Beanie';
import User from './User';
import UserContext from '../UserContext';
import '../css/dashboard.css';
import { updateWantList, updateMyBeanies } from '../api';


const Dashboard = () => {
  const userState = useContext(UserContext);
  const [want, setShowWant] = useState(false);

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
  };

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
  };

  return (
    <div className='dashboard'>
      <User want={want} setShowWant={setShowWant} />
      <div className='all'>
        <Beanies addBeanie={want ? addBeanieToWantList : addBeanieToMyBeanies} />
        <Beanie />
      </div>
    </div>
  );

};

export default Dashboard;
