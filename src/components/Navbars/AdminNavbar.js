import React, { useCallback, useContext } from 'react';
import { mainContext } from 'reducer';

export default function AdminNavbar({ color }) {
  const { dispatch, state } = useContext(mainContext);
  const { sidebarShow } = state;

  const sidebarToggle = useCallback(() => {
    dispatch({
      type: 'CHANGE_SIDEBAR',
      sidebarShow: true,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="hidden top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start md:flex items-center ">
      <button
        className={'ml-2 cursor-pointer theme-toggle-btn' + (!sidebarShow ? ' absolute mt-14' : ' hidden')}
        style={{ outline: 'none' }}
        onClick={sidebarToggle}>
        <i className="fas fa-indent " style={{ fontSize: '24px', float: 'left' }}></i>
      </button>
    </nav>
  );
}
