import React from 'react';
import _ from 'lodash';
import { updateWantList, updateMyBeanies } from '../api';
import Beanies from './Beanies';
import Beanie from './Beanie';
import Context from '../Context';
import UserList from './UserList';
import '../css/dashboard.css';

const removeFromList = (state, setState, list, updateFunc, beanie) => {
  _.remove(list, (name) => name === beanie)
  return updateFunc(state.user)
    .then(() => {
      localStorage.setItem('user', JSON.stringify(state.user));
      setState({ ...state, user: state.user });
    });
};

const UserWantList = () => {
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromList, state, setState, state.user?.wantlist, updateWantList);
  return <UserList beanies={state.user?.wantlist} title={'Want List'} rmFunc={rmFunc} />;
};

const UserHaveList = () => {
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromList, state, setState, state.user?.beanies, updateMyBeanies);
  return <UserList beanies={state.user?.beanies} title={'Have List'} rmFunc={rmFunc} />;
};

const CreateNewBeanieButton = ({ setBeanie }) => {
  return <button onClick={() => { setBeanie({ isNew: true })}}>Create New Beanie</button>;
};

const Workspace = ({ beanie, mode }) => {
  if (beanie) return <Beanie beanie={beanie} />;
  switch (mode) {
    case 'userWantList':
      return <UserWantList />;
    case 'userHaveList':
      return <UserHaveList />;
    default:
      return null;
  }
};

const Dashboard = () => {
  const [beanie, setBeanie] = React.useState(null);
  const [mode, setMode] = React.useState();
  return (
      <div className='dashboard'>
        <div className='logo'>
          <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt='Beanie Central' />
        </div>
        <div className='controls'>
          <CreateNewBeanieButton setBeanie={setBeanie}/>
          <button>TEST</button>
        </div>
        <div className='display'>
          <div className='beanies'>
            <Beanies setBeanie={setBeanie} />
          </div>
          <div className='workspace'>
            <Workspace beanie={beanie} mode={mode} />
          </div>
        </div>
      </div>
  );

};

export default Dashboard;
