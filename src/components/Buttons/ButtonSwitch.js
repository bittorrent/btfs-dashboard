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
    <div className={'rounded whitespace-nowrap theme-fill-gray'} style={{ padding: 3 }}>
      <button
        onClick={handleClickLeft}
        className={
          'mr-1 common-btn h-6 px-2 py-1 shadow-none hover:shadow-none theme-switch-btn' +
          (current === 'left' ? ' switch-btn-focused' : '')
        }
        style={{ borderRadius: 3 }}>
        {textLeft}
      </button>
      <button
        onClick={handleClickRight}
        className={
          'common-btn h-6 px-2 py-1 theme-switch-btn shadow-none hover:shadow-none' +
          (current === 'right' ? ' switch-btn-focused' : '')
        }
        style={{ borderRadius: 3 }}>
        {textRight}
      </button>
    </div>
  );
};

export default ButtonSwitch;
