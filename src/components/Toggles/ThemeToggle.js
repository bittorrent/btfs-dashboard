import React, {useContext} from "react";
import {mainContext} from 'reducer';

const ThemeToggle = () => {

  const {dispatch, state} = useContext(mainContext);
  const {theme} = state;

  const changeTheme = () => {
    let _theme = theme === 'light' ? 'dark' : 'light';
    dispatch({
      type: 'CHANGE_THEME',
      theme: _theme
    });
  };

  return (
      <>
        <div className={"block " + (theme === 'light' ? "text-blueGray-500" : "text-white")} href="#theme">
          <div className={"items-center flex justify-center md:justify-between"}>
            {theme === 'light' && <div className='cursor-pointer' onClick={changeTheme}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>}
            {theme === 'dark' && <div className='cursor-pointer' onClick={changeTheme}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </div>}
          </div>
        </div>
      </>
  );
};

export default ThemeToggle;


