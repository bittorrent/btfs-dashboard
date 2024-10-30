import React, { useEffect, useState, useRef } from 'react';
import { Progress } from 'antd';
import Emitter from 'utils/eventBus';
import themeStyle from 'utils/themeStyle.js';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';


let execDownload = null;
export default function S3DownloadModal({ color }) {
    const name = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);

    useEffect(() => {
        const set = async function (params) {
            console.log('openS3DownloadModal event has occured');
            reset();
            openModal();
            name.current = params.name;
            execDownload = params.execDownload;
            let result = await execDownload(setPercentage);
            setPercentage(100);
            console.log(result);
        };
        Emitter.on('openS3DownloadModal', set);
        return () => {
            Emitter.removeListener('openS3DownloadModal');
            window.body.style.overflow = '';
        };
    }, []);

    const reset = () => {
        setErr(false);
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
                    <div className="font-semibold mb-4"> {t('download_status')} </div>
                    {!err && percentage < 100 && <Progress type="circle" percent={percentage} />}
                    {err && percentage < 100 && <Progress type="circle" percent={percentage} status="exception" />}
                    {percentage >= 100 && <Progress type="circle" percent={percentage} />}
                    <div className="font-semibold mt-4 w-full overflow-auto text-center">
                        {err ?  t('download_fail') : percentage > 99 ? t('download_success') : t('downloading') }
                        &nbsp;
                        <span className={themeStyle.title[color]}>{name.current}</span>
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}
