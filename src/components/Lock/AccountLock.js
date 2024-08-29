import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { mainContext } from 'reducer';

const AccountLock = () => {
    const { dispatch, state } = useContext(mainContext);
  const history = useHistory();

    const { theme } = state;
    const lockAccount = e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let NODE_URL = localStorage.getItem('NODE_URL')
            ? localStorage.getItem('NODE_URL')
            : 'http://localhost:5001';
        Cookies.remove(NODE_URL);
        history.push('/login');
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <button onClick={lockAccount} className="ml-2 round-btn theme-round-btn ">
            {theme === 'light' && <img src={require(`assets/img/lock.svg`).default} alt="" />}
            {theme === 'dark' && <img src={require(`assets/img/lock-dark.svg`).default} alt="" />}
        </button>
    );
};

export default AccountLock;
