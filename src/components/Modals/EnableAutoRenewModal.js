import React, { useState, useEffect, useRef } from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import { enableRenew } from 'services/filesService.js';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function EnableAutoRenewModal({ color, fetchData }) {
    const [showModal, setShowModal] = useState(false);
    const curFile = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const set = function (params) {
            curFile.current = params.cid;
            openModal();
        };
        Emitter.on('openEnableAutoRenewModal', set);
        return () => {
            Emitter.removeListener('openEnableAutoRenewModal');
        };
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleConfirm = async () => {
        setLoading(true);
        let res = await enableRenew(curFile.current);
        setLoading(false);
        if (res?.Type === 'error') {
            Emitter.emit('showMessageAlert', {
                message: res?.Message ,  //|| 'set_renew_on_fail'
                status: 'error',
            });
        } else {
            Emitter.emit('showMessageAlert', {
                message: 'set_renew_on_success',
                status: 'success',
                type: 'frontEnd',
            });
        }
        fetchData();
        closeModal();
    };

    return (
        <CommonModal width={520} visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <header className="common-modal-header theme-text-main mb-2">{t('enable_auto_renew')}</header>
                <main className="mb-6 text-xs font-medium mb-4 theme-text-sub-info">
                    {t('enable_auto_renew_desc')}
                </main>
                <footer className="common-modal-footer">
                    <button className="mr-4 common-btn theme-grey-btn " onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                        <button className="common-btn  theme-common-btn " onClick={handleConfirm}>
                            {t('enable')}
                        </button>
                    </Spin>
                </footer>
            </div>
        </CommonModal>
    );
}
