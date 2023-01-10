import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import CommonModal from './CommonModal';
import ButtonCancel from 'components/Buttons/ButtonCancel.js';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import { importFromBTFS, createNewFolder } from 'services/filesService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

let inputRef = null;

export default function ImportModal({ color }) {
    const intl = useIntl();
    const [type, setType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [path, setPath] = useState(null);

    useEffect(() => {
        const set = function (params) {
            console.log('openImportModal event has occured');
            openModal();
            setType(params.type);
            setPath(params.path);
        };
        Emitter.on('openImportModal', set);
        return () => {
            Emitter.removeListener('openImportModal');
            window.body.style.overflow = '';
        };
    }, []);

    const fromBTFS = async () => {
        closeModal();
        let { result } = await importFromBTFS(inputRef.value, path);
        if (result === true) {
            Emitter.emit('updateFiles');
            Emitter.emit('showMessageAlert', { message: 'import_success', status: 'success', type: 'frontEnd' });
        } else {
            if (result.Message) {
                Emitter.emit('showMessageAlert', { message: result.Message, status: 'error' });
            } else {
                Emitter.emit('showMessageAlert', { message: 'import_fail', status: 'error', type: 'frontEnd' });
            }
        }
    };

    const newFolder = async () => {
        closeModal();
        let result = await createNewFolder(inputRef.value, path);
        if (result) {
            Emitter.emit('updateFiles');
            Emitter.emit('showMessageAlert', {
                message: 'create_folder_success',
                status: 'success',
                type: 'frontEnd',
            });
        } else {
            Emitter.emit('showMessageAlert', { message: 'create_folder_fail', status: 'error', type: 'frontEnd' });
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
        <CommonModal visible={showModal} onCancel={closeModal}>
            <div className="common-modal-wrapper theme-bg theme-text-main">
                <header className="common-modal-header">
                    {type === 'byPath' ? t('import_from_btfs') : t('new_folder')}
                </header>
                <main className="mb-12">
                    <div className="text-center text-5xl mb-5">
                        {type === 'byPath' ? <i className="fas fa-link"></i> : <i className="fas fa-folder-plus"></i>}
                    </div>
                    <p className="pb-4">
                        {type === 'byPath' ? t('insert_cid') : t('insert_name')}
                        <br />
                        {type === 'byPath' ? 'QmfHJdnQQ3Q9R2QwBbyxcNsjHBeKeQoxXbdfYkFzEyrUEE' : ''}
                    </p>
                    <input
                        type="text"
                        className="common-input theme-bg theme-text-main theme-border-color"
                        placeholder={type === 'byPath' ? 'CID' : intl.formatMessage({ id: 'folder_name' })}
                        ref={el => {
                            inputRef = el;
                        }}
                    />
                </main>
                <footer className="flex items-center justify-end common-modal-footer">
                    <ButtonCancel className="mr-2" event={closeModal} text={t('cancel')} />
                    <ButtonConfirm
                        event={type === 'byPath' ? fromBTFS : newFolder}
                        valid={true}
                        text={type === 'byPath' ? t('import') : t('create')}
                    />
                </footer>
            </div>
        </CommonModal>
    );
}
