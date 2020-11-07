import React from 'react';
import _ from 'lodash';
import { updateWantList, updateMyBeanies } from '../api';
import Beanies from './Beanies';
import Beanie from './Beanie';
import Context from '../Context';
import UserList from './UserList';
import Users from './Users';
import User from './User';
import Error from './Error';
import * as api from '../api';
import '../css/dashboard.css';

const removeFromList = (state, setState, list, updateFunc, beanie) => {
  _.remove(list, (b) => b.name === beanie.name);
  return updateFunc(state.user)
    .then(() => {
      localStorage.setItem('user', JSON.stringify(state.user));
      setState({ ...state, user: state.user });
    });
};

const UserWantList = ({ handleDrop }) => {
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromList, state, setState, state.user?.wantlist, updateWantList);
  return <UserList beanies={state.user?.wantlist} title={'Want List'} rmFunc={rmFunc} handleDrop={handleDrop} />;
};

const UserHaveList = ({ handleDrop }) => {
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromList, state, setState, state.user?.beanies, updateMyBeanies);
  return <UserList beanies={state.user?.beanies} title={'Have List'} rmFunc={rmFunc} handleDrop={handleDrop} />;
};

const Dashboard = () => {
  const { state, setState } = React.useContext(Context);
  const [beanie, setBeanie] = React.useState(null);
  const [mode, setMode] = React.useState();
  const [userSelection, setUserSelection] = React.useState();
  const [error, setError] = React.useState();// TODO
  const [user, setUser] = React.useState();

  const handleClick = (beanie, mode) => {
    setBeanie(beanie);
    setMode(mode);
  };

  const handleDrop = (title) => {
    const user = state.user;
    switch (title) {
      case 'Want List':
        if (user.wantlist.includes(userSelection.name)) return;
        user.wantlist.push(userSelection);
        return api.updateWantList(user)
          .then(() => {
            localStorage.setItem('user', JSON.stringify(user));
            setUserSelection({ ...userSelection, beanie: null })
          });
        break;
      case 'Have List':
        if (user.beanies.includes(userSelection.name)) return;
        user.beanies.push(userSelection);
        return api.updateMyBeanies(user)
          .then(() => {
            localStorage.setItem('user', JSON.stringify(user));
            setUserSelection({ ...userSelection, beanie: null })
          });
        break;
    }
  };

  const handleDrag = (beanie) => {
    setUserSelection(beanie);
  };

  const handleClickUser = (user) => {
    setUser(user);
    setMode('user');
  };


  const workspace = () => {
    if (error) return <Error error={error} />;
    switch (mode) {
      case 'userLists':
        return <div className='userBeanies'>
          <UserWantList handleDrop={handleDrop} />
          <UserHaveList handleDrop={handleDrop} />
        </div>;
      case 'beanie':
        return <Beanie beanie={beanie} />;
      case 'users':
        return <Users handleClick={handleClickUser} setError={setError} />;
      case 'user':
        return <User username={user} />;
      default:
        return null;
    }
  };

  return (
      <div className='dashboard'>
        <div className='logo'>
          <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt='Beanie Central' />
        </div>
        <div className='controls'>
          <button className='dashboard' onClick={() => handleClick(null, 'userLists')} hidden={state?.user ? false : true}>My Beanies</button>
          <button className='dashboard' onClick={() => handleClick({isNew: true}, 'beanie')} hidden={state?.user?.admin ? false : true}>Create New Beanie</button>
          <button className='dashboard' onClick={() => handleClick(null, 'users')} hidden={state?.user ? false : true}>Show Users</button>
        </div>
        <div className='display'>
          <div className='beanies'>
            <Beanies handleClick={handleClick} handleDrag={handleDrag} />
          </div>
          <div className='workspace'>
            {workspace()}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
