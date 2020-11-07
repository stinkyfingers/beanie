import React from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as api from '../api';
import * as hooks from '../hooks';
import Context from '../Context';
import Loading from './Loading';
import Error from './Error';
import '../css/beanies.css';

const numberOfResponsesFromAPI = 100;

const BeanieSummary = ({ beanie, handleClick, handleDrag }) => {
  return <tr className='beanieSummary' onClick={() => handleClick(beanie, 'beanie')} draggable={true} onDragStart={() => handleDrag(beanie)}>
    <td>{beanie.name}<div className='subtext'>{beanie.animal}</div></td>
    <td>{beanie.thumbnail ? <img src={beanie.thumbnail} alt={beanie.name} /> : null}</td>
  </tr>;
};

const Beanies = ({ handleClick, handleDrag }) => {
  const { state } = React.useContext(Context);
  const getFamily = (family, startKey) => api.family(state.family, startKey);

  const { isLoading, error, data, fetchMore, canFetchMore } = useInfiniteQuery('family', getFamily, {
    getFetchMore: (lastGroup) => {
      if (!lastGroup || lastGroup.length < numberOfResponsesFromAPI) return false;
      return lastGroup[lastGroup.length - 1] ? lastGroup[lastGroup.length - 1].name : null;
    }
  });

  if (isLoading) return <Loading />;
  if (error) return <Error msg={error} />;
  const dataLength = data ? _.sum(_.map(data, group => group.length)) : 0;

  const renderBeaniesSummary = () => data.map(group => group.map(beanie => <BeanieSummary key={beanie.name} beanie={beanie} handleClick={handleClick} handleDrag={handleDrag} />));

  return <div className='beaniesTable'>
    <InfiniteScroll
      next={() => fetchMore()}
      hasMore={canFetchMore}
      dataLength={dataLength}
      loader={<Loading />}
      height={window.innerWidth * .8}
    >
      <table className='beaniesSummary'>
        <thead><tr><td colSpan={2}><div className='subtext'>Click to view or drag to add</div></td></tr></thead>
        <tbody>
          {renderBeaniesSummary()}
        </tbody>
      </table>
    </InfiniteScroll>
  </div>;
}

export default Beanies;
