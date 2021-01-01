import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Context from '../Context';
import Pdf from './Pdf';
import Checklist from './Checklist';
import Error from './Error';
import * as api from '../api';
import '../css/downloads.css';

const numberOfResponsesFromAPI = 100; // TODO deprecate

const PdfLink = ({ beanies }) => <React.Fragment>
    <PDFDownloadLink document={<Pdf beanies={beanies} title='Beanies' />} fileName="beanies.pdf">
    <button>Download pdf</button>
    </PDFDownloadLink>
  </React.Fragment>;

const ChecklistLink = ({ beanies, family, loading}) => <React.Fragment>
    <PDFDownloadLink document={<Checklist family={family} title='Checklist' beanies={beanies}/>} fileName="beanies_checklist.pdf">
    {loading ? <div className='loadingChecklist'>Loading Checklist...</div> : <button>Download Checklist</button>}
    </PDFDownloadLink>
  </React.Fragment>;

const Downloads = ({ pdfBeanies }) => {
  const { state, setState } = React.useContext(Context);
  const [pdf, setPdf] = React.useState({ ready: false });
  const [checklist, setChecklist] = React.useState({ ready: false, beanies: [], loading: false });
  const [error, setError] = React.useState();

  const createPdf = () => {
    setPdf(pdf => ({ ...pdf, ready: true }));
  };

  const renderPdf = () => {
    if (pdf.ready) return <div className='buttons'>
      <PdfLink beanies={pdfBeanies} loading={pdf.loading} />
      <button onClick={() => setPdf({ ready: false })}>Cancel PDF</button>
    </div>;
    return <div className='buttons'>
      <button onClick={createPdf}>Create PDF <small className='addToPdf'>of selected Beanies</small></button>
    </div>;
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
    if (checklist.ready || checklist.loading) return <div className='buttons'>
      <ChecklistLink family={state.family} beanies={checklist.beanies} loading={checklist.loading}/>
      <button onClick={() => setChecklist({ ready: false, beanies: [], laoding: false })}>Cancel Checklist</button>
    </div>;
    return <div className='buttons'>
      <button onClick={createChecklist}>Create Checklist<small className='addToPdf'>of all Beanies</small></button>
    </div>;
  };

  if (error) return <Error msg={error} />;

  return <div className='downloads'>
    <div className='pdfs'>
      <h3 className='header'>PDF</h3>
      {renderPdf()}
    </div>
    <div className='pdfs'>
      <h3 className='header'>Checklist</h3>
      {renderChecklist()}
    </div>
  </div>;
};

export default Downloads;
