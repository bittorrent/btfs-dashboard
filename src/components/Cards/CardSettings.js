import React, { useState, useRef, useEffect, useContext } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { mainContext } from 'reducer';
import Emitter from 'utils/eventBus';

import { nodeStatusCheck, getPrivateKey, getRepo, setApiUrl } from 'services/otherService.js';
import { t } from 'utils/text.js';
import { urlCheck } from 'utils/checks.js';
import PathConfirmModal from 'components/Modals/PathConfirmModal.js';
import LogoutConfirmModal from 'components/Modals/LogoutComfirmModal';
import CardConfig from './CardConfig';
import ConfigConfirmModal from 'components/Modals/ConfigConfirmModal';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import S3CardConfig from './S3CardConfig';
import { getParameterByName } from 'utils/BTFSUtil.js';
import { MAIN_PAGE_MODE } from 'utils/constants';


export default function CardSettings({ color }) {
    const apiUrl = getParameterByName('api', window.location.href);
    let NODE_URL = localStorage.getItem('NODE_URL')
        ? localStorage.getItem('NODE_URL')
        : 'http://localhost:5001';
    if (apiUrl && urlCheck(apiUrl) && NODE_URL !== apiUrl) {
        setApiUrl(apiUrl);
        NODE_URL = apiUrl;
    }
    const inputRef = useRef(null);
    const { state } = useContext(mainContext);
    const { pageMode } = state;
    const pathRef = useRef(null);
    const [path, setPath] = useState('');
    const [volume, setVolume] = useState(0);
    const isMainMode = MAIN_PAGE_MODE === pageMode;

    useEffect(() => {
        if (apiUrl) {
            nodeStatusCheck(apiUrl, isMainMode);
        }
        inputRef.current.value = NODE_URL;
        getPath();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getCopyUrl = nodeUrl => {
        const curUrl = document.location.href;
        const splitUrlList = curUrl.split('?');
        const copyUrl = `${splitUrlList[0]}?api=${nodeUrl}`;
        return copyUrl;
    };
    const copyUrl = getCopyUrl(NODE_URL);
    const reveal = async () => {
        // e.preventDefault();s
        Emitter.emit('openPasswordVerifyModal', { callbackFn: getPrivateKeys });
    };

    const getPrivateKeys = async () => {
        let { privateKey } = await getPrivateKey();
        if (privateKey) {
            Emitter.emit('openMessageModal', { message: privateKey });
        } else {
            Emitter.emit('showMessageAlert', { message: 'api_not_set', status: 'error', type: 'frontEnd' });
        }
    };
    const changePassowrd = async () => {
        // e.preventDefault();
        Emitter.emit('openChangePasswordModal');
    };

    const getPath = async () => {
        let { path, size } = await getRepo();
        setPath(path);
        setVolume(size);
    };

    const handleLogout = async () => {
        Emitter.emit('openLogoutConfirmModal', {});
    };

    const changePath = async e => {
        console.log('pathRef.current.value', pathRef.current.value);
        Emitter.emit('openPathConfirmModal', { type: 'init', path: pathRef.current.value, volume: volume });
    };

    const handleChange = () => {
        // const node_url = getNodeUrl();
        // if (!node_url) return;
        // const copyUrl = getCopyUrl(node_url);
        // setCopyUrl(copyUrl);
    };

    return (
        <div>
            {/* api end point */}
            <div className="mb-4 common-card theme-bg theme-text-main">
                <div className="mb-2 setting-header">
                    <h5 className="font-bold theme-text-main" htmlFor="grid-password">
                        API {t('endpoint')}
                    </h5>
                    <div className="input-group-append">
                        <ClipboardCopy value={copyUrl} btnText={t('copy_url')}></ClipboardCopy>
                    </div>
                    <Tooltip
                        overlayInnerStyle={{ width: '180px' }}
                        placement="top"
                        title={<p>{t('copy_url_tips')}</p>}>
                        {/* <i className="far fa-question-circle ml-1 text-xs"></i> */}
                        <QuestionCircleOutlined className="inline-flex items-center ml-1 text-xs" />
                    </Tooltip>
                </div>
                <div className="flex">
                    <input
                        type="text"
                        className="mr-2 common-input theme-text-desc theme-base-bg border-none"
                        defaultValue="http://localhost:5001"
                        ref={inputRef}
                        onChange={handleChange}
                        disabled
                    />
                    <button className="ml-2 common-btn theme-common-btn" type="button" onClick={handleLogout}>
                        {t('logout')}
                    </button>
                </div>
            </div>

            {/* advanced settings */}
            {isMainMode && <CardConfig color={color} />}

            {/* storage path */}
            <div className="mb-4 common-card theme-bg theme-text-main">
                <div className="mb-2 setting-header">
                    <h5 className="font-bold theme-text-main">{t('storage_path')}</h5>
                </div>
                <div className="flex justify-between">
                    <input
                        type="text"
                        className="common-input theme-bg theme-border-color"
                        defaultValue={path}
                        ref={pathRef}
                    />
                    <button className="ml-2 common-btn theme-common-btn" type="button" onClick={changePath}>
                        {t('change')}
                    </button>
                </div>
            </div>

            {/* security */}
            <div className="mb-4 common-card theme-bg theme-text-main">
                <div className="mb-2 setting-header">
                    <h5 className="font-bold theme-text-main">{t('security')}</h5>
                </div>
                <div className="flex justify-between mb-2">
                    <div className="px-3.5 w-full h-9  rounded-lg flex items-center block text-xs font-bold leading-none transition-all  theme-bg ">
                        <span>{t('setting_login_password')}</span>
                    </div>
                    <button
                        className="ml-2 common-btn theme-common-btn"
                        type="button"
                        onClick={changePassowrd}
                        style={{ minWidth: 'auto' }}>
                        {t('setting_login_password_btn')}
                    </button>
                </div>
                <div className="flex justify-between">
                    <div className="px-3.5 w-full h-9  rounded-lg flex items-center block text-xs font-bold leading-none transition-all  theme-bg ">
                        <span>{t('private_key')}</span>
                    </div>
                    <button
                        className="ml-2 common-btn theme-danger-btn"
                        type="button"
                        onClick={reveal}
                        style={{ minWidth: 'auto' }}>
                        {t('reveal_key')}
                    </button>
                </div>
            </div>

            {/* s3 api config */}
            <S3CardConfig />

            <PathConfirmModal />
            <ConfigConfirmModal />
            <LogoutConfirmModal />
        </div>
    );
}
