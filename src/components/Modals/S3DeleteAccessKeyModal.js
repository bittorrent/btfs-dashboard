import React, { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import ButtonCancel from 'components/Buttons/ButtonCancel.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';


let callbackFn = null;

export default function S3DeleteAccessKeyModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const set = function (params) {
      callbackFn = params.callbackFn;
      openModal();
    };
    Emitter.on('openS3DeleteAccessKeyModal', set);
    return () => {
      Emitter.removeListener('openS3DeleteAccessKeyModal');
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

  const handleSubmit = async () => {
    closeModal();
    await callbackFn();
  };

  return (
    <CommonModal width={540} open={showModal} onCancel={closeModal}>
      <div className={'common-modal-wrapper theme-bg'}>
        <header className="common-modal-header theme-text-main">{t('s3_delete_bucket')}</header>
        <main className="mb-8">
          <div className="mb-4 theme-text-sub-main">{t('s3_delete_bucket_des')}</div>
        </main>
        <footer className="common-modal-footer">
          <button className="common-btn theme-grey-btn mr-4" onClick={closeModal}>
            {t('cancel')}
          </button>
          <ButtonCancel event={handleSubmit} text={t('s3_btn_delete')} />
        </footer>
      </div>
    </CommonModal>
  );
}
