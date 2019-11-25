import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import UserContext from './UserContext';
import BeanieContext from './BeanieContext';
import FamilyContext from './FamilyContext';
import { Router } from './Router';
import { BrowserRouter } from 'react-router-dom';
import { getFamily } from './api';
import './App.css';

function App() {
  const useUser = () => {
     const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
     return {user, setUser};
  }
  const userState = useUser();

  const useBeanies = () => {
    const [beanies, setBeanies] = useState([]);
    return {beanies, setBeanies}
  }
  const beanieState = useBeanies();

  const useFamily = () => {
    const [family, setFamily] = useState(localStorage.getItem('family') || 'Beanie Babies');
    return {family, setFamily}
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
        beanieState.setBeanies(b);
      } catch (err) {
        console.log(err)// TODO
      }
    }
    allBeanies();
    return beanieState.setBeanies(null);;
  }, [userState.user, familyState.family]);

  const renderFamilies = () => (
    <div className='families'>
      <select value={familyState.family} onChange={(e) => {localStorage.setItem('family', e.target.value); familyState.setFamily(e.target.value)}}>
        <option value='Beanie Babies'>Beanie Babies</option>
        <option value='Beanie Babies 2.0'>Beanies 2.0</option>
        <option value='Beanie Boos'>Beanie Boos</option>
        <option value='Beanie Fashion'>Beanie Fashion</option>
      </select>
    </div>
  );


  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={userState}>
          <BeanieContext.Provider value={beanieState}>
            <FamilyContext.Provider value={familyState}>
              <header className="App-header">
                {renderFamilies()}
                <div className='name'>
                  <h1>Beanie Central</h1>
                </div>
                <div className='nav'>
                  <Login />
                </div>
              </header>
              <Router />
            </FamilyContext.Provider>
          </BeanieContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
