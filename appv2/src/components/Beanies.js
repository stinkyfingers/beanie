import React from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PDFDownloadLink } from '@react-pdf/renderer';
import * as api from '../api';
import Pdf from './Pdf';
import Checklist from './Checklist';
import Context from '../Context';
import Loading from './Loading';
import Error from './Error';
import '../css/beanies.css';

const numberOfResponsesFromAPI = 100;

const PdfLink = ({ beanies, token }) => <React.Fragment>
    <PDFDownloadLink document={<Pdf beanies={beanies} title='Beanies' token={token}/>} fileName="beanies.pdf">
    {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : <button>Download pdf</button>)}
    </PDFDownloadLink>
  </React.Fragment>;

const ChecklistLink = ({ beanies, family, loading}) => <React.Fragment>
    <PDFDownloadLink document={<Checklist family={family} title='Checklist' beanies={beanies}/>} fileName="beanies_checklist.pdf">
    {loading ? 'Loading checklist...' : <button>Download Checklist</button>}
    </PDFDownloadLink>
  </React.Fragment>;

const BeanieSummary = ({ beanie, handleClick, handleDrag, pdfBeanieNames, handleChange }) => {
  return <tr className='beanieSummary' draggable={true} onDragStart={() => handleDrag(beanie)}>
    <td className='checkbox'><input type='checkbox' checked={pdfBeanieNames.includes(beanie.name) ? 'checked' : ''} onChange={handleChange} value={beanie.name}/></td>
    <td onClick={() => handleClick(beanie, 'beanie')}>{beanie.name}<div className='subtext'>{beanie.animal}</div></td>
    <td onClick={() => handleClick(beanie, 'beanie')}>{beanie.thumbnail ? <img src={beanie.thumbnail} alt={beanie.name} /> : null}</td>
  </tr>;
};

const Beanies = ({ handleClick, handleDrag }) => {
  const { state } = React.useContext(Context);
  const [family] = React.useState(state.family);
  const [pdf, setPdf] = React.useState({ ready: false, beanies: [] });
  const [checklist, setChecklist] = React.useState({ ready: false, beanies: [], loading: false });
  const [data, setData] = React.useState({ beanies: [] });
  const [error, setError] = React.useState();

  const fetchBeanies = (startKey) => {
    return api.family(family, startKey)
      .then(resp => {
        const canFetchMore = resp.length === numberOfResponsesFromAPI;
        const next = resp?.length ? resp[resp.length - 1].name : null;
        const beanies = data.beanies.concat(resp);
        setData(data => ({...data, beanies, next, canFetchMore }))
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


  const handlePdfBeanieChange = (e) => {
    const name = e.target.value;
    const beanies = pdf.beanies;
    if (beanies.includes(name)) {
      _.remove(pdf.beanies, name);
    } else {
      beanies.push(name);
    }
    setPdf({ ready: false, beanies});
  };

  const renderBeaniesSummary = () => data?.beanies?.length ? data.beanies.map(beanie => <BeanieSummary key={beanie.name} beanie={beanie} handleClick={handleClick} handleDrag={handleDrag} pdfBeanieNames={pdf.beanies} handleChange={handlePdfBeanieChange}/>) : null;

  const createPdf = () => {
    return Promise.all(pdf.beanies.map(beanie => api.get(state.user.token, state.family, beanie)))
      .then(pdfBeanies => setPdf({ ready: true, beanies: pdfBeanies }));
  };

  const renderPdf = () => {
    if (pdf.ready) return <React.Fragment>
      <PdfLink token={state.user.token} beanies={pdf.beanies} />
      <button onClick={() => setPdf({ ready: false, beanies: [] })}>Cancel pdf</button>
    </React.Fragment>;
    return <React.Fragment>
      <button onClick={createPdf}>Create pdf</button>
    </React.Fragment>;
  };

  const createChecklist = () => {
    setChecklist({ ...checklist, loading: true });
    const beanies = [];
    const fetchFamily = (family, startKey) => {
      return api.family(family, startKey)
        .then(resp => {
          beanies.push(...resp);
          if (resp.length === numberOfResponsesFromAPI) {
            return fetchFamily(family, resp[resp.length - 1].name);
          }
        })
        .catch(setError);
    };
    fetchFamily(state.family)
      .then(() => {
        setChecklist({ ready: true, beanies, loading: false });
      });
  };

  const renderChecklist = () => {
    if (checklist.ready || checklist.loading) return <React.Fragment>
      <ChecklistLink family={state.family} beanies={checklist.beanies} loading={checklist.loading}/>
      <button onClick={() => setChecklist({ ready: false, beanies: [], laoding: false })}>Cancel Checklist</button>
    </React.Fragment>;
    return <React.Fragment>
      <button onClick={createChecklist}>Create Checklist</button>
    </React.Fragment>;
  };

  if (error) return <Error error={error} />;

  return <div className='beaniesTable'>
    <div className='pdfs'>
      {renderPdf()}
    </div>
    <div className='pdfs'>
      {renderChecklist()}
    </div>
    <InfiniteScroll
      next={fetchMore}
      hasMore={data.canFetchMore}
      dataLength={data?.beanies?.length || 0}
      loader={<Loading />}
      height={window.innerHeight}
    >
      <table className='beaniesSummary'>
        <thead><tr><td colSpan={2}><div className='subtext'>Click to view or drag to add</div></td></tr></thead>
        <tbody>
          {data ? renderBeaniesSummary() : null}
        </tbody>
      </table>
    </InfiniteScroll>
  </div>;
}

export default Beanies;
