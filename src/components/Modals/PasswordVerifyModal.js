import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { loginValidate } from 'services/login';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import { getPrivateKey } from 'services/otherService.js';
import Cookies from 'js-cookie';


import { aseEncode } from 'utils/BTFSUtil';
let inputMaxLength = 100;

export default function PasswordVerifyModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [validateMsg, setValidateMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const inputRef = useRef(null);

    let callbackFn = null;
    useEffect(() => {
        const set = async function (params) {
            console.log('openDecryptFileModal event has occured');
            callbackFn = params.callbackFn;
            setValidateMsg('');
            setPassword('');
            setLoading(false);
            openModal();
        };
        Emitter.on('openPasswordVerifyModal', set);
        return () => {
            Emitter.removeListener('openPasswordVerifyModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setValidateMsg('');
        setPassword('');
        setLoading(false);
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const checkPassword = val => {
        const reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g;
        if (!val || reg.test(val)) {
            setValidateMsg('');
            return true;
        }
        if (!reg.test(val)) {
            setValidateMsg(t('password_validate_pattern'));
            return false;
        }
        setValidateMsg('');
        return true;
    };

    const passwordChange = vals => {
        const val = inputRef.current.value;
        setPassword(val);
        checkPassword(val);
    };

    const handleSubmit = async () => {
        if (!password) {
            setValidateMsg(t('password_validate_required'));
        }
        if (password && !checkPassword(password)) {
            setValidateMsg(t('password_validate_pattern'));
            return;
        }
        setLoading(true);
        let NODE_URL = localStorage.getItem('NODE_URL')
            ? localStorage.getItem('NODE_URL')
            : 'http://localhost:5001';
        let asePassowrd = aseEncode(password, NODE_URL);
        const token = Cookies.get(NODE_URL)
        try {
            let res = await loginValidate(asePassowrd,token);
            setLoading(false);
            if (res && res.Success) {
                callbackFn();
                closeModal()
            }else{
                setValidateMsg(t('password_error'))
                // Emitter.emit('showMessageAlert', { message: res.Text, status: 'error' });
            }
        } catch (e) {
            Emitter.emit('showMessageAlert', { message: e.Message, status: 'error' });
        }
    };

    const getPrivateKeyFn = async () => {
        let { privateKey } = await getPrivateKey();
        if (privateKey) {
          Emitter.emit('openMessageModal', { message: privateKey });
        } else {
          Emitter.emit('showMessageAlert', { message: 'api_not_set', status: 'error', type: 'frontEnd' });
        }
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center  theme-bg theme-text-main">
                    <div className="font-semibold  text-base"> {t('check_private_key')} </div>
                    <div className="text-xs font-medium mb-6 theme-text-desc pr-12">
                        {t('check_private_key_desc')}
                    </div>

                    <div className="flex justify-between w-full font-semibold mb-1">
                        <div>{t('check_private_key_input')}</div>
                    </div>
                    <input
                        type="password"
                        className="w-full h-3 common-input  theme-bg theme-border-color"
                        single="true"
                        placeholder={intl.formatMessage({ id: 'check_private_key_input_placeholder' })}
                        maxLength={inputMaxLength}
                        ref={inputRef}
                        onChange={passwordChange}
                        value={password}
                        readOnly={loading}
                    />
                    <div className="flex justify-between  w-full mt-2 ml-1 mb-4">
                        <span className="theme-text-error text-xs pt-1">{validateMsg}</span>
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button
                            className="ml-2 common-btn theme-fill-gray text-gray-900 mr-2"
                            onClick={closeModal}>
                            {t('cancel_encrypt_file_btn')}
                        </button>

                        <div className="ml-2 inline-block">
                            <Spin
                                spinning={loading}
                                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                                <button
                                    type="primary"
                                    className="common-btn theme-common-btn"
                                    onClick={handleSubmit}>
                                    {t('next')}
                                </button>
                            </Spin>
                        </div>
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}
