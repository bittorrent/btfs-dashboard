import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import CommonModal from './CommonModal';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import Emitter from 'utils/eventBus';

export default function QRModal() {
  const [showModal, setShowModal] = React.useState(false);
  const address = useRef(null);

  useEffect(() => {
    const set = function (params) {
      openModal();
      address.current = params.address;
    };
    Emitter.on('openQRModal', set);
    return () => {
      Emitter.removeListener('openQRModal');
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

  return (
    <CommonModal centered width={500} open={showModal} onCancel={closeModal}>
      <div className={'common-modal-wrapper theme-bg'}>
        <QRCode className="mx-auto my-8" value={address.current} />
        <div className="flex justify-center input-group-append">
          <span className="theme-text-main">{address.current}</span>
          <ClipboardCopy value={address.current} />
        </div>
      </div>
    </CommonModal>
  );
}
