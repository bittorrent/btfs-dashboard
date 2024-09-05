import React, { useEffect, useState } from 'react';
import Emitter from 'utils/eventBus';
import Endpoint from 'components/Login/Endpoint.js';
import SetPassword from 'components/Login/SetPassword.js';
import PasswordLogin from 'components/Login/PasswordLogin.js';
import MessageAlert from 'components/Alerts/MessageAlert';
import { checkLoginPassword } from 'services/login.js';
import { useLocation } from 'react-router-dom';
import { getParameterByName } from 'utils/BTFSUtil.js';
import { urlCheck } from 'utils/checks.js';

export default function Login(props) {
    const location = useLocation();
    const back = location.state?.back || false
    const [isReset, setIsReset] = useState(false);
    const [endpoint, setEndpoint] = useState('');
    const [hasPassword, setHasPassword] = useState(back);
    const [loading, setLoading] = useState(false);
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

    const endpointChange = async val => {

        if (loading) return;
        setLoading(true);
        try {
            let res = await checkLoginPassword(val);
            setLoading(false);
            if (res.Type === 'error') {
                Emitter.emit('showMessageAlert', { message: res.Message || 'error', status: 'error' });
                return;
            }
            setEndpoint(val);
            if (res && res.Success) {
                setHasPassword(true);
            } else if (res && !res.Success) {
                setHasPassword(false);
            }
        } catch (error) {
            Emitter.emit('showMessageAlert', {
                message: 'node_not_connected',
                status: 'error',
                type: 'frontEnd',
            });
        }
    };

    const lostPassword = () => {
        setIsReset(true);
    };

    const show = () => {
        setIsReset(false);
        setHasPassword(true);
    };

    const resetEndpiont = ()=>{
        setEndpoint('')
    }

    const init = () => {
        if (!back) return;
        const apiUrl = getParameterByName('api', window.location.href);
        let NODE_URL = localStorage.getItem('NODE_URL')
            ? localStorage.getItem('NODE_URL')
            : 'http://localhost:5001';
        if (apiUrl && urlCheck(apiUrl) && NODE_URL !== apiUrl) {
            NODE_URL = apiUrl;
        }
        setEndpoint(NODE_URL);
        setHasPassword(true);

    };
    useEffect(() => {
        Emitter.on('handleEndpoint', endpointChange);
        Emitter.on('handleLostPassword', lostPassword);
        Emitter.on('showPasswordLogin', show);
        Emitter.on('showEndpoint', resetEndpiont);
        // Emitter.on('handleLostPassword', lostPassword);
        document.documentElement.classList.remove('dark');
        init()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            Emitter.removeListener('handleEndpoint');
            Emitter.removeListener('handleLostPassword');
            Emitter.removeListener('showEndpoint');
            Emitter.removeListener('showPasswordLogin');
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex">
            <div className="flex flex-1  justify-center items-center login-bg min-h-screen">
                <div className="flex justify-center items-center ">
                    <img src={require(`assets/img/login-img.png`).default} alt="" width={556} height={403} />
                </div>
            </div>
            <div className="flex flex-1 min-h-screen login-form  ">
                {!endpoint && <Endpoint />}
                {((endpoint && !hasPassword) || isReset) && (
                    <SetPassword endpoint={endpoint} isReset={isReset} />
                )}
                {endpoint && hasPassword && !isReset && <PasswordLogin endpoint={endpoint} />}
            </div>
            <MessageAlert />
        </div>
    );
}
