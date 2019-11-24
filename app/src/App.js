import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import UserContext from './UserContext';
import BeanieContext from './BeanieContext';
import { Router } from './Router';
import { BrowserRouter } from 'react-router-dom';
import { getFamily } from './api';
import './App.css';

function App() {
  const [family, setFamily] = useState(localStorage.getItem('family') || 'Beanie Babies');

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

  useEffect(() => {
    const allBeanies = async () => {
      if (!userState.user) return;
      try {
        const b = await getFamily(userState.user.token, family);
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
  }, [family]);

  const renderFamilies = () => (
    <div className='families'>
      <select value={family} onChange={(e) => {localStorage.setItem('family', e.target.value); setFamily(e.target.value)}}>
        <option value='Beanie Babies'>Beanie Babies</option>
        <option value='Beanie Babies 2.0'>Beanies 2.0</option>
        <option value='Beanie Boos'>Beanie Boos</option>
      </select>
    </div>
  );


  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={userState}>
          <BeanieContext.Provider value={beanieState}>
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
          </BeanieContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
