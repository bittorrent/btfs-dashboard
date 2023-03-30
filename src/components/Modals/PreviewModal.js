import React, { useEffect, useState } from 'react';
import { viewFile } from 'services/filesService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';

export default function PreviewModal({ color }) {
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const set = async function (params) {
            console.log('openPreviewModal event has occured');
            openModal();
            let file = await viewFile(params.hash, params.name, params.size);
            setFile(file);
            setTimeout(() => {
                preview(file);
            }, 100);
        };
        Emitter.on('openPreviewModal', set);
        return () => {
            Emitter.removeListener('openPreviewModal');
            window.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const preview = (file, cancel) => {
        try {
            if (file) {
                if (file.type.indexOf('image') > -1) {
                    !cancel ? previewInit(file, '_image') : previewCancel('_image');
                }
                if (file.type.indexOf('video') > -1) {
                    !cancel ? previewInit(file, '_videoPlayer') : previewCancel('_videoPlayer');
                }
                if (file.type.indexOf('audio') > -1) {
                    !cancel ? previewInit(file, '_audioPlayer') : previewCancel('_audioPlayer');
                }
                if (file.type.indexOf('pdf') > -1) {
                    !cancel ? previewInit(file, '_pdf') : previewCancel('_pdf');
                }
                if (file.type.indexOf('json') > -1) {
                    !cancel ? previewInit(file, '_json') : previewCancel('_json');
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const previewInit = (file, domId) => {
        if (file) {
            let logo_url = URL.createObjectURL(file);
            const oLogo = document.getElementById(domId);
            oLogo && (oLogo.src = logo_url);
            if (domId !== '_image') {
                oLogo.setAttribute('height', '100%');
            }
        }
    };

    const previewCancel = domId => {
        const oLogo = document.getElementById(domId);
        oLogo && (oLogo.src = '');
    };

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        setFile(null);
        window.body.style.overflow = '';
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <div className="w-full h-full overflow-auto flex justify-center theme-bg theme-text-main">
                    {file && file.type.indexOf('image') > -1 && <img id="_image" alt="" className="m-auto" />}
                    {file && file.type.indexOf('video') > -1 && (
                        <video
                            id="_videoPlayer"
                            style={{ margin: 'auto' }}
                            width="100%"
                            height="100%"
                            controls="controls"></video>
                    )}
                    {file && file.type.indexOf('audio') > -1 && (
                        <audio
                            id="_audioPlayer"
                            style={{ margin: 'auto' }}
                            width="100%"
                            height="100%"
                            controls="controls"></audio>
                    )}
                    {file && file.type.indexOf('pdf') > -1 && <embed id="_pdf" width="100%" height="100%" />}
                    {file && file.type.indexOf('json') > -1 && (
                        <embed id="_json" width="100%" height="100%" style={{ background: '#C7DAFF' }} />
                    )}
                    {file &&
                        file.type.indexOf('json') === -1 &&
                        file.type.indexOf('pdf') === -1 &&
                        file.type.indexOf('audio') === -1 &&
                        file.type.indexOf('video') === -1 &&
                        file.type.indexOf('image') === -1 && (
                            <div className="flex flex-col items-center justify-center">
                                <img alt="disabled" src={require('../../assets/img/disabled.png').default} />
                                <div className="p-4 font-semibold"> {t('no_preview')} </div>
                            </div>
                        )}
                    {!file && (
                        <div className="w-full flex justify-center items-center ">
                            <img
                                alt=""
                                src={require('../../assets/img/loading.svg').default}
                                style={{ width: '50px', height: '50px' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </CommonModal>
    );
}
