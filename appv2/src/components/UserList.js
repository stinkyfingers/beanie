import React from 'react';

const UserList = ({ beanies = [], title, setMode, handleDrop = null, rmFunc = null }) => {
  const [over, setOver] = React.useState(false);

  const rows = () => {
    if (!beanies) return;
    return beanies.map(beanie => <tr key={beanie} key={beanie.name} className='userBeanie'>
      <td className='show'>{beanie.name}<div className='subtext italic'>{beanie.family}</div></td>
      <td className='show'>{beanie.thumbnail ? <img src={beanie.thumbnail} alt={beanie.name} /> : null}</td>
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
          <tr className='tableSubHeader'><td colSpan='2'>{`Total: ${beanies ? beanies.length : 0}`}</td></tr>
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
