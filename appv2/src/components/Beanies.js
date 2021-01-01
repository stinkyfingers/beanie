import React from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import * as api from '../api';
// import Pdf from './Pdf';
// import Checklist from './Checklist';
import Context from '../Context';
import Loading from './Loading';
import Error from './Error';
import '../css/beanies.css';

const numberOfResponsesFromAPI = 100;

const BeanieSummary = ({ beanie, handleClick, handleDrag, pdfBeanieNames, handleChange }) => {
  return <tr className='beanieSummary' draggable={true} onDragStart={() => handleDrag(beanie)}>
    <td className='checkbox'>
      <small className='addToPdf'>Add To PDF</small>
      <input className='addToPdf' type='checkbox' checked={pdfBeanieNames.includes(beanie) ? 'checked' : ''} onChange={handleChange} value={beanie.name}/>
    </td>
    <td onClick={() => handleClick(beanie, 'beanie')}>{beanie.name}<div className='subtext'>{beanie.animal}</div></td>
    <td onClick={() => handleClick(beanie, 'beanie')}>{beanie.thumbnail ? <img src={beanie.thumbnail} alt={beanie.name} /> : null}</td>
  </tr>;
};

const Beanies = ({ handleClick, handleDrag, handlePdfCheckbox }) => {
  const { state } = React.useContext(Context);
  const [family] = React.useState(state.family);
  const [pdf, setPdf] = React.useState({ beanies: [] }); // maintains a list parallel to handlePdfCheckbox to assert when items are checked
  const [data, setData] = React.useState({ beanies: [] });
  const [displayedBeanies, setDisplayedBeanies] = React.useState([]);
  const [error, setError] = React.useState();

  const fetchBeanies = (startKey) => {
    return api.family(family, startKey)
      .then(resp => {
        const canFetchMore = resp.length === numberOfResponsesFromAPI;
        const next = resp?.length ? resp[resp.length - 1].name : null;
        const beanies = data.beanies.concat(resp);
        setData(data => ({...data, beanies, next, canFetchMore }));
        setDisplayedBeanies(resp);
      })
      .catch(setError)
  };

  React.useEffect(() => {
    fetchBeanies(data.next)
    return () => setData({});
  }, []);

  const fetchMore = () => {
    setError(null);
    fetchBeanies(data.next);
  };


  const handlePdfBeanieChange = (e, beanie) => {
    if (!e.target.checked) {
      const beanies = pdf.beanies;
      _.remove(beanies, b => b.name === beanie.name);
      setPdf(pdf => ({ beanies }));
      handlePdfCheckbox(beanies);
    } else {
      setPdf(pdf => ({ beanies: _.union(pdf.beanies, [beanie]) }));
      handlePdfCheckbox(_.union(pdf.beanies, [beanie]));
    }
  };

  const handleSelectAll = (e) => {
    if (!e.target.checked) {
      setPdf(pdf => ({ beanies: [] }));
      handlePdfCheckbox([]);
    } else {
      setPdf(pdf => ({ beanies: data.beanies }));
      handlePdfCheckbox(data.beanies);
    }
  };

  const renderBeaniesSummary = () => displayedBeanies?.length ? displayedBeanies.map(beanie =>
    <BeanieSummary
      key={beanie.name}
      beanie={beanie}
      handleClick={handleClick}
      handleDrag={handleDrag}
      pdfBeanieNames={pdf.beanies}
      handleChange={(e) => handlePdfBeanieChange(e, beanie)}
    />) : null;

  const handleSearch = (e) => {
    const arr = [];
    data.beanies.forEach(beanie => {
      if (_.startsWith(_.lowerCase(beanie.name), _.lowerCase(e.target.value))) arr.push(beanie);
    });
    setDisplayedBeanies(arr);
  };

  if (error) return <Error msg={error} />;

  return <div className='beaniesTable'>
    <InfiniteScroll
      next={fetchMore}
      hasMore={data.canFetchMore}
      dataLength={data?.beanies?.length || 0}
      loader={<Loading />}
      height={window.innerHeight}
    >
      <table className='beaniesSummary'>
        <thead>
          <tr><td colSpan={2} className='searchCol'><div className='search'><input type='text' onChange={handleSearch} placeholder='Search...' /></div></td></tr>
          <tr><td colSpan={2}><div className='subtext'>Click to view or drag to add</div></td></tr>
          <tr><td><div className='selectAll'><input type='checkbox' onClick={handleSelectAll} /></div></td><td><div className='selectAllLabel'>Select All</div></td></tr>
        </thead>
        <tbody>
          {data ? renderBeaniesSummary() : null}
        </tbody>
      </table>
    </InfiniteScroll>
  </div>;
}

export default Beanies;
