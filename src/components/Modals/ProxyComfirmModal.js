import React, { useState, useEffect, useRef } from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';
import { setProxy } from 'services/proxyService';
import { Button } from 'antd';

export default function ProxyConfirmModal({ color, setSwitchLoading, setSwitchChecked }) {
    const [showModal, setShowModal] = useState(false);
    const isOpenProxy = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const set = function (params) {
            isOpenProxy.current = params.checked;
            openModal();
        };
        Emitter.on('openProxyConfirmModal', set);
        return () => {
            Emitter.removeListener('openProxyConfirmModal');
        };
    }, []);

    const openModal = () => {
        setLoading(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setSwitchLoading(false);
        setLoading(false);
        setShowModal(false);
    };

    const handleConfirm = async () => {
        setLoading(true);
        let res = await setProxy('Experimental.EnableProxyMode', isOpenProxy.current);

        if (res?.Type === 'error') {
            Emitter.emit('showMessageAlert', {
                message: res?.Message, //|| 'set_renew_on_fail'
                status: 'error',
            });

            return;
        }
        if (res.Key) {
            localStorage.setItem('IS_PROXY_MODE', res.Value );
            setSwitchChecked(res.Value);
            Emitter.emit('showMessageAlert', {
                message: res.Value ? 'set_proxy_on_success' : 'set_proxy_off_success',
                status: 'success',
                type: 'frontEnd',
            });
            closeModal();
        }
        closeModal();
    };

    // (isOpenProxy.current ? " theme-danger-btn" :" theme-grey-btn")

    return (
        <CommonModal width={520} visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <header className="common-modal-header theme-text-main  mb-2">
                    {isOpenProxy.current ? t('start_proxy_service') : t('close_proxy_service')}
                </header>
                <main className="mb-6 text-xs font-medium mb-4 theme-text-sub-info">
                    {isOpenProxy.current ? t('start_proxy_service_desc') : t('close_proxy_service_desc')}
                </main>
                <footer className="common-modal-footer">
                    <button className={'  mr-4 common-btn theme-grey-btn'} onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    {isOpenProxy.current ? (
                        <Button
                            className="common-btn theme-common-btn"
                            onClick={handleConfirm}
                            loading={loading}>
                            {t('start_service_confirm')}
                        </Button>
                    ) : (
                        <Button
                            className="common-btn theme-common-btn"
                            onClick={handleConfirm}
                            loading={loading}>
                            {t('close_service_confirm')}
                        </Button>
                    )}
                </footer>
            </div>
        </CommonModal>
    );
}
