import React from 'react';
import Context from '../Context';

const Logout = () => {
  const { state, setState } = React.useContext(Context);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setState({ ...state, user: null });
  };

  return <div><button  className='login' onClick={handleLogout}>Log Out</button></div>;
};

export default Logout;
