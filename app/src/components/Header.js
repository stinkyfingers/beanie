import React, { useContext } from 'react';
import Login from './Login';
import { Nav } from '../Router';
import FamilyContext from '../FamilyContext';
import UserContext from '../UserContext';
import BeanieContext from '../BeanieContext';
import '../css/header.css';

const Header = () => {
  const familyState = useContext(FamilyContext);
  const userState = useContext(UserContext);
  const beanieState = useContext(BeanieContext);

  const renderFamilies = () => (
    <div className='families'>
      <select value={familyState.family} onChange={(e) => {localStorage.setItem('family', e.target.value); familyState.setFamily(e.target.value); beanieState.setBeanie(null)}}>
        <option value='Beanie Babies'>Beanie Babies</option>
        <option value='Beanie Babies 2.0'>Beanies 2.0</option>
        <option value='Beanie Boos'>Beanie Boos</option>
        <option value='Beanie Fashion'>Beanie Fashion</option>
      </select>
    </div>
  );

  const renderUsername = () => {
    if (!userState.user) return null;
    return (
        <div className='welcome'>
        Welcome, {userState.user.username}
      </div>
    );
  };

  return (
    <header className='header'>
      {renderFamilies()}
      <div className='name'>
        <h1>Beanie Central</h1>
        <Nav />
      </div>
      <div className='login'>
        <Login />
        {renderUsername()}
      </div>
    </header>
  );
};

export default Header;
