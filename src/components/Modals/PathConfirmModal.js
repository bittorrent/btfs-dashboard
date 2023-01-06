import React, { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

import { changeRepo } from 'services/otherService.js';

export default function PWDModal() {
  const [showModal, setShowModal] = useState(false);
  const [path, setPath] = useState('');
  const [volume, setVolume] = useState('');

  useEffect(() => {
    const set = function (params) {
      console.log('openPathConfirmModal event has occured');
      openModal();
      console.log('params', params);
      setPath(params.path);
      setVolume(params.volume);
    };
    Emitter.on('openPathConfirmModal', set);
    return () => {
      Emitter.removeListener('openPathConfirmModal');
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

  const checkPath = async () => {
    let { Type, Message } = await changeRepo(path.replace(/\s*/g, ''), volume);
    if (Type === 'error') {
      Emitter.emit('showMessageAlert', { message: Message, status: 'error' });
    } else {
      Emitter.emit('showMessageAlert', { message: 'change_success', status: 'success' });
    }
    closeModal();
  };

  return (
    <CommonModal width={520} open={showModal} onCancel={closeModal}>
      <div className={'common-modal-wrapper theme-bg'}>
        <header className="common-modal-header theme-text-main">{t('storage_path_confirmation')}</header>
        <main className="mb-8">
          <div className="mb-4 theme-text-sub-main">{t('storage_path_info')}</div>
          <div className="break-all theme-text-main">{path}</div>
        </main>
        <footer className="common-modal-footer">
          <button className="common-btn theme-danger-btn mr-4" onClick={closeModal}>
            {t('cancel')}
          </button>
          <button className="common-btn theme-common-btn" onClick={checkPath}>
            {t('confirm')}
          </button>
        </footer>
      </div>
    </CommonModal>
  );
}
