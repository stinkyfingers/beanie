import React, { useContext } from 'react';
import BeanieContext from '../BeanieContext';

const UserList = ({ beanies = [], want = false, rmFunc = null }) => {
  const beanieState = useContext(BeanieContext);

  const renderMyList = () => {
    if (!beanies) return;
    const rows = [];
    for (const b of beanies) {
      rows.push(
        <tr key={b}>
          <td className='show' onClick={(e) => beanieState.setBeanie({name: b})}>{b}</td>
          <td>
            {rmFunc ? <button className='delete' onClick={() => rmFunc(b)}>Remove</button> : null}
          </td>
        </tr>
      );
    }

    return (
      <table className='mylist'>
        <thead>
          <tr className='tableHeader'><td colSpan='2'>{want ? 'Want List' : 'My Beanies'}</td></tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
  return (
    <div className='userList'>
      {renderMyList()}
    </div>
  );
}

export default UserList;
