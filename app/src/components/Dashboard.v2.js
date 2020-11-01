import React, { useContext } from 'react';
import Beanies from './Beanies.v2';
// import Beanie from './Beanie';
// import User from './User';
// import UserContext from '../UserContext';
// import BeanieContext from '../BeanieContext';
// import '../css/dashboard.css';
// import { updateWantList, updateMyBeanies } from '../api';
import { ReactQueryCacheProvider, QueryCache } from 'react-query';


const DashboardV2 = () => {
  const queryCache = new QueryCache();
  // const userState = useContext(UserContext);


  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <div className='dashboard'>
        <Beanies />
      </div>
    </ReactQueryCacheProvider>
  );

};

export default DashboardV2;
