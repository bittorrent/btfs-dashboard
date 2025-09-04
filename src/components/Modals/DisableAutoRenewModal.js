import React, { useState, useEffect ,useRef} from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import {disableRenew } from 'services/filesService.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';


export default function DisableAutoRenewModal({ color,fetchData }) {
    const [showModal, setShowModal] = useState(false);
    const curFile = useRef(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const set = function (params) {
            curFile.current = params.cid;
            openModal();
        };
        Emitter.on('openDisableAutoRenewModal', set);
        return () => {
            Emitter.removeListener('openDisableAutoRenewModal');
        };
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleConfirm = async () => {
        // Emitter.emit('handleResetConfig', {});
        setLoading(true)
         let res = await disableRenew(curFile.current);
         console.log(res,'----ress')
        setLoading(false)
         if(res?.Type !== "error"){

         }
         fetchData()
         closeModal()
    };

    return (
        <CommonModal width={520} visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <header className="common-modal-header theme-text-main mb-2">{t('disable_auto_renew')}</header>
                <main className="mb-6 text-xs font-medium mb-4 theme-text-sub-info">{t('disable_auto_renew_desc')}</main>
                <footer className="common-modal-footer">
                    <button className="mr-4 common-btn theme-grey-btn" onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    <Spin
                    spinning={loading}
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <button className="common-btn  theme-danger-btn " onClick={handleConfirm}>
                        {t('disable')}
                    </button>
                </Spin>
                </footer>
            </div>
        </CommonModal>
    );
}
