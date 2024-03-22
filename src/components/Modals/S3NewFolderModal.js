import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Input } from 'antd';
import CommonModal from './CommonModal';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import * as AWS from "@aws-sdk/client-s3";
import { getIsValidFolder } from 'utils/BTFSUtil';

const { PutObjectCommand, HeadObjectCommand } = AWS;

let s3PlaceholderKey = '';
let globalS3 = null;
let prefix = '';
let bucketName = '';
const ruleUrl = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html?icmpid=docs_amazons3_console';


export default function S3NewFolderModal({ color }) {
    const intl = useIntl();
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const set = function (params) {
            globalS3 = params.globalS3;
            s3PlaceholderKey = params.s3PlaceholderKey;
            prefix = params.prefix;
            bucketName = params.bucketName;
            setIsValid(false);
            setValue("");
            console.log('openS3NewFolderModal event has occured');
            openModal();
        };
        Emitter.on('openS3NewFolderModal', set);
        return () => {
            Emitter.removeListener('openS3NewFolderModal');
            window.body.style.overflow = '';
        };
    }, []);

    const getIsExit = async() =>{
        try{
            const command = new HeadObjectCommand({
                Bucket: bucketName,
                Key: prefix + value + '/',
            });
            await globalS3.send(command);
            return true;
        }catch(e){
            console.log('error', e);
            return false;
        }
    }

    const newFolder = async () => {
        try {
            closeModal();
            const isExit = await getIsExit();
            if(isExit){
                Emitter.emit('showMessageAlert', { message: 's3_new_folder_already_exists_error', status: 'error', type: 'frontEnd' });
                return;
            }
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: prefix + value + '/',
                Body: s3PlaceholderKey,
            });
            const response = await globalS3.send(command);
            console.log("response", response)
            Emitter.emit('updateS3Files');
            if (response) {
                Emitter.emit('showMessageAlert', {
                    message: 'create_folder_success',
                    status: 'success',
                    type: 'frontEnd',
                });
            } else {
                Emitter.emit('showMessageAlert', { message: 'create_folder_fail', status: 'error', type: 'frontEnd' });
            }
        } catch (e) {
            console.log("error", e);
            Emitter.emit('showMessageAlert', { message: 'create_folder_fail', status: 'error', type: 'frontEnd' });

        }
    };
    const handleChange = (e) => {
        const value = e.target.value;
        console.log("onChange", value);
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
                    {t('new_folder')}
                </header>
                <main className="mb-12">
                    <div className="text-center text-5xl mb-5">
                        <i className="fas fa-folder-plus"></i>
                    </div>
                    <p className="pb-4">
                        {t('insert_name')}
                        <br />
                    </p>
                    <Input
                        type="text"
                        className="common-input theme-bg theme-text-main theme-border-color"
                        placeholder={intl.formatMessage({ id: 'folder_name' })}
                        value={value}
                        onChange={handleChange}
                    />
                     <div className='mt-1 flex flex-wrap'>
                        <span>{t('s3_add_folder_rule_1')}</span>
                        <a className="theme-link" target="_blank" rel="noreferrer" href={ruleUrl}><span>&nbsp;{t('s3_add_folder_rule_2')}&nbsp;</span></a>
                    </div>
                    {/* {
            showError && <p className="error">
              {t('s3_new_folder_error_tips')}
              <br />
            </p>
          } */}
                </main>
                <footer className="flex items-center justify-end common-modal-footer">
                    <button className="common-btn theme-grey-btn mr-4" onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    <ButtonConfirm
                        event={newFolder}
                        valid={isValid}
                        text={t('create')}
                    />
                </footer>
            </div>
        </CommonModal>
    );
}
