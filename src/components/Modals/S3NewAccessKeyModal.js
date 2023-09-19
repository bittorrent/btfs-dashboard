import React, { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { s3NewAccessKey } from 'services/s3Service.js';


let callbackFn = null;
let isSubmit = false;
export default function S3NewAccessKeyModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const set = function (params) {
      callbackFn = params.callbackFn;
      isSubmit = false;
      openModal();
    };
    Emitter.on('openS3NewKeyModal', set);
    return () => {
      Emitter.removeListener('openS3NewKeyModal');
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

  const handleNewKey = async () => {
    if (isSubmit) return;
    isSubmit = true;
    const data = await s3NewAccessKey();
    if (data) {
      callbackFn();
      Emitter.emit('showMessageAlert', { message: 's3_new_access_key_success', status: 'success', type: 'frontEnd' });
      closeModal();
    }
    isSubmit = false;
  };

  return (
    <CommonModal width={540} open={showModal} onCancel={closeModal}>
      <div className={'common-modal-wrapper theme-bg'}>
        <header className="common-modal-header theme-text-main">{t('s3_new_key_title')}</header>
        <main className="mb-8">
          <div className="mb-4 theme-text-sub-main">{t('s3_new_key_des')}</div>
        </main>
        <footer className="common-modal-footer">
          <button className="common-btn theme-grey-btn mr-4" onClick={closeModal}>
            {t('cancel')}
          </button>
          <button className="common-btn theme-common-btn" onClick={handleNewKey}>
            {t('s3_btn_add')}
          </button>
        </footer>
      </div>
    </CommonModal>
  );
}
