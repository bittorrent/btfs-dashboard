import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Input } from 'antd';
import CommonModal from './CommonModal';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { getIsValidFolder } from 'utils/BTFSUtil';

let callBackFn = null;
const ruleUrl = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html?icmpid=docs_amazons3_console';

export default function S3RenameFileModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const set = function (params) {
            callBackFn = params.callBackFn;
            setIsValid(false);
            setValue("");
            openModal();
        };
        Emitter.on('openS3RenameFileModal', set);
        return () => {
            Emitter.removeListener('openS3RenameFileModal');
            window.body.style.overflow = '';
        };
    }, []);

    const handleRename = async () => {
        closeModal();
        await callBackFn(value);
    }

    const handleChange = (e) => {
        const value = e.target.value;
        const isValid = getIsValidFolder(value);
        setIsValid(isValid);
        setValue(value);
    }

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        window.body.style.overflow = '';
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg theme-text-main">
                <header className="common-modal-header">
                    {t('s3_rename_file')}
                </header>
                <main className="mb-12">
                    <p className="pb-4">
                        {t('file_name')}
                        <br />
                    </p>
                    <Input
                        type="text"
                        className="common-input theme-bg theme-text-main theme-border-color"
                        placeholder={intl.formatMessage({ id: 'file_name' })}
                        value={value}
                        onChange={handleChange}
                    />
                       <div className='mt-1 flex flex-wrap'>
                        <span>{t('s3_add_folder_rule_1')}</span>
                        <a className="theme-link" target="_blank" rel="noreferrer" href={ruleUrl}><span>&nbsp;{t('s3_add_folder_rule_2')}&nbsp;</span></a>
                    </div>

                </main>
                <footer className="flex items-center justify-end common-modal-footer">
                    <button className="common-btn theme-grey-btn mr-4" onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    <ButtonConfirm
                        event={handleRename}
                        valid={isValid}
                        text={t('confirm')}
                    />
                </footer>
            </div>
        </CommonModal>
    );
}
