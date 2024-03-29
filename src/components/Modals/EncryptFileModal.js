import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { encryptUploadFiles } from 'services/filesService.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Switch, Spin, Progress } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';

let filesInput = null;
let inputMaxLength = 100;

export default function EncryptFileModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [fileName, setFileName] = useState('');
    const [hostId, setHostId] = useState('');
    const [validateMsg, setValidateMsg] = useState('');
    const inputRef = useRef(null);
    const [checkHostId, setCheckHostId] = useState(false);
    const [currentFile, setCurrentFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [validateFileMsg, setValidateFileMsg] = useState('');
    const [percentage, setPercentage] = useState(0);

    const init = () => {
        setHostId('');
        setFileName('');
        setCurrentFile('');
        setValidateMsg('');
        setValidateFileMsg('');
        setPercentage(0);
        setLoading(false);
        setCheckHostId(false);
    };
    useEffect(() => {
        const set = async function (params) {
            console.log('openEncryptFileModal event has occured');
            init();
            openModal();
        };
        Emitter.on('openEncryptFileModal', set);
        return () => {
            Emitter.removeListener('openEncryptFileModal');
            window.body.style.overflow = '';
        };
    }, []);

    const submitValidate = () => {
        if (!currentFile) {
            setValidateFileMsg(t('encrypt_file_select_validate'));
            return false;
        }

        if (checkHostId && !hostId) {
            setValidateMsg(t('encrypt_file_hostId_null_validate'));
            return false;
        }

        if (checkHostId && !validateHostId(hostId)) {
            return false;
        }

        return true;
    };

    const onUploadProgress = function (label) {
        return progress => {
            if (label === fileName) {
                const { total, loaded } = progress;
                let percent = Math.round((loaded / total) * 100);
                let curPercent = percent > 100 ? 100 : percent;
                if (curPercent > percentage) {
                    setPercentage(curPercent);
                }
            }
        };
    };

    const EncryptFile = async () => {
        if (!submitValidate()) {
            return;
        }

        try {
            setLoading(true);
            let result = await encryptUploadFiles(currentFile, hostId, onUploadProgress(fileName));
            Emitter.emit('openEncryptFileCidModal', result);
        } catch (e) {
            Emitter.emit('showMessageAlert', { message: e.Message, status: 'error' });
        }
        setLoading(false);
        closeModal();
    };

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        init();
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const onInputChange = e => {
        let file = e.target.files[0];
        setFileName(file?.name);
        setCurrentFile(file);
        e.target.value = null;
        if (file) {
            setValidateFileMsg('');
        }
    };

    const validateHostId = val => {
        let reg = /^[A-Za-z0-9]+$/;
        if (!val || reg.test(val)) {
            setValidateMsg('');
            return true;
        }
        if (!reg.test(val)) {
            setValidateMsg(t('encrypt_file_hostId_validate'));
        }
        return false;
    };
    const onAddFile = async e => {
        e.preventDefault();
        filesInput.click();
    };

    const hostIdChange = () => {
        const val = inputRef.current.value;
        setHostId(val);
        validateHostId(val);
    };

    const onChangeCheck = val => {
        setHostId('');
        setCheckHostId(val);
    };

    return (
        <CommonModal visible={showModal} maskClosable={false} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center items-center theme-bg theme-text-main">
                    <div className="font-semibold text-xl"> {t('encrypt_upload_file')} </div>
                    <div className="text-xs font-medium mb-6 theme-text-sub-info">
                        {t('encrypt_upload_file_desc')}
                    </div>
                    <div className="flex justify-between w-full font-semibold mb-3">
                        {t('select_encrypt_file')}
                    </div>
                    <button
                        className="w-full h-3   common-input theme-bg theme-border-color border-dashed border-[#243c5a] hover:border-color-active "
                        onClick={onAddFile}>
                        {fileName ? fileName : t('select_encrypt_file_btn')}
                    </button>
                    <div className="flex justify-between  w-full text-xs mb-8">
                        <span className="theme-text-error">{validateFileMsg}</span>
                    </div>
                    <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        single="true"
                        ref={el => {
                            filesInput = el;
                        }}
                        onChange={onInputChange}
                    />

                    <div className="flex justify-between w-full font-semibold mb-3">
                        <div>
                            {t('encrypt_file_hostid_title')}
                            <div className="text-xs font-medium theme-text-sub-info">
                                {t('encrypt_file_hostid_desc')}
                            </div>
                        </div>
                        <Switch checked={checkHostId}  disabled={loading} onChange={onChangeCheck} />
                    </div>
                    <div className={checkHostId ? 'w-full' : 'w-full hidden'}>
                        <input
                            id="file-input"
                            type="input"
                            className="w-full h-3 common-input  theme-bg theme-border-color "
                            single="true"
                            placeholder={intl.formatMessage({ id: 'encrypt_file_hostId_null_validate' })}
                            maxLength={inputMaxLength}
                            ref={inputRef}
                            onChange={hostIdChange}
                            value={hostId}
                            readOnly={loading}
                        />

                        <div className="flex justify-between text-xs  w-full  mb-4">
                            <span className="theme-text-error">{validateMsg}</span>
                            {
                                // <span>
                                //     {hostId.length || 0}/{inputMaxLength}
                                // </span>
                            }
                        </div>
                    </div>
                    {loading && <Progress percent={percentage} status="active"  strokeWidth={3} strokeColor="#3257F6"/>}
                    <div className="mt-2">
                        <button
                            className="ml-2 common-btn theme-fill-gray text-gray-900 mr-6"
                            onClick={closeModal}>
                            {t('cancel_encrypt_file_btn')}
                        </button>
                        <div className="ml-2 inline-block">
                            <Spin
                                spinning={loading}
                                indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />}>
                                <button
                                    type="primary"
                                    className="common-btn theme-common-btn"
                                    onClick={EncryptFile}>
                                    {t('encrypt_file_btn')}
                                </button>
                            </Spin>
                        </div>
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}
