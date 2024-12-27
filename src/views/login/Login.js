/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import Emitter from 'utils/eventBus';

import { mainContext } from 'reducer';
import Endpoint from 'components/Login/Endpoint.js';
import SetPassword from 'components/Login/SetPassword.js';
import PasswordLogin from 'components/Login/PasswordLogin.js';
import MessageAlert from 'components/Alerts/MessageAlert';
import MessageNotification from 'components/Alerts/MessageNotification';
import { checkLoginPassword } from 'services/login.js';
import { getHostConfigData } from 'services/otherService.js';
import { useLocation } from 'react-router-dom';
import { getParameterByName } from 'utils/BTFSUtil.js';
import { urlCheck } from 'utils/checks.js';
import LangDropdown from 'components/Dropdowns/LangDropdown.js';
import ThemeToggle from 'components/Toggles/ThemeToggle';
import { t } from 'utils/text.js';

export default function Login(props) {
    const location = useLocation();
    const { state } = useContext(mainContext);
    const { theme } = state;
    const back = location.state?.back || false;
    const [isReset, setIsReset] = useState(false);
    const [endpoint, setEndpoint] = useState('');
    const [hasPassword, setHasPassword] = useState(back);
    const [loading, setLoading] = useState(false);

    const endpointChange = async val => {
        if (loading) return;
        setLoading(true);
        try {
            let res = await checkLoginPassword(val);
            setLoading(false);
            if (!res || res.Type === 'error') {
                Emitter.emit('showMessageAlert', { message: res.Message || 'error', status: 'error' });
                return;
            }
            let enableTokenAuth = await getHostConfig();

            if (!enableTokenAuth) {
                Emitter.emit('showMessageNotification', {
                    message: 'enable_token_auth_msg',
                    status: 'error',
                    type: 'frontEnd',
                });
                return;
            }
            setEndpoint(val);
            if (res && res.Success) {
                setHasPassword(true);
                return;
            }
            if (res && !res.Success) {
                setHasPassword(false);
                return;
            }
        } catch (error) {
            Emitter.emit('showMessageAlert', {
                message: 'node_not_connected',
                status: 'error',
                type: 'frontEnd',
            });
        }
    };

    const getHostConfig = async () => {
        try {
            const res = await getHostConfigData();
            const EnableTokenAuth = res?.API?.EnableTokenAuth;
            if (EnableTokenAuth) {
                return EnableTokenAuth;
            } else {
                Emitter.emit('showMessageNotification', {
                    message: 'enable_token_auth_msg',
                    status: 'error',
                    type: 'frontEnd',
                });
            }
        } catch (error) {}
    };

    const lostPassword = () => {
        setIsReset(true);
    };

    const show = () => {
        setIsReset(false);
        setHasPassword(true);
    };

    const resetEndpiont = () => {
        setEndpoint('');
    };

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
        // document.documentElement.classList.remove('dark');、
        init();
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
        <div className="flex theme-bg flex-col md:flex-row min-h-screen">
            <div className={'flex justify-between p-4 md:hidden'}>
                {
                    //     <button
                    //     className="theme-round-btn px-2 py-1 rounded border md:hidden"
                    //     type="button"
                    //     // onClick={() => setCollapseShow(' m-2 py-3 px-6 ')}
                    //     >
                    //     <i className="fas fa-bars"></i>
                    // </button>
                }

                <div className={'flex justify-between'}>
                    <div className="items-center flex">
                        <img
                            className="inline-block"
                            src={require('assets/img/btfs_logo.png').default}
                            style={{ width: '37px', height: '40px' }}
                            alt="btfs_logo"
                        />
                        <span className="theme-text-main pr-1">BTFS Dashboard</span>
                        <span className="theme-text-base"> 3.0</span>
                    </div>
                </div>
                <ul className="items-center flex flex-wrap list-none">
                    <li className="inline-block relative">
                        <LangDropdown
                        // color={theme}
                        />
                    </li>
                </ul>
            </div>

            <div className="flex flex-1  items-center flex-col login-bg md:min-h-full justify-between">
                <div className="flex justify-start md:min-w-full ">
                    <div
                        className={`pl-8 pt-4 inline-block text-left mr-0  whitespace-nowrap text-sm font-bold px-0`}
                        to="/">
                        <img
                            className="inline-block"
                            src={require('assets/img/btfs_logo.png').default}
                            style={{ width: '37px', height: '40px' }}
                            alt="btfs_logo"
                        />
                        <span className="theme-text-main ">BTFS Dashboard</span>
                        <span className="theme-text-base"> 3.0</span>
                    </div>
                </div>
                <div className="flex w-full login-placeholder">

                </div>
                <div className="flex  flex-auto justify-center items-center  ">
                    <div className="flex justify-center items-center ">
                        <img
                            src={
                                require(`assets/img/login-img${theme === 'dark' ? '-dark' : ''}.png`).default
                            }
                            alt=""
                            width={556}
                            height={403}
                        />
                    </div>
                </div>
                <ul className=" flex md:flex-col md:min-w-full flex-col list-none mb-2 justify-start pl-8 ">
                    <li className="items-center">
                        <span className={'login-link theme-sidebar-link'}>{t('version')} 3.2.0</span>
                    </li>

                    <li className="items-center">
                        <a
                            className={'login-link theme-sidebar-link'}
                            href="https://docs.btfs.io/docs/btfs-dashboard"
                            target="_blank"
                            rel="noreferrer">
                            {t('read_doc')}
                        </a>
                    </li>
                    <li className="items-center">
                        <a
                            className={'login-link theme-sidebar-link'}
                            href="https://github.com/bittorrent/btfs-dashboard"
                            target="_blank"
                            rel="noreferrer">
                            {t('view_code')}
                        </a>
                    </li>

                    <li className="items-center">
                        <a
                            className={'login-link theme-sidebar-link'}
                            href="https://github.com/bittorrent/btfs-dashboard/issues"
                            target="_blank"
                            rel="noreferrer">
                            {t('report_bugs')}
                        </a>
                    </li>

                    <li className="items-center">
                        <a
                            className={'login-link theme-sidebar-link'}
                            href="https://docs.google.com/forms/d/e/1FAIpQLSeH1Vhm4C6tcsI80gLzUQ58cuYtMHj3LEQFx_STAqWNoCP3Ew/viewform"
                            target="_blank"
                            rel="noreferrer">
                            {t('contact_us')}
                        </a>
                    </li>
                </ul>
                <div className="flex w-full justify-start pl-8" style={{ flex: '0 0 60px' }}>
                    <ThemeToggle />
                    <LangDropdown />
                </div>
            </div>
            <div className="flex flex-1 login-form md:min-h-screen">
                {!endpoint && <Endpoint />}
                {((endpoint && !hasPassword) || isReset) && (
                    <SetPassword endpoint={endpoint} isReset={isReset} />
                )}
                {endpoint && hasPassword && !isReset && <PasswordLogin endpoint={endpoint} />}
            </div>
            <MessageAlert />
            <MessageNotification />
        </div>
    );
}
