import React, { useState } from 'react';
import Login from './components/Login';
import UserContext from './UserContext';
import { Router, Nav } from './Router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {

  const useUser = () => {
     const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
     return {user, setUser}
  }
  const userState = useUser();

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={userState}>
          <header className="App-header">
            <Login />
            <Nav />
          </header>

          <Router />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
