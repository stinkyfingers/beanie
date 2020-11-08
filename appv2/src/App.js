import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryCacheProvider, QueryCache } from 'react-query';
import Context from './Context';
import Router from './Router';
import Auth from './components/Auth'
import Family from './components/Family';
import Footer from './components/Footer';
import './css/app.css';

const App = () => {
  const [state, setState] = React.useState({
    user: JSON.parse(localStorage.getItem('user')) || null,
    family: localStorage.getItem('family') || 'Beanie Boos'
  });
  const queryCache = new QueryCache();

  return (
    <div className='master'>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <BrowserRouter>
          <Context.Provider value={{ state, setState }}>
            <div className='app'>
              <Family />
              <Router />
              <Auth />
            </div>
            <Footer />
          </Context.Provider>
        </BrowserRouter>
      </ReactQueryCacheProvider>
    </div>
  );
};

export default App;
