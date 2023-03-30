import React from 'react';

const ButtonConfirm = ({ event, valid, text, className }) => {
  return (
    <button
      className={'common-btn theme-common-btn ' + className}
      style={valid ? {} : { backgroundColor: '#e5e6eb', color: '#a1a7c4', cursor: 'not-allowed' }}
      type="button"
      disabled={!valid}
      onClick={event}>
      {text}
    </button>
  );
};

export default ButtonConfirm;
