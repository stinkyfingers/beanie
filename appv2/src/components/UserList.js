import React from 'react';

const UserList = ({ beanies = [], title, handleClick, setMode, rmFunc = null }) => {
  const [over, setOver] = React.useState(false);

  const rows = () => {
    if (!beanies) return;
    return beanies.map(beanie => <tr key={beanie}>
      <td className='show' onClick={() => handleClick(beanie, 'beanie')}>{beanie}</td>
      <td>
        {rmFunc ? <div className='delete' onClick={() => rmFunc(beanie)}>X</div> : null}
      </td>
    </tr>);
  };

  const renderMyList = () => {
    const handleDragOver = (e) => {
      e.preventDefault();
      if (!rmFunc) return;
      setOver(true);
    };

    const onDrop = () => {
      setOver(false);
      if (!handleDrop) return;
      handleDrop(title);
    };

    return (
      <table className={over ? 'mylist highlight' : 'mylist'} onDragOver={handleDragOver} onDrop={onDrop} onDragLeave={() => { setOver(false); }}>
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
