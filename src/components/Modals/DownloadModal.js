import React, { useEffect, useState, useRef } from 'react';
import { Progress } from 'antd';
import { downloadFile, downloadFolder } from 'services/filesService.js';
import Emitter from 'utils/eventBus';
import themeStyle from 'utils/themeStyle.js';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';

export default function DownloadModal({ color }) {
    const name = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);

    useEffect(() => {
        const set = async function (params) {
            console.log('openDownloadModal event has occured');
            openModal();
            name.current = params.name;
            let result = await download(params.hash, params.name, params.size, params.type);
            console.log(result);
        };
        Emitter.on('openDownloadModal', set);
        return () => {
            Emitter.removeListener('openDownloadModal');
            window.body.style.overflow = '';
        };
    }, []);

    const download = async (hash, name, size, type) => {
        let onDownLoadProgress = progress => {
            let percentage = Math.round((progress.loaded / size) * 100);
            setPercentage(percentage);
        };
        setErr(false);
        let result;
        if (type === 2) {
            result = await downloadFile(hash, name, size, onDownLoadProgress, setErr);
        }
        if (type === 1) {
            result = await downloadFolder(hash, name, size, onDownLoadProgress, setErr);
        }
        return result;
    };

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
                        {t('downloading')} &nbsp;
                        <span className={themeStyle.title[color]}>{name.current}</span>
                    </div>
                </main>
            </div>
        </CommonModal>
    );
}
