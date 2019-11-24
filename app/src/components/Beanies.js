import React, { useContext } from 'react';
import BeanieContext from '../BeanieContext';
import UserContext from '../UserContext';
import _ from 'lodash';
import { deleteBeanie } from '../api';
import '../css/beanies.css';

const Beanies = ({addBeanie, setBeanie}) => {
  const beanieState = useContext(BeanieContext);
  const userState = React.useContext(UserContext);

  const renderBeanies = () => {
    let out = [];
    if (!beanieState.beanies) return out;
    const sorted = beanieState.beanies.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });
    sorted.map((beanie) => {
      return out.push(
      <tr key={beanie.name}>
        <td>{beanie.name}</td>
        <td>{beanie.family}</td>
        <td>{beanie.animal}</td>
        <td><button className='add' onClick={() => addBeanie(beanie)}>Add</button></td>
        <td><button className='show' onClick={() => setBeanie(beanie)}>Show</button></td>
        <td><button className='delete' onClick={() => handleDelete(beanie)}>Delete</button></td>
      </tr>);
    })
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

  return(
    <div className='beanies'>
      <div className='newBeanie'><button onClick={() => setBeanie({isNew: true})}>New Beanie</button></div>
      <table className='beanies'>
        <thead>
          <tr className='tableHeader'>
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
