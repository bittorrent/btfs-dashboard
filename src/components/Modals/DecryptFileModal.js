import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { decryptUploadFiles } from 'services/filesService.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';

let inputMaxLength = 80;

export default function EncryptFileModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [cId, setCId] = useState('');
    const [validateMsg, setValidateMsg] = useState('');
    const [loading, setLoadign] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const set = async function (params) {
            console.log('openDecryptFileModal event has occured');
            setCId('');
            setValidateMsg('');
            setLoadign(false);
            openModal();
        };
        Emitter.on('openDecryptFileModal', set);
        return () => {
            Emitter.removeListener('openDecryptFileModal');
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
        setLoadign(false);
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const validateHostId = val => {
        let reg = /^[A-Za-z0-9]+$/;
        if (!val || reg.test(val)) {
            setValidateMsg('');
            return true;
        }
        if (!reg.test(val)) {
            setValidateMsg(t('decrypt_file_cid_validate'));
        }
        return false;
    };

    const cidChange = vals => {
        const val = inputRef.current.value;
        setCId(val);
        validateHostId(val);
    };

    const DecryptFile = async () => {
        if (cId && !validateHostId(cId)) {
            setValidateMsg(t('decrypt_file_cid_validate'));
            return;
        }

        if (!cId) {
            setValidateMsg(t('decrypt_file_cid_null_validate'));
            return;
        }

        setLoadign(true);
        try {
            let data = await decryptUploadFiles(cId);
            setLoadign(false);
            if (data.Type && data.Type === 'error') {
                Emitter.emit('showMessageAlert', { message: data.Message, status: 'error' });
                return;
            }
            Emitter.emit('showMessageAlert', {
                message: 'encrypt_import_success',
                status: 'success',
                type: 'frontEnd',
            });
        } catch (e) {
            Emitter.emit('showMessageAlert', { message: e.Message, status: 'error' });
        }
        closeModal();
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center items-center theme-bg theme-text-main">
                    <div className="font-semibold  text-xl"> {t('decrypt_upload_file')} </div>
                    <div className="text-xs font-medium mb-6 theme-text-sub-info">
                        {t('decrypt_upload_file_desc')}
                    </div>

                    <div className="flex justify-between w-full font-semibold mb-3">
                        <div>{t('dncrypt_file_cid')}</div>
                    </div>
                    <input
                        id="file-input"
                        type="input"
                        className="w-full h-3 common-input  theme-bg theme-border-color"
                        single="true"
                        placeholder={intl.formatMessage({ id: 'decrypt_input_cid_placeholder' })}
                        maxLength={inputMaxLength}
                        ref={inputRef}
                        onChange={cidChange}
                        value={cId}
                    />
                    <div className="flex justify-between  w-full  mb-4">
                        <span className="theme-text-error text-xs pt-1">{validateMsg}</span>
                        {
                            // <span>
                            //     {cId.length || 0}/{inputMaxLength}
                            // </span>
                        }
                    </div>
                    <div className="mt-2">
                        <button
                            className="ml-2 common-btn theme-fill-gray text-gray-900 mr-6"
                            onClick={closeModal}>
                            {t('cancel_encrypt_file_btn')}
                        </button>

                        <div className="ml-2 inline-block">
                            <Spin
                                spinning={loading}
                                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                                <button
                                    type="primary"
                                    className="ml-2 common-btn theme-common-btn"
                                    onClick={DecryptFile}>
                                    {t('decrypt_file_btn')}
                                </button>
                            </Spin>
                        </div>
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}
