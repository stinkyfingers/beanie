import React, {useEffect, useState, useContext} from 'react';
import UserContext from '../UserContext';
import { all } from '../api';

const Beanies = ({setBeanie}) => {
  const userState = useContext(UserContext);
  const [beanies, setBeanies] = useState([]);

  useEffect(() => {
    const allBeanies = async () => {
      try {
        const b = await all(userState.user.token);
        if (b.error) {
          console.warn(b.error) // TODO
          return;
        }
        setBeanies(b);
      } catch (err) {
        console.log(err)// TODO
      }
    }
    allBeanies()

  }, [beanies, userState.user.token]);

  const renderBeanies = () => {
    let out = [];
    beanies.map((beanie) => {
      return out.push(
      <tr key={beanie.name} className='beanie' onClick={() => setBeanie(beanie)}>
        <td>{beanie.name}</td>
        <td>{beanie.family}</td>
        <td>{beanie.animal}</td>
      </tr>);
    })
    return out;
  }
  return(
    <div className='beanies'>
      <table className='beanies'>
        <thead>
          <tr>
            <td>Name</td>
            <td>Family</td>
            <td>Animal</td>
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
