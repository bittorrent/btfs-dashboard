import React from 'react';

const Divider = ({className}) => {
  const _className = 'w-full theme-divider';
  return <div className={`${_className} ${className || ''}`} style={{ height: 1 }}></div>;
};

export default Divider;
