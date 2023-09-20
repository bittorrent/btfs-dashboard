import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Input } from 'antd';
import CommonModal from './CommonModal';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
let callBackFn = null;

const nameReg = new RegExp(`^[a-zA-Z0-9!_.*'()-]{1,60}$`);
let isSubmit = false;

export default function S3RenameFileModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const set = function (params) {
            callBackFn = params.callBackFn;
            isSubmit = false;
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
        if(isSubmit) return;
        isSubmit = true;
        const res = await callBackFn(value);
        if (res) {
            closeModal();
        }
        isSubmit = false;
    }
    const handleChange = (e) => {
        const value = e.target.value;
        const isValid = nameReg.test(value);
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
