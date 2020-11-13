import React from 'react';
import _ from 'lodash';
import { addToList, removeFromList } from '../api';
import Beanies from './Beanies';
import Beanie from './Beanie';
import Context from '../Context';
import UserList from './UserList';
import Users from './Users';
import User from './User';
import Error from './Error';
import Settings from './Settings';
import * as api from '../api';
import '../css/dashboard.css';

const removeFromListFunction = (state, setState, listType, updateFunc, beanie) => {
  return updateFunc(state.user, listType, beanie.family, beanie.name)
    .then(user => {
      localStorage.setItem('user', JSON.stringify({ ...state.user, [listType]: user[listType] }));
      setState({ ...state, user: { ...state.user, [listType]: user[listType] } });
    });
};

const UserWantList = ({ handleDrop }) => {
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromListFunction, state, setState, 'wantlist', removeFromList);
  return <UserList beanies={state.user?.wantlist} title={'Want List'} rmFunc={rmFunc} handleDrop={handleDrop} />;
};

const UserHaveList = ({ handleDrop }) => {
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromListFunction, state, setState, 'beanies', removeFromList);
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
        if (user.wantlist && user.wantlist.includes(userSelection.name)) return;
        if (!user.wantlist) user.wantlist = [];
        user.wantlist.push(userSelection);
        return api.addToList(state.user, 'wantlist', userSelection.family, userSelection.name)
          .then(user => {
            localStorage.setItem('user', JSON.stringify({ ...state.user, wanlist: user.wantlist }));
            setUserSelection({ ...userSelection, beanie: null })
          })
          .catch(err => {
            setError(err);
          });
        break;
      case 'Have List':
        if (user.beanies && user.beanies.includes(userSelection.name)) return;
        if (!user.beanies) user.beanies = [];
        user.beanies.push(userSelection);
        return api.addToList(state.user, 'beanies', userSelection.family, userSelection.name)
          .then(user => {
            localStorage.setItem('user', JSON.stringify({ ...state.user, beanies: user.beanies }));
            setUserSelection({ ...userSelection, beanie: null })
          })
          .catch(err => {
            setError(err);
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

      case 'beanie':
        return <Beanie beanie={beanie} />;
      case 'users':
        return <Users handleClick={handleClickUser} setError={setError} />;
      case 'user':
        return <User username={user} />;
      case 'settings':
        return <Settings />;
      case 'userLists':
      default:
        return <div className='userBeanies'>
          <UserWantList handleDrop={handleDrop} />
          <UserHaveList handleDrop={handleDrop} />
        </div>;
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
          <button className='dashboard' onClick={() => handleClick(null, 'settings')} hidden={state?.user ? false : true}>Settings</button>
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
