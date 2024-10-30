import React from 'react';
//  { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
// import { mainContext } from 'reducer';
// import Emitter from 'utils/eventBus';


const AccountLock = () => {
    // const { state } = useContext(mainContext);
  const history = useHistory();

    // const { theme } = state;
    const lockAccount = e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let NODE_URL = localStorage.getItem('NODE_URL')
            ? localStorage.getItem('NODE_URL')
            : 'http://localhost:5001';
        Cookies.remove(NODE_URL);
        history.push({pathname:'/login',state:{back:true}});
    };

    // useEffect(() => {
    //     if (theme === 'dark') {
    //         document.documentElement.classList.add('dark');
    //     } else {
    //         document.documentElement.classList.remove('dark');
    //     }
    // }, [theme]);

    return (
        <button onClick={lockAccount} className="ml-2 round-btn theme-round-btn account-lock">
            <img  className="lock-img" src={require(`assets/img/lock.svg`).default} alt="" />
            <img  className="lock-img-hover " src={require(`assets/img/lock-dark.svg`).default} alt="" />
            {//theme === 'dark' && <img src={require(`assets/img/lock-dark.svg`).default} alt="" />
                }
        </button>
    );
};

export default AccountLock;
