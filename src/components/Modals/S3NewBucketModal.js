import React, { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import * as AWS from "@aws-sdk/client-s3";
import { Input } from 'antd';
const { CreateBucketCommand } = AWS;


const MAX_COUNT = 63;
let globalS3 = null;
let callbackFn = null;
const bucketNameReg = new RegExp('(?!(^((2(5[0-5]|[0-4][0-9])|[01]?[0-9]{1,2})\.){3}(2(5[0-5]|[0-4][0-9])|[01]?[0-9]{1,2})$|^xn--|.+-s3alias$))^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$');

export default function S3NewBucketModal() {
    const [showModal, setShowModal] = useState(false);
    const [bucketName, setBucketName] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const set = function (params) {
            globalS3 = params.globalS3;
            callbackFn = params.callbackFn;
            setBucketName('');
            setIsValid(false);
            openModal();
        };
        Emitter.on('openS3NewBucketModal', set);
        return () => {
            Emitter.removeListener('openS3NewBucketModal');
            window.body.style.overflow = '';
        };
    }, []);

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const handleNewBucket = async () => {
        try {
            const input = {
                Bucket: bucketName
            };
            const command = new CreateBucketCommand(input);
            const response = await globalS3.send(command);
            await callbackFn();
            console.log("response", response);
            if (response) {
                Emitter.emit('showMessageAlert', {
                    message: 's3_new_bucket_success',
                    status: 'success',
                    type: 'frontEnd',
                });
                closeModal();
            }

        } catch (e) {
            console.log("error", e);
            Emitter.emit('showMessageAlert', { message: 's3_new_bucket_error', status: 'error', type: 'frontEnd' });
        }

    };

    const handleChange = (e) => {

        const value = e.target.value;
        const isValid = bucketNameReg.test(value);
        setIsValid(isValid);
        setBucketName(e.target.value)
    };


    return (
        <CommonModal width={540} open={showModal} onCancel={closeModal}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main">{t('s3_new_bucket')}</header>
                <main className="mb-8">
                    <div className="mb-4 theme-text-sub-main">{t('s3_bucket_name')}</div>
                    <Input showCount value={bucketName} maxLength={MAX_COUNT} onChange={handleChange} />
                </main>
                <footer className="common-modal-footer">
                    <button className="common-btn theme-grey-btn mr-4" onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    <ButtonConfirm valid={isValid} event={handleNewBucket} text={t('s3_btn_add')} />
                </footer>
            </div>
        </CommonModal>
    );
}
