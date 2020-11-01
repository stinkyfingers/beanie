import React from 'react';
import Context from '../Context';

const Family = () => {
  const { state, setState } = React.useContext(Context);
  const handleChange = (e) => {
    localStorage.setItem('family', e.target.value);
    setState({ ...state, family: e.target.value, beanie: null });
  };

  return <div className='family'>
    <select value={state.family} onChange={handleChange}>
      <option value='Beanie Babies'>Beanie Babies</option>
      <option value='Beanie Babies 2.0'>Beanies 2.0</option>
      <option value='Beanie Boos'>Beanie Boos</option>
      <option value='Beanie Fashion'>Beanie Fashion</option>
    </select>
  </div>;
};

export default Family;
