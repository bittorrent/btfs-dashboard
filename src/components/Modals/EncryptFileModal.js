import React, { useEffect, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { encryptUploadFiles } from 'services/filesService.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Switch, Spin, Progress, Radio, Input, Button } from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
const crypto = require('crypto');

let filesInput = null;
let inputMaxLength = 100;

const options = [
    { label: 'encrypt_file_with_host', value: 'host' },
    { label: 'encrypt_file_with_password', value: 'password' },
];
const hostOptions = [
    {
        label: 'encrypt_file_with_cur_host',
        desc: 'encrypt_file_with_cur_host_desc',
        value: true,
    },
    {
        label: 'encrypt_file_with_other_host',
        desc: 'encrypt_file_with_other_host_desc',
        value: false,
    },
];

export default function EncryptFileModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [fileName, setFileName] = useState('');
    const [hostId, setHostId] = useState('');
    const [validateMsg, setValidateMsg] = useState('');
    const inputRef = useRef(null);
    const posswordRef = useRef(null);
    const [checkHostId, setCheckHostId] = useState(false);
    const [currentFile, setCurrentFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [validateFileMsg, setValidateFileMsg] = useState('');
    const [percentage, setPercentage] = useState(0);
    const [encryptType, setEncryptType] = useState('host');
    const [isCurHost, setIsCurHost] = useState(false);
    const [password, setPassword] = useState('');
    const [validateKeyMsg, setValidateKeyMsg] = useState('');

    const init = () => {
        setHostId('');
        setFileName('');
        setCurrentFile('');
        setValidateMsg('');
        setValidateFileMsg('');
        setValidateKeyMsg('');
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

        if (!isCurHost && !checkPassword()) {
            return;
        }

        try {
            setLoading(true);
            let hostid = encryptType === 'host' ? hostId : '';
            let passwords = encryptType === 'host' ? '' : password;
            let result = await encryptUploadFiles(currentFile, hostid, passwords, onUploadProgress(fileName));
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

    const checkPassword = () => {
        const reg = /^[0-9A-Za-z]{6,20}$/g;
        if (!password) {
            setValidateKeyMsg(t('validate_encryptkey_null'));
            return false;
        }
        if (!reg.test(password)) {
            setValidateKeyMsg(t('validate_encryptkey'));
            return false;
        }
        setValidateKeyMsg('');
        return true;
    };

    const onChange = e => {
        setEncryptType(e.target.value);
    };

    const hostChange = e => {
        setHostId('');
        setIsCurHost(e.target.value);
    };

    const passwordChange = e => {
        const val = e.target.value; //posswordRef.current.value;
        setPassword(val);
        checkPassword(val);
    };

    const randomKey = () => {
        const key = crypto.randomBytes(10).toString('hex');
        setPassword(key);
    };
    return (
        <CommonModal visible={showModal} maskClosable={false} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center items-center theme-bg theme-text-main">
                    <div className="font-semibold text-xl"> {t('encrypt_upload_file')} </div>
                    <div className="text-xs font-medium mb-6 theme-text-sub-info">
                        {t('encrypt_upload_file_desc')}
                    </div>
                    <div className="font-semibold  w-full mb-3">
                        <Radio.Group
                            onChange={onChange}
                            optionType="button"
                            buttonStyle="solid"
                            className="flex justify-between w-full encrypt_upload_select"
                            value={encryptType}>
                            {options.map(v => {
                                return (
                                    <Radio value={v.value}>
                                        <div className=" w-full font-semibold mb-3">
                                            <p>{t(`${v.label}`)}</p>
                                        </div>
                                    </Radio>
                                );
                            })}
                        </Radio.Group>
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
                    <div className={encryptType === 'host' ? 'w-full ' : 'w-full hidden'}>
                        <div className="w-full">
                            <Radio.Group onChange={hostChange} value={isCurHost}>
                                {hostOptions.map(v => {
                                    return (
                                        <Radio value={v.value}>
                                            <div className=" w-full font-semibold mb-3">
                                                <p>{t(`${v.label}`)}</p>
                                                <span className="text-xs font-medium theme-text-sub-info">
                                                    {t(`${v.desc}`)}
                                                </span>
                                            </div>
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </div>
                        <div className={isCurHost ? 'w-full hidden' : 'w-full'}>
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
                    </div>
                    <div className={encryptType === 'host' ? 'w-full hidden' : 'w-full '}>
                        <div className="flex justify-between w-full font-semibold ">
                            {t('encrypt_file_password')}
                        </div>
                        <div className="text-xs font-medium theme-text-sub-info mb-3">
                            {t('encrypt_file_password_desc')}
                        </div>
                        <div>
                            <Input
                                placeholder={intl.formatMessage({ id: 'set_encrypt_key_placeholder' })}
                                className="common-input random_key"
                                value={password}
                                onChange={passwordChange}
                                suffix={
                                    <Button
                                        type="primary"
                                        className="get_key_btn flex items-center "
                                        icon={
                                            <img
                                                src={require('assets/img/key2.png').default}
                                                className="key_img"
                                            />
                                        }
                                        onClick={randomKey}>
                                        {t(`random_key`)}
                                    </Button>
                                }
                            />
                            <div className="flex justify-between text-xs  w-full  mb-4">
                                <span className="theme-text-error">{validateKeyMsg}</span>
                                {
                                    // <span>
                                    //     {hostId.length || 0}/{inputMaxLength}
                                    // </span>
                                }
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <Progress
                            percent={percentage}
                            status="active"
                            strokeWidth={3}
                            strokeColor="#3257F6"
                        />
                    )}
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
