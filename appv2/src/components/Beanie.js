import React from 'react';
import Context from '../Context';
import Error from './Error';
import { get, create } from '../api';
import '../css/beanie.css';

const Beanie = ({ beanie }) => {
  const { state } = React.useContext(Context);
  const [beanieValue, setBeanieValue] = React.useState(beanie);
  const [savingState, setSavingState] = React.useState('');
  const [err, setError] = React.useState(undefined);
  const disabled = state.user && state.user.admin ? false : true;

  React.useEffect(() => {
    if(!beanie || !state.user) return null;
    if (beanie.isNew) {
      setBeanieValue({});
      return;
    }
    const fetchBeanie = () => {
      return get(state.user.token, beanie.family, beanie.name)
      .then(resp => {
        setBeanieValue({ ...resp, isNew: false });
      });
    };
    fetchBeanie();
    return setBeanieValue(null);
  }, [state.user, beanie]);

  if (!beanieValue) return null;

  const formatDate = (date) => {
    if (date.toString() === 'Invalid Date') return '';
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
    setBeanieValue({ ...beanieValue, [e.target.name]: e.target.value})
  };

  const submit = async() => {
    setSavingState('Saving...');
    return create(state.user.token, beanieValue)
      .then(() => {
        if (beanieValue.isNew) {
          const updatedBeanies = beanie;
          updatedBeanies.push(beanieValue);
          state.set({ ...state, beanies: updatedBeanies });
        }
        setSavingState('Saving Complete');
      })
      .catch(err => {
        setError(err)
      });
  };

  return (
    <div className='beanie'>
      {err ? <Error msg={err} /> : null}
      <div className='fields'>
        <label htmlFor='name'>Name:</label>
        <input type='text' name='name' value={beanieValue.name || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='animal'>Animal:</label>
        <input type='text' name='animal' value={beanieValue.animal || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='birthday'>Birthday:</label>
        <input type='date' name='birthday' data-testid='birthday' value={birthday} disabled={disabled} onChange={handleChange}/>

        <label htmlFor='exclusiveTo'>Exclusive To:</label>
        <input type='text' name='exclusiveTo' value={beanieValue.exclusiveTo || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='family'>Family:</label>
        <select name='family' disabled={disabled} onChange={handleChange}>
          <option value='Beanie Babies'>Beanie Babies</option>
          <option value='Beanie Babies 2.0'>Beanie Babies 2.0</option>
          <option value='Beanie Boos'>Beanie Boos</option>
          <option value='Beanie Fashion'>Beanie Fashion</option>
        </select>

        <label htmlFor='height'>Height:</label>
        <input type='text' name='height' value={beanieValue.height || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='length'>Length:</label>
        <input type='text' name='length' value={beanieValue.length || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='number'>Number:</label>
        <input type='text' name='number' value={beanieValue.number || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='introDate'>Intro Date:</label>
        <input type='date' name='introDate' value={introDate || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='retireDate'>Retire Date:</label>
        <input type='date' name='retireDate' value={retireDate || ''} disabled={disabled} onChange={handleChange} />

        <label htmlFor='image'>Image URL:</label>
        <input type='text' name='image' disabled={disabled} onChange={handleChange} />
      </div>

      <div className='images'>
        <div className='image'>
          <img src={beanieValue.image} alt={beanieValue.name}/>
        </div>
        <div className='thumbnail'>
          {beanieValue.thumbnail ? <img src={beanieValue.thumbnail} alt={beanieValue.name}/> : 'Thumbmail image not created'}
        </div>
        {disabled ? null :
          <React.Fragment>
            <button className='add' onClick={submit}>Save</button>
            <div className='savingNotice'>{savingState}</div>
          </React.Fragment>
        }
      </div>
    </div>
  )
}

export default Beanie;
