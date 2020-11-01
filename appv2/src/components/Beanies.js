import React from 'react';
import * as hooks from '../hooks';
import Context from '../Context';
import Loading from './Loading';
import Error from './Error';

const BeanieSummary = ({ beanie }) => <tr className='beanieSummary'>
    <td>{beanie.name}</td>
    <td>{beanie.family}</td>
    <td><img src={beanie.thumbnail} alt={beanie.name} /></td>
  </tr>;

const Beanies = () => {
  const { state, setState } = React.useContext(Context);
  const { isLoading, error, data } = hooks.useFamily(state.family);

  if (isLoading) return <Loading />;
  if (error) return <Error msg={error} />;

  const renderBeaniesSummary = () => data.map(beanie => <BeanieSummary key={beanie.name} beanie={beanie} />);

  return <table className='beaniesSummary'>
    <thead><tr><td>Name</td><td>Family</td><td></td></tr></thead>
    <tbody>{renderBeaniesSummary()}</tbody>
  </table>;
};

export default Beanies;
