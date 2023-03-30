import React, { useEffect, useRef } from 'react';
import { WarningFilled } from '@ant-design/icons';
import CommonModal from './CommonModal';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

export default function MessageModal() {
    const [showModal, setShowModal] = React.useState(false);
    const message = useRef(null);

    useEffect(() => {
        const set = function (params) {
            console.log('openMessageModal event has occured');
            message.current = params.message;
            openModal();
        };
        Emitter.on('openMessageModal', set);
        return () => {
            Emitter.removeListener('openMessageModal');
        };
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <CommonModal width={620} visible={showModal} onCancel={closeModal}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main">{t('private_key')}</header>
                <main className="mb-12">
                    <div className="mb-2 p-2 rounded flex items-center theme-fill-error text-xs text-white font-semibold">
                        <WarningFilled className="mr-3 text-base leading-none text-white" />
                        <span className="whitespace-nowrap font-normal text-white">{t('key_warning_1')}</span>.
                        <span className="ml-2 whitespace-nowrap text-white">{t('key_warning_2')}</span>
                    </div>
                    <div className="p-2 pl-4 h-10 border rounded-lg flex justify-between items-center theme-border-color">
                        <span className=" theme-text-main">{message.current}</span>
                        <ClipboardCopy value={message.current} />
                    </div>
                </main>
                <footer className="common-modal-footer">
                    <button className="w-25 common-btn theme-common-btn" onClick={closeModal}>
                        {t('confirm')}
                    </button>
                </footer>
            </div>
        </CommonModal>
    );
}
