import React, { useContext } from 'react';
import Beanies from './Beanies';
import Context from '../Context';
import UserList from './UserList';
import { updateWantList, updateMyBeanies } from '../api';
import _ from 'lodash';
// import Beanie from './Beanie';
// import User from './User';
// import UserContext from '../UserContext';
// import BeanieContext from '../BeanieContext';
// import '../css/dashboard.css';
// import { updateWantList, updateMyBeanies } from '../api';
import { ReactQueryCacheProvider, QueryCache } from 'react-query';

const removeFromList = (state, setState, list, beanie) => {
  _.remove(list, (name) => name === beanie)
  return updateWantList(state.user)
    .then(() => {
      localStorage.setItem('user', JSON.stringify(state.user));
      setState({ ...state, user: state.user });
    });
};

const UserWantList = () => { // TODO - remove func
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromList, state, setState, state.user?.wantlist);
  return <UserList beanies={state.user?.wantlist} title={'Want List'} rmFunc={rmFunc} />;
};

const UserHaveList = () => {
  const { state, setState } = React.useContext(Context);
  const rmFunc = _.partial(removeFromList, state, setState, state.user?.beanies);
  return <UserList beanies={state.user?.beanies} title={'Have List'} rmFunc={rmFunc} />;
};

const DashboardV2 = () => {
  const queryCache = new QueryCache();

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <div className='dashboard'>
        <UserWantList />
        <UserHaveList />
        <Beanies />
      </div>
    </ReactQueryCacheProvider>
  );

};

export default DashboardV2;
