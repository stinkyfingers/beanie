import React from 'react';
import * as hooks from '../hooks';
import UserContext from '../UserContext';
import FamilyContext from '../FamilyContext';
import Loading from './Loading.v2';
import Error from './Error';

const BeanieSummary = ({ beanie }) => <tr className='beanieSummary'>
    <td>{beanie.name}</td>
    <td>{beanie.family}</td>
    <td><img src={beanie.thumbnail} alt={beanie.name} /></td>
  </tr>;

const Beanies = () => {
  const userState = React.useContext(UserContext);
  const familyState = React.useContext(FamilyContext);
  const { isLoading, error, data } = hooks.useFamily(userState.user.token, familyState.family);

  if (isLoading) return <Loading />;
  if (error) return <Error msg={error} />;

  const renderBeaniesSummary = () => data.map(beanie => <BeanieSummary key={beanie.name} beanie={beanie} />);

  return <table className='beaniesSummary'>
    <thead><tr><td>Name</td><td>Family</td><td></td></tr></thead>
    <tbody>{renderBeaniesSummary()}</tbody>
  </table>;
};

export default Beanies;
