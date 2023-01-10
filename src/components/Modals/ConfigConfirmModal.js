import React, { useState, useEffect } from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';

export default function ConfigConfirmModal({ color }) {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const set = function (params) {
            openModal();
        };
        Emitter.on('openConfigConfirmModal', set);
        return () => {
            Emitter.removeListener('openConfigConfirmModal');
        };
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const resetConfigData = async () => {
        Emitter.emit('handleResetConfig', {});
        closeModal();
    };

    return (
        <CommonModal width={520} visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <header className="common-modal-header theme-text-main">{t('reset_advance_config_title')}</header>
                <main className="mb-8 theme-text-main">{t('reset_advance_config_tips')}</main>
                <footer className="common-modal-footer">
                    <button className="mr-4 common-btn theme-danger-btn" onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    <button className="common-btn theme-common-btn" onClick={resetConfigData}>
                        {t('confirm')}
                    </button>
                </footer>
            </div>
        </CommonModal>
    );
}
