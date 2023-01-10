import React, { useEffect } from 'react';
import ButtonCancel from 'components/Buttons/ButtonCancel.js';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import { addPeer } from 'services/otherService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import CommonModal from './CommonModal';

let inputRef = null;

export default function AddConnectionModal({ color }) {
    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        const set = function () {
            console.log('openAddConnectionModal event has occured');
            openModal();
        };
        Emitter.on('openAddConnectionModal', set);
        return () => {
            Emitter.removeListener('openAddConnectionModal');
            window.body.style.overflow = '';
        };
    }, []);

    const add = async () => {
        closeModal();
        let { Strings, Type, Message } = await addPeer(inputRef.value);
        if (Strings && Strings.length) {
            Emitter.emit('showMessageAlert', {
                message: 'add_connection_success',
                status: 'success',
                type: 'frontEnd',
            });
        } else {
            if (Type === 'error') {
                Emitter.emit('showMessageAlert', { message: Message, status: 'error' });
            } else {
                Emitter.emit('showMessageAlert', {
                    message: 'add_connection_failed',
                    status: 'error',
                    type: 'frontEnd',
                });
            }
        }
    };

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        window.body.style.overflow = '';
    };

    return (
        <CommonModal visible={showModal} onCancel={closeModal} width={540}>
            <div className="common-modal-wrapper theme-bg theme-text-main">
                <header className="common-modal-header">{t('add_connection')}</header>
                <main className="mb-12">
                    <p className="pb-4">
                        {t('address_to_connect')}
                        <br />
                        E.G. /ip4/76.176.168.65/tcp/4001/p2p/QmbBHw1Xx9pUpAbrVZUKTPL5R
                    </p>
                    <input
                        type="text"
                        className="common-input theme-bg theme-border-color"
                        placeholder="Address"
                        ref={el => {
                            inputRef = el;
                        }}
                    />
                </main>
                <footer className="common-modal-footer">
                    <ButtonCancel className="mr-2" event={closeModal} text={t('cancel')} />
                    <ButtonConfirm event={add} valid={true} text={t('confirm')} />
                </footer>
            </div>
        </CommonModal>
    );
}
