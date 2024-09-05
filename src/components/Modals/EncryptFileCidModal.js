import React, { useEffect, useState, useContext } from 'react';
import { message } from 'antd';
import { t } from 'utils/text.js';
import Emitter from 'utils/eventBus';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CommonModal from './CommonModal';
import { useIntl } from 'react-intl';
import { mainContext } from 'reducer';

export default function EncryptFileModal({ color }) {
    const [showModal, setShowModal] = useState(false);
    const [cid, setCid] = useState('');

    const intl = useIntl();
    const { state } = useContext(mainContext);
    const { theme, sidebarShow } = state;

    useEffect(() => {
        const set = async function (cid) {
            setCid(cid);
            openModal();
        };
        Emitter.on('openEncryptFileCidModal', set);
        return () => {
            Emitter.removeListener('openEncryptFileCidModal');
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

    const copySuccess = () => {
        message.success({
            content: intl.formatMessage({ id: 'copied' }),
            className: 'copied_sidebar_show_' + sidebarShow + ' copied_' + theme,
            duration: '1',
        });
    };

    return (
        <CommonModal visible={showModal} maskClosable={false} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <main className="flex flex-col justify-center items-center theme-bg theme-text-main">
                    <div className="mb-4 relative pr-1 pb-1">
                        <img
                            alt=""
                            src={require(`../../assets/img/encrypt.png`).default}
                            width={43}
                        />
                        <img
                            alt=""
                            className="absolute bottom-0 right-0"
                            src={require(`../../assets/img/success.png`).default}
                            width={22}
                        />
                    </div>
                    <div className="font-semibold text-xl  mb-2"> {t('encrypt_file_cid_title')} </div>
                    <div className="text-xs font-medium mb-4 theme-text-sub-info">
                        {t('encrypt_file_cid_desc')}
                    </div>
                    <div className=" w-full  p-4 uploaded-cid-card border theme-border-color text-left mb-5 ">
                        <div className="flex justify-between w-full font-normal mb-2">
                            {t('encrypt_file_cid')}
                        </div>
                        <div className="flex justify-between w-full font-semibold ">{cid}</div>
                    </div>
                    <CopyToClipboard text={cid}>
                        <button className="ml-2  common-btn theme-common-btn " onClick={copySuccess}>
                            <i className="fa-regular fa-copy mr-2 cursor-pointer"></i>
                            {t('encrypt_file_cid_copy')}
                        </button>
                    </CopyToClipboard>
                </main>
            </div>
        </CommonModal>
    );
}
