import React, { useEffect, useState, useRef } from 'react';
import { Progress } from 'antd';
import { uploadFiles } from 'services/filesService.js';
import Emitter from 'utils/eventBus';
import themeStyle from 'utils/themeStyle.js';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';

export default function UploadModal({ color }) {
    const name = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const set = async function (params) {
            console.log('openUploadModal event has occured');
            openModal();
            name.current = params.data[0].path.split('/')[0];
            await upload(params.data, params.path, name.current);
            Emitter.emit('updateFiles');
        };
        Emitter.on('openUploadModal', set);
        return () => {
            Emitter.removeListener('openUploadModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onUploadProgress = function (label) {
        return (progress, totalSize) => {
            if (label === name.current) {
                let percentage = Math.round((progress / totalSize) * 100);
                setPercentage(percentage);
            }
        };
    };

    const upload = async (input, path, label) => {
        reset();
        let result = await uploadFiles(input, path, onUploadProgress(name.current), setErr, setMessage);
        if (result && label === name.current) {
            setPercentage(100);
        }
    };

    const reset = () => {
        setErr(false);
        setMessage(null);
        setPercentage(0);
    };

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        reset();
        setShowModal(false);
        window.body.style.overflow = '';
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center items-center theme-bg theme-text-main">
                    <div className="font-semibold mb-4"> {t('upload_status')} </div>
                    {!err && <Progress type="circle" percent={percentage} />}
                    {err && <Progress type="circle" percent={percentage} status="exception" />}
                    <div className="font-semibold mt-4 w-full overflow-auto text-center">
                        {t('uploading')} &nbsp;
                        <span className={themeStyle.title[color]}>{name.current}</span>
                    </div>
                    {message && <div className="font-semibold mt-4 w-full overflow-auto text-center"> {message} </div>}
                    <div style={{ height: '25px' }}>
                        {!err && percentage === 0 && (
                            <img
                                alt=""
                                style={{ height: '25px' }}
                                src={require('../../assets/img/bar-loading.svg').default}
                            />
                        )}
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}
