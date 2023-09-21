import React, { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { debounce } from 'lodash';


let callbackFn = null;

export default function S3ResetAccessKeyModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const set = function (params) {
      callbackFn = params.callbackFn;
      openModal();
    };
    Emitter.on('openS3ResetAccessKeyModal', set);
    return () => {
      Emitter.removeListener('openS3ResetAccessKeyModal');
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

  const handleSubmit = debounce(async () => {
    await callbackFn();
    closeModal();
  }, 1000);

  return (
    <CommonModal width={540} open={showModal} onCancel={closeModal}>
      <div className={'common-modal-wrapper theme-bg'}>
        <header className="common-modal-header theme-text-main">{t('s3_reset_access_key')}</header>
        <main className="mb-8">
          <div className="mb-4 theme-text-sub-main">{t('s3_reset_access_key_des')}</div>
        </main>
        <footer className="common-modal-footer">
          <button className="common-btn theme-grey-btn mr-4" onClick={closeModal}>
            {t('cancel')}
          </button>
          <button className="common-btn theme-common-btn" onClick={handleSubmit}>
            {t('s3_btn_reset')}
          </button>
        </footer>
      </div>
    </CommonModal>
  );
}
