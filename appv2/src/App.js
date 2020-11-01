import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Context from './Context';
import Router from './Router';
import Login from './components/Login'
import Family from './components/Family';

const App = () => {
  const [state, setState] = React.useState({
    user: JSON.parse(localStorage.getItem('user')) || null,
    family: localStorage.getItem('family') || 'Beanie Boos'
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Context.Provider value={{ state, setState }}>
          <Login />
          <Family />
          <Router />
        </Context.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
