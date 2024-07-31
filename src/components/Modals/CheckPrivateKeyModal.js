import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { decryptUploadFiles } from 'services/filesService.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Radio, Select } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import isIPFS from 'is-ipfs';
import { DECRYPT_FILE_TIME_OUT_LIST } from 'utils/constants.js';

const { Option } = Select;


const options = [
    { label: 'decrypt_file_with_host', value: 'host' },
    { label: 'decrypt_file_with_password', value: 'password' },
];
let inputMaxLength = 100;

export default function CheckPrivateKeyModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [cId, setCId] = useState('');
    const [hostId, setHostId] = useState('');
    const [validateMsg, setValidateMsg] = useState('');
    const [validateHostIdMsg, setValidateHostIdMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [filetimeout, setFiletimeout] = useState(30);
    const [decryptType, setDecryptType] = useState('host');
    const [password, setPassword] = useState('');
    const [validateKeyMsg, setValidateKeyMsg] = useState('');
    const inputRef = useRef(null);
    const inputHostIdRef = useRef(null);
    const inputKeyRef = useRef(null);

    useEffect(() => {
        const set = async function (params) {
            console.log('openDecryptFileModal event has occured');
            setCId('');
            setValidateMsg('');
            setPassword('');
            setHostId('');
            setValidateHostIdMsg('');
            setLoading(false);
            openModal();
        };
        Emitter.on('openCheckPrivateKeyModal', set);
        return () => {
            Emitter.removeListener('openCheckPrivateKeyModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setCId('');
        setValidateMsg('');
        setPassword('');
        setValidateHostIdMsg('');
        setHostId('');
        setLoading(false);
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const validateHostId = val => {
        // let reg = /^[A-Za-z0-9]+$/;
        let res = isIPFS.cid(val);
        // console.log(val,res,'-----')
        if (!val || res) {
            setValidateMsg('');
            return true;
        }
        // if (!reg.test(val)) {
        //     setValidateMsg(t('decrypt_file_cid_validate'));
        // }
        if (!res) {
            setValidateMsg(t('decrypt_file_cid_validate'));
        }
        return false;
    };

    const checkPassword = val => {
        const reg = /^[0-9A-Za-z]{6,20}$/g;
        if (!val || reg.test(val)) {
            setValidateKeyMsg('');
            return true;
        }
        if (!reg.test(val)) {
            setValidateKeyMsg(t('validate_encryptkey'));
            return false;
        }
        setValidateKeyMsg('');
        return true;
    };
    const validateDecryptHostId = val => {
        let reg = /^[A-Za-z0-9]+$/;
        if (!val || reg.test(val)) {
            setValidateHostIdMsg('');
            return true;
        }
        if (!reg.test(val)) {
            setValidateHostIdMsg(t('decrypt_file_hostId_validate'));
            return false;
        }
        return true;
    };

    const cidChange = vals => {
        const val = inputRef.current.value;
        setCId(val);
        validateHostId(val);
    };

    const hostIdChange = vals => {
        const val = inputHostIdRef.current.value;
        setHostId(val);
        validateDecryptHostId(val);
    };

    const passwordChange = vals => {
        const val = inputKeyRef.current.value;
        setPassword(val);
        checkPassword(val);
    };

    const DecryptFile = async () => {
        if (!validateDecryptHostId(hostId)) {
            return;
        }
        if (cId && !validateHostId(cId)) {
            setValidateMsg(t('decrypt_file_cid_validate'));
            return;
        }

        if (!cId) {
            setValidateMsg(t('decrypt_file_cid_null_validate'));
            return;
        }

        if (decryptType === 'password' && password === '') {
            setValidateKeyMsg(t('validate_decryptkey_null'));
            return;
        }

        if (decryptType === 'password' && !checkPassword(password)) {
            return;
        }

        setLoading(true);
        try {
            await decryptUploadFiles(cId, hostId, password);
            setLoading(false);
            Emitter.emit('showMessageAlert', {
                message: 'decrypt_download_success',
                status: 'success',
                type: 'frontEnd',
            });
        } catch (e) {
            Emitter.emit('showMessageAlert', { message: e.Message, status: 'error' });
        }
        closeModal();
    };
    const onChange = e => {
        setDecryptType(e.target.value);
    };


    const handleChange = value => {
        setFiletimeout(value)
    }


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
                        // id="file-input"
                        type="input"
                        className="w-full h-3 common-input  theme-bg theme-border-color"
                        single="true"
                        placeholder={intl.formatMessage({ id: 'check_private_key_input_placeholder' })}
                        maxLength={inputMaxLength}
                        ref={inputRef}
                        onChange={cidChange}
                        value={cId}
                        readOnly={loading}
                    />
                    <div className="flex justify-between  w-full  mb-4">
                        <span className="theme-text-error text-xs pt-1">{validateMsg}</span>
                        {
                            // <span>
                            //     {cId.length || 0}/{inputMaxLength}
                            // </span>
                        }
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
                                    onClick={DecryptFile}>
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
