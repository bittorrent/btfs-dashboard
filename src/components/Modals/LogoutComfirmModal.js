import React, { useState, useEffect } from 'react';
import Emitter from 'utils/eventBus';
import Cookies from 'js-cookie';
import { logout } from 'services/login.js';
import { t } from 'utils/text.js';
import { useHistory } from 'react-router-dom';
import CommonModal from './CommonModal';

export default function LogoutConfirmModal({ color }) {
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const set = function (params) {
            openModal();
        };
        Emitter.on('openLogoutConfirmModal', set);
        return () => {
            Emitter.removeListener('openLogoutConfirmModal');
        };
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleLogout = async () => {
        // Emitter.emit('handleResetConfig', {});

        await logout();
        let NODE_URL = localStorage.getItem('NODE_URL')
            ? localStorage.getItem('NODE_URL')
            : 'http://localhost:5001';
        Cookies.remove(NODE_URL);
        history.push('/login');
        closeModal();
    };

    return (
        <CommonModal width={520} visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg">
                <header className="common-modal-header theme-text-main">{t('lougout_comfirm_modal_title')}</header>
                <main className="mb-8 theme-text-main">{t('lougout_comfirm_modal_desc')}</main>
                <footer className="common-modal-footer">
                    <button className="mr-4 common-btn theme-danger-btn " onClick={closeModal}>
                        {t('cancel')}
                    </button>
                    <button className="common-btn theme-common-btn" onClick={handleLogout}>
                        {t('confirm')}
                    </button>
                </footer>
            </div>
        </CommonModal>
    );
}
