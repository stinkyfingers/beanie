import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import BeanieContext from './BeanieContext';
import BeaniesContext from './BeaniesContext';
import FamilyContext from './FamilyContext';
import { Router } from './Router';
import { BrowserRouter } from 'react-router-dom';
import { getFamily } from './api';
import Header from './components/Header';
import './App.css';

function App() {
  const useUser = () => {
     const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
     return {user, setUser};
  }
  const userState = useUser();

  const useBeanies = () => {
    const [beanies, setBeanies] = useState([]);
    return {beanies, setBeanies};
  }
  const beaniesState = useBeanies();
  const setBeanieState = beaniesState.setBeanies;

  const useBeanie = () => {
    const [beanie, setBeanie] = useState(null);
    return {beanie, setBeanie};
  }
  const beanieState = useBeanie();

  const useFamily = () => {
    const [family, setFamily] = useState(localStorage.getItem('family') || 'Beanie Babies');
    return {family, setFamily};
  }
  const familyState = useFamily();

  useEffect(() => {
    const allBeanies = async () => {
      if (!userState.user) return;
      try {
        const b = await getFamily(userState.user.token, familyState.family);
        if (b.error) {
          console.warn(b.error) // TODO
          return;
        }
        setBeanieState(b);
      } catch (err) {
        console.log(err)// TODO
      }
    }
    allBeanies();
    return setBeanieState(null);;
  }, [userState.user, familyState.family, setBeanieState]);


  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={userState}>
          <BeaniesContext.Provider value={beaniesState}>
            <BeanieContext.Provider value={beanieState}>
              <FamilyContext.Provider value={familyState}>
                <Header />
                <Router />
              </FamilyContext.Provider>
            </BeanieContext.Provider>
          </BeaniesContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
