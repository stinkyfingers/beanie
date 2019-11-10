import React, {useState} from 'react';
import Beanie from './Beanie';
import Beanies from './Beanies';
import '../css/all.css';

const All = () => {
  const [beanie, setBeanie] = useState(null);

  return(
    <div className='all'>
      <Beanies setBeanie={setBeanie}/>
      <Beanie beanie={beanie} />
    </div>
  );
}

export default All;
