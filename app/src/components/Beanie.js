import React, {useContext} from 'react';
import UserContext from '../UserContext';

const Beanie = ({beanie}) => {

  const userState = useContext(UserContext);
  const disabled = userState.user.isAdmin ? false : true;
  if (!beanie) return null;
  return (
    <div className='beanie'>
      <label htmlFor='name'>Name:
        <input type='text' name='name' value={beanie.name || '' || ''} disabled={disabled} />
      </label>
      <label htmlFor='animal'>Animal:
        <input type='text' name='animal' value={beanie.animal || ''} disabled={disabled} />
      </label>
      <label htmlFor='birthday'>Birthday:
        <input type='date' name='birthday' value={new Date(beanie.birthday)} disabled={disabled} />
      </label>
      <label htmlFor='exclusiveTo'>Exclusive To:
        <input type='text' name='exclusiveTo' value={beanie.exclusiveTo || ''} disabled={disabled} />
      </label>
      <label htmlFor='family'>Family:
        <select name='family' value={beanie.family} disabled={disabled}>
          <option value='Beanie Babies'>Beanie Babies</option>
          <option value='Beanie Babies'>Beanie Boos</option>
        </select>
      </label>
      <label htmlFor='height'>height:
        <input type='text' name='height' valuevalue={beanie.height || ''} disabled={disabled} />
      </label>
      <label htmlFor='image'>Name:
        <input type='text' name='image' value={beanie.image || ''} disabled={disabled} />
      </label>
      <label htmlFor='introDate'>introDate:
        <input type='date' name='introDate' value={new Date(beanie.introDate)} disabled={disabled} />
      </label>
      <label htmlFor='length'>length:
        <input type='text' name='length' value={beanie.length || ''} disabled={disabled} />
      </label>
      <label htmlFor='number'>number:
        <input type='number' name='number' value={beanie.number} disabled={disabled} />
      </label>
      <label htmlFor='retireDate'>retireDate:
        <input type='date' name='retireDate' value={new Date(beanie.retireDate)} disabled={disabled} />
      </label>
    </div>
  )
}

export default Beanie;
