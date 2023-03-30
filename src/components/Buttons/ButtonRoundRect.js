import React from 'react';

const ButtonRoundRect = ({ text, onClick, className }) => {
  return (
    <button className={'mr-2 round-rect-btn theme-copy-btn ' + className} type="button" onClick={onClick}>
      <span>{text}</span>
      <span className="ml-2 text-xs">
        <i className="fa-solid fa-angle-right"></i>
      </span>
    </button>
  );
};

export default ButtonRoundRect;
