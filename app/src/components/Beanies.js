import React, { useContext, useState } from 'react';
import BeaniesContext from '../BeaniesContext';
import BeanieContext from '../BeanieContext';
import UserContext from '../UserContext';
import FamilyContext from '../FamilyContext';
import _ from 'lodash';
import { deleteBeanie } from '../api';
import '../css/beanies.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Pdf from './Pdf';
import { get, getProxyImage } from '../api';

function useForceUpdate(beanie){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

const Beanies = ({addBeanie}) => {
  const beanieState = useContext(BeanieContext);
  const beaniesState = useContext(BeaniesContext);
  const userState = useContext(UserContext);
  const familyState = useContext(FamilyContext);
  const [pdfBeanies, setPdfBeanies] = useState([]);
  const [pdfReady, setPdfReady] = useState(false);
  const forceUpdate = useForceUpdate();
  const setBeanie = beanieState.setBeanie;

  const handleCheck = (checked, beanie) => {
    let current = pdfBeanies;
    if (checked) {
      current.push(beanie);
    } else {
      current = _.remove(current, (n) => n.name !== beanie.name);
    }
    setPdfBeanies(current);
    forceUpdate();
  }

  const renderBeanies = () => {
    let out = [];
    if (!beaniesState.beanies) return out;
    const sorted = beaniesState.beanies.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
    sorted.map((beanie) => {
      const checked = _.some(pdfBeanies, ['name', beanie.name]);
      return out.push(
        <tr key={beanie.name}>
          <td><input type='checkbox' checked={checked} onChange={(e) => {handleCheck(e.target.checked, beanie)}} value={beanie.name} /></td>
          <td>{beanie.thumbnail && beanie.family !== 'Beanie Babies' ? <img src={beanie.thumbnail} alt={beanie.name} onClick={() => setBeanie(beanie)} className='clickable' /> : null}</td>
          <td className='clickable' onClick={() => setBeanie(beanie)}>{beanie.name}</td>
          <td className='clickable' onClick={() => setBeanie(beanie)}>{beanie.animal}</td>
          <td><button className='add' onClick={() => addBeanie(beanie)}>Add</button></td>
          <td><button className='show' onClick={() => setBeanie(beanie)}>Show</button></td>
          <td><button className='delete' onClick={() => handleDelete(beanie)}>Delete</button></td>
        </tr>);
    });
    return out;
  }

  const handleDelete = async(beanie) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      deleteBeanie(userState.user.token, beanie.name);
      const updatedBeanies = _.remove(beaniesState.beanies, (b) => b.name !== beanie.name);
      beaniesState.setBeanies(updatedBeanies);
    } catch (err) {
      console.warn(err);
    }
  }

  const preparePDF = async() => {
    let beanies = [];
    for (let p of pdfBeanies) {
      const b = await get(userState.user.token, p.name);
      if (b.image && b.image.includes('http://')) {
        b.image = await getProxyImage(b.image)
      }
      beanies.push(b);
    }
    setPdfBeanies(beanies);
    setPdfReady(true);
  };

  const handleNewBeanieClick = () => {
    if (beanieState.beanie) {
      setBeanie(null);
      return;
    }
    setBeanie({isNew: true});
  }

  return(
    <div className='beanies'>
      <div className='newBeanie'>
        <button onClick={handleNewBeanieClick}>{beanieState.beanie ? 'Cancel' : 'New Beanie'}</button>
        {pdfReady ? <React.Fragment><PDFDownloadLink document={<Pdf beanies={pdfBeanies} title='Beanies' token={userState.user.token}/>} fileName="beanies.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink><button onClick={() => setPdfReady(false)}>Cancel PDF</button></React.Fragment> : <button onClick={preparePDF}>Prepare PDF</button>}
      </div>
      <table className='beanies'>
        <thead>
          <tr className='family'>
            <td colSpan='7'>
              {familyState.family}
            </td>
          </tr>
          <tr className='tableHeader'>
            <td>PDF</td>
            <td></td>
            <td>Name</td>
            <td>Animal</td>
            <td />
            <td />
            <td />
          </tr>
        </thead>
        <tbody>
          {renderBeanies()}
        </tbody>
      </table>
    </div>
  );
}

export default Beanies;
