import React, { useContext } from 'react';
import { mainContext } from 'reducer';

const ThemeToggle = () => {
    const { dispatch, state } = useContext(mainContext);
    const { theme } = state;

    const changeTheme = e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let _theme = theme === 'light' ? 'dark' : 'light';
        window.theme = _theme;
        localStorage.setItem('theme', _theme);
        dispatch({
            type: 'CHANGE_THEME',
            theme: _theme,
        });
        if (_theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <button onClick={changeTheme} className="round-btn theme-round-btn">
            {theme === 'light' && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            )}
            {theme === 'dark' && (
                <i className='iconfont BTFS_icon_sun' style={{ fontSize: 20 }} />
            )}
        </button>
    );
};

export default ThemeToggle;
