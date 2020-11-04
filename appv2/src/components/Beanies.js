import React from 'react';
import * as hooks from '../hooks';
import Context from '../Context';
import Loading from './Loading';
import Error from './Error';
import '../css/beanies.css';

const BeanieSummary = ({ beanie, handleClick, handleDrag }) => {
  return <tr className='beanieSummary' onClick={() => handleClick(beanie, 'beanie')} draggable={true} onDragStart={() => handleDrag(beanie)}>
    <td>{beanie.name}</td>
    <td>{beanie.family}</td>
    <td><img src={beanie.thumbnail} alt={beanie.name} /></td>
  </tr>;
};

const Beanies = ({ handleClick, handleDrag }) => {
  const { state } = React.useContext(Context);
  const { isLoading, error, data } = hooks.useFamily(state.family);

  if (isLoading) return <Loading />;
  if (error) return <Error msg={error} />;

  const renderBeaniesSummary = () => data.map(beanie => <BeanieSummary key={beanie.name} beanie={beanie} handleClick={handleClick} handleDrag={handleDrag} />);

  return <table className='beaniesSummary'>
    <thead><tr><td>Name</td><td>Family</td><td></td></tr></thead>
    <tbody>{renderBeaniesSummary()}</tbody>
  </table>;
};

export default Beanies;
