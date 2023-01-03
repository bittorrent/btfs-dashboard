import React, { useState, useEffect } from 'react';

const ButtonSwitch = ({ current: currentProp, leftButtonProps, rightButtonProps }) => {
  const { text: textLeft, onClick: onClickLeft } = leftButtonProps;
  const { text: textRight, onClick: onClickRight } = rightButtonProps;
  const [current, setCurrent] = useState(currentProp);
  useEffect(() => {
    setCurrent(currentProp);
  }, [currentProp]);

  const handleClickLeft = () => {
    setCurrent('left');
    onClickLeft();
  };
  const handleClickRight = () => {
    setCurrent('right');
    onClickRight();
  };

  return (
    <div className={'p-0.5 rounded whitespace-nowrap theme-fill-gray'}>
      <button
        onClick={handleClickLeft}
        className={
          'mr-1 common-btn h-6 px-1 py-1 shadow-none hover:shadow-none theme-switch-btn' +
          (current === 'left' ? ' switch-btn-focused' : '')
        }>
        {textLeft}
      </button>
      <button
        onClick={handleClickRight}
        className={
          'common-btn h-6 px-1 py-1  theme-switch-btn shadow-none hover:shadow-none' +
          (current === 'right' ? ' switch-btn-focused' : '')
        }>
        {textRight}
      </button>
    </div>
  );
};

export default ButtonSwitch;
