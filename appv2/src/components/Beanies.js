import React from 'react';
import * as hooks from '../hooks';
import Context from '../Context';
import Loading from './Loading';
import Error from './Error';
import '../css/beanies.css';

const BeanieSummary = ({ beanie, setBeanie }) => {
  return <tr className='beanieSummary' onClick={() => setBeanie(beanie)}>
    <td>{beanie.name}</td>
    <td>{beanie.family}</td>
    <td><img src={beanie.thumbnail} alt={beanie.name} /></td>
  </tr>;
};

const Beanies = ({ setBeanie }) => {
  const { state } = React.useContext(Context);
  const { isLoading, error, data } = hooks.useFamily(state.family);

  if (isLoading) return <Loading />;
  if (error) return <Error msg={error} />;

  const renderBeaniesSummary = () => data.map(beanie => <BeanieSummary key={beanie.name} beanie={beanie} setBeanie={setBeanie} />);

  return <table className='beaniesSummary'>
    <thead><tr><td>Name</td><td>Family</td><td></td></tr></thead>
    <tbody>{renderBeaniesSummary()}</tbody>
  </table>;
};

export default Beanies;
