import React, { useEffect, useContext, useState } from 'react';
import Emitter from 'utils/eventBus';
import { mainContext } from 'reducer';
import FilesStats from 'components/Stats/FilesStats.js';
import Endpoint from 'components/Login/Endpoint.js';
import SetPassword from 'components/Login/SetPassword.js';
import PasswordLogin from 'components/Login/PasswordLogin.js';
import { checkLoginPassword } from 'services/login.js';
import { LoginRoutes } from 'routes/index';

import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';


export default function Login(props) {
    const [isReset, setIsReset] = useState(false);
    const [endpoint, setEndpoint] = useState('');
    const [hasPassword, setHasPassword] = useState(true);
    // const { state } = useContext(mainContext);
    // const { theme } = state;
    // const query = new URLSearchParams(props.location.search);
    // const bucketDetail = Number(query.get('bucketDetail'));
    // const bucketName = query.get('bucketName');
    // const accessKeyId = query.get('accessKeyId');
    // const secretAccessKey = query.get('secretAccessKey');

    // const getEndpoint = ()=>{
    //     const NODE_URL = localStorage.getItem('NODE_URL');
    //     console.log(NODE_URL)
    //     // const isMainMode = await getPageMode();
    // }

    const checkLoginPassowrd = async () => {
        let res = await checkLoginPassword();
        if (res && res.Success) {
            setHasPassword(true);
        } else {
            // setHasPassword(false);
        }
    };

    const endpointChange = async (val) => {
        await checkLoginPassowrd();
        setEndpoint(val);
    };

    const lostPassword = ()=>{
        // setlostPassword
         // {!endpoint && <Endpoint />}
                // {endpoint && !hasPassword && <SetPassword endpoint={endpoint} isReset={isReset}/>}
                // {endpoint && hasPassword && <PasswordLogin  endpoint={endpoint} />}

    }

    useEffect(() => {
        // Emitter.on('handleEndpoint', endpointChange);
        // Emitter.on('handleLostPassword', lostPassword);
    }, []);

    return (
        <div className="flex">
            <div className="flex flex-1  justify-center items-center login-bg min-h-screen">
                <div className="flex justify-center items-center ">
                    <img src={require(`assets/img/login-img.png`).default} alt="" width={556} height={403} />
                </div>
            </div>
            <div className="flex flex-1 min-h-screen login-form  ">
                <Switch>
                {LoginRoutes.map(item => {
                  return (
                    <Route key={item.path} path={item.path} exact component={item.component} />
                  )
                })}
                <Redirect from="/login" to="/login/endpoint" />
              </Switch>
            </div>
        </div>
    );
}
