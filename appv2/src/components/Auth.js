import React from 'react';
import { decode } from 'jsonwebtoken';
import Context from '../Context';
import Login from './Login';
import Logout from './Logout';
import Password from './Password';
import '../css/auth.css';


const Auth = () => {
  const { state, setState } = React.useContext(Context);
  const [mode, setMode] = React.useState(state.user ? 'logout' : 'login');
  const [element, setElement] = React.useState();

  React.useEffect(() => {
    switch (mode) {
      case 'password':
        setElement(<Password handleBackToLogin={() => setMode('login')} />);
        break;
      default:
        if (state.user) {
          // jwt expired
          if (!state?.user?.token || ((decode(state.user.token).exp) < (new Date() / 1000))) {
            setState(state => ({ user: null }));
          }
          setElement(<Logout />);
        } else {
          setElement(<Login handleForgotPassword={() => setMode('password')} />);
        }
    };
  }, [mode, state.user]);

  return (
    <div className='login'>
      {element}
    </div>
  );
};

export default Auth;
