import React from 'react';
import '../css/error.css';

const Error = ({ msg }) => {
  if (!msg) msg = 'unknown error';
  msg = typeof(msg) === 'string' ? msg : msg.toString();
  return (
    <div className='error'>
      <div className='errorMessage'>
        {msg}
      </div>
    </div>
  );
};

export default Error;
