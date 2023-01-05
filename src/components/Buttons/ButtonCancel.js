import React from 'react';

const ButtonCancel = ({ event, text, className }) => {
  return (
    <button className={'common-btn theme-danger-btn ' + className} type="button" onClick={() => event(false)}>
      {text}
    </button>
  );
};

export default ButtonCancel;
