import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../UserContext';
import { get, upsert } from '../api';
import '../css/beanie.css';

const Beanie = ({beanie}) => {
  const userState = useContext(UserContext);
  const disabled = userState.user.admin ? false : true; 
  const [beanieValue, setBeanieValue] = useState(beanie);
  const token = userState.user.token;

  useEffect(() => {
    if (!beanie) return;
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
      await upsert(userState.user.token, beanieValue);
    } catch (err) {
      console.warn(err) // TODO
    }
  };

  return (
    <div className='beanie'>
      <label htmlFor='name'>Name:
        <input type='text' name='name' defaultValue={beanieValue.name || ''} disabled={disabled} onChange={handleChange} />
      </label>
      <label htmlFor='animal'>Animal:
        <input type='text' name='animal' defaultValue={beanieValue.animal || ''} disabled={disabled} onChange={handleChange} />
      </label>
      <label htmlFor='birthday'>Birthday:
        <input type='date' name='birthday' data-testid='birthday' defaultValue={birthday} disabled={disabled} onChange={handleChange}/>
      </label>
      <label htmlFor='exclusiveTo'>Exclusive To:
        <input type='text' name='exclusiveTo' defaultValue={beanieValue.exclusiveTo || ''} disabled={disabled} onChange={handleChange} />
      </label>
      <label htmlFor='family'>Family:
        <select name='family' defaultValue={beanieValue.family} disabled={disabled} onChange={handleChange}>
          <option value='Beanie Babies'>Beanie Babies</option>
          <option value='Beanie Babies 2.0'>Beanie Babies 2.0</option>
          <option value='Beanie Boos'>Beanie Boos</option>
        </select>
      </label>
      <label htmlFor='height'>Height:
        <input type='text' name='height' defaultValue={beanieValue.height || ''} disabled={disabled} onChange={handleChange} />
      </label>
      <label htmlFor='length'>Length:
        <input type='text' name='length' defaultValue={beanieValue.length || ''} disabled={disabled} onChange={handleChange} />
      </label>
      <label htmlFor='number'>Number:
        <input type='text' name='number' defaultValue={beanieValue.number} disabled={disabled} onChange={handleChange}  />
      </label>
      <label htmlFor='introDate'>Intro Date:
        <input type='date' name='introDate' defaultValue={introDate} disabled={disabled} onChange={handleChange} />
      </label>
      <label htmlFor='retireDate'>Retire Date:
        <input type='date' name='retireDate' defaultValue={retireDate} disabled={disabled} onChange={handleChange} />
      </label>
      <label htmlFor='image'>Image URL:
        <input type='text' name='image' defaultValue={beanieValue.image || ''} disabled={disabled} onChange={handleChange} />
      </label>
      <div className='image'>
        <img src={beanieValue.image} alt={beanieValue.name}/>
      </div>
      {disabled ? null : <button className='add' onClick={submit}>Save</button>}
    </div>
  )
}

export default Beanie;
