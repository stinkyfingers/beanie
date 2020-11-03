import React from 'react';
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
