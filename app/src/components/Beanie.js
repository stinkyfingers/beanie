import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../UserContext';
import BeanieContext from '../BeanieContext';
import BeaniesContext from '../BeaniesContext';
import FamilyContext from '../FamilyContext';
import { get, upsert } from '../api';
import '../css/beanie.css';

const Beanie = () => {
  const userState = useContext(UserContext);
  const beaniesState = useContext(BeaniesContext);
  const beanieState = useContext(BeanieContext);
  const familyState = useContext(FamilyContext);
  const beanie = beanieState.beanie;

  const disabled = userState.user && userState.user.admin ? false : true;
  const [beanieValue, setBeanieValue] = useState(beanie);
  const [savingState, setSavingState] = useState('');
  const token = userState.user && userState.user.token;

  useEffect(() => {
    if (!beanie || beanie.isNew) {
      setBeanieValue({...beanie, family: familyState.family});
      return;
    }
    const getBeanie = async() => {
      try {
        const b = await get(token, beanie.name);
        setBeanieValue(b);
      } catch (err) {
        console.warn(err); // TODO
      }
    }
    getBeanie();
    return (setBeanieValue(null))
  }, [beanie, token]);

  if (!beanieValue) return null;

  const formatDate = (date) => {
    const y = date.getFullYear();
    let m = (date.getMonth() + 1);
    let d = date.getDate();
    if (d.toString().length === 1) {
      d = '0' + d;
    }
    if (m.toString().length === 1) {
      m = '0' + m;
    }
    return `${y}-${m}-${d}`
  };

  const birthday = formatDate(new Date(beanieValue.birthday));
  const introDate = formatDate(new Date(beanieValue.introDate));
  const retireDate = formatDate(new Date(beanieValue.retireDate));

  const handleChange = (e) => {
    const updatedBeanie = beanieValue;
    updatedBeanie[e.target.name] = e.target.value;
    setBeanieValue(updatedBeanie);
  };

  const submit = async() => {
    try {
      setSavingState('Saving...');
      const res = await upsert(userState.user.token, beanieValue);
      if (beanieValue.isNew) {
        beanieValue.isNew = null;
        const updatedBeanies = beaniesState.beanies;
        updatedBeanies.push(res);
        beaniesState.setBeanies(updatedBeanies);
      }
      setSavingState('Saving Complete');
    } catch (err) {
      console.warn(err) // TODO
    }
  };

  if (!beanie) return null;

  return (
    <div className='beanie'>
      <label htmlFor='name'>Name:</label>
      <input type='text' name='name' defaultValue={beanieValue.name || ''} disabled={disabled} onChange={handleChange} />

      <label htmlFor='animal'>Animal:</label>
      <input type='text' name='animal' defaultValue={beanieValue.animal || ''} disabled={disabled} onChange={handleChange} />

      <label htmlFor='birthday'>Birthday:</label>
      <input type='date' name='birthday' data-testid='birthday' defaultValue={birthday} disabled={disabled} onChange={handleChange}/>

      <label htmlFor='exclusiveTo'>Exclusive To:</label>
      <input type='text' name='exclusiveTo' defaultValue={beanieValue.exclusiveTo || ''} disabled={disabled} onChange={handleChange} />

      <label htmlFor='family'>Family:</label>
      <select name='family' defaultValue={familyState.family} disabled={disabled} onChange={handleChange}>
        <option value='Beanie Babies'>Beanie Babies</option>
        <option value='Beanie Babies 2.0'>Beanie Babies 2.0</option>
        <option value='Beanie Boos'>Beanie Boos</option>
        <option value='Beanie Fashion'>Beanie Fashion</option>
      </select>

      <label htmlFor='height'>Height:</label>
      <input type='text' name='height' defaultValue={beanieValue.height || ''} disabled={disabled} onChange={handleChange} />

      <label htmlFor='length'>Length:</label>
      <input type='text' name='length' defaultValue={beanieValue.length || ''} disabled={disabled} onChange={handleChange} />

      <label htmlFor='number'>Number:</label>
      <input type='text' name='number' defaultValue={beanieValue.number} disabled={disabled} onChange={handleChange} />

      <label htmlFor='introDate'>Intro Date:</label>
      <input type='date' name='introDate' defaultValue={introDate} disabled={disabled} onChange={handleChange} />

      <label htmlFor='retireDate'>Retire Date:</label>
      <input type='date' name='retireDate' defaultValue={retireDate} disabled={disabled} onChange={handleChange} />

      <label htmlFor='image'>Image URL:</label>
      <input type='text' name='image' defaultValue={beanieValue.image || ''} disabled={disabled} onChange={handleChange} />

      <div className='image'>
        <img src={beanieValue.image} alt={beanieValue.name}/>
      </div>
      {disabled ? null :
        <React.Fragment>
          <button className='add' onClick={submit}>Save</button>
          <div className='savingNotice'>{savingState}</div>
        </React.Fragment>
      }
    </div>
  )
}

export default Beanie;
