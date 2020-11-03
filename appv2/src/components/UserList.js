import React from 'react';
import Context from '../Context';

const UserList = ({ beanies = [], title, rmFunc = null }) => {
  const { state, setState } = React.useContext(Context);

  const rows = () => {
    if (!beanies) return;
    return beanies.map(beanie => <tr key={beanie}>
      <td className='show' onClick={(e) => setState({ ...state, beanie })}>{beanie}</td>
      <td>
        {rmFunc ? <button className='delete' onClick={() => rmFunc(beanie)}>Remove</button> : null}
      </td>
    </tr>);
  };
  const renderMyList = () => {
    return (
      <table className='mylist'>
        <thead>
          <tr className='tableHeader'><td colSpan='2'>{title}</td></tr>
        </thead>
        <tbody>{rows()}</tbody>
      </table>
    );
  };

  return (
    <div className='userList'>
      {renderMyList()}
    </div>
  );
}

export default UserList;
