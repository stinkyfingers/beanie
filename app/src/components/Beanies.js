import React, { useContext, useState } from 'react';
import BeanieContext from '../BeanieContext';
import UserContext from '../UserContext';
import _ from 'lodash';
import { deleteBeanie } from '../api';
import '../css/beanies.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Pdf from './Pdf';
import { get } from '../api';

function useForceUpdate(beanie){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

const Beanies = ({addBeanie, setBeanie}) => {
  const beanieState = useContext(BeanieContext);
  const userState = useContext(UserContext);
  const [pdfBeanies, setPdfBeanies] = useState([]);
  const [pdfReady, setPdfReady] = useState(false);
  const forceUpdate = useForceUpdate();

  const handleCheck = (checked, beanie) => {
    let current = pdfBeanies;
    if (checked) {
      current.push(beanie);
    } else {
      current = _.remove(current, (n) => n !== beanie);
    }
    setPdfBeanies(current);
    forceUpdate();
  }

  const renderBeanies = () => {
    let out = [];
    if (!beanieState.beanies) return out;
    const sorted = beanieState.beanies.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });
    sorted.map((beanie) => {
      const checked = _.some(pdfBeanies, ['name', beanie.name]);
      return out.push(
        <tr key={beanie.name}>
          <td><input type='checkbox' checked={checked} onChange={(e) => {handleCheck(e.target.checked, beanie)}} value={beanie.name} /></td>
          <td onClick={() => handleCheck(beanie.name)}>{beanie.name}</td>
          <td>{beanie.family}</td>
          <td>{beanie.animal}</td>
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
      const updatedBeanies = _.remove(beanieState.beanies, (b) => b.name !== beanie.name);
      beanieState.setBeanies(updatedBeanies);
    } catch (err) {
      console.warn(err);
    }
  }

  const preparePDF = async() => {
    let beanies = [];
    for (let p of pdfBeanies) {
      const b = await get(userState.user.token, p.name);
      beanies.push(b);
    }
    setPdfBeanies(beanies);
    setPdfReady(true);
  }

  return(
    <div className='beanies'>
      <div className='newBeanie'>
        <button onClick={() => setBeanie({isNew: true})}>New Beanie</button>
        {pdfReady ? <React.Fragment><PDFDownloadLink document={<Pdf beanies={pdfBeanies} title='Beanies' token={userState.user.token}/>} fileName="beanies.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink><button onClick={() => setPdfReady(false)}>Cancel PDF</button></React.Fragment> : <button onClick={preparePDF}>Prepare PDF</button>}
      </div>
      <table className='beanies'>
        <thead>
          <tr className='tableHeader'>
            <td>PDF</td>
            <td>Name</td>
            <td>Family</td>
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
