import React, {useEffect, useContext, useState} from "react";
import {useIntl} from 'react-intl';
import {mainContext} from "reducer";
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import {importFromBTFS, createNewFolder} from "services/filesService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let inputRef = null;

export default function ImportModal({color}) {
    const intl = useIntl();
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [type, setType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [path, setPath] = useState(null);

    useEffect(() => {
        const set = function (params) {
            console.log("openImportModal event has occured");
            openModal();
            setType(params.type);
            setPath(params.path);
        };
        Emitter.on("openImportModal", set);
        return () => {
            Emitter.removeListener('openImportModal');
            window.body.style.overflow = '';
        }
    }, []);

    const fromBTFS = async () => {
        closeModal();
        let {result} = await importFromBTFS(inputRef.value, path);
        if (result === true) {
            Emitter.emit("updateFiles");
            Emitter.emit('showMessageAlert', {message: 'import_success', status: 'success', type: 'frontEnd'});
        } else {
            if (result.Message) {
                Emitter.emit('showMessageAlert', {message: result.Message, status: 'error'});
            } else {
                Emitter.emit('showMessageAlert', {message: 'import_fail', status: 'error', type: 'frontEnd'});
            }
        }
    };

    const newFolder = async () => {
        closeModal();
        let result = await createNewFolder(inputRef.value, path);
        if (result) {
            Emitter.emit("updateFiles");
            Emitter.emit('showMessageAlert', {message: 'create_folder_success', status: 'success', type: 'frontEnd'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'create_folder_fail', status: 'error', type: 'frontEnd'});
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
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '350px'}}>
                        <div className="flex-1">
                            {/*content*/}
                            <div
                                className={"border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                {/*header*/}
                                <div className="flex items-start justify-between p-4">
                                    <p className=" font-semibold">
                                        {type === 'byPath' ? t('import_from_btfs') : t('new_folder')}
                                    </p>
                                </div>
                                {/*body*/}
                                <div className="relative p-4 flex-auto">
                                    <div className="text-center text-5xl mb-5">
                                        {
                                            type === 'byPath' ? <i className="fas fa-link"></i> :
                                                <i className="fas fa-folder-plus"></i>
                                        }
                                    </div>
                                    <p className="pb-4">
                                        {type === 'byPath' ? t('insert_cid') : t('insert_name')}
                                        <br/>
                                        {type === 'byPath' ? "QmfHJdnQQ3Q9R2QwBbyxcNsjHBeKeQoxXbdfYkFzEyrUEE" : ""}
                                    </p>
                                    <input type="text"
                                           className={"p4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 " + color}
                                           placeholder={type === 'byPath' ? "CID" : intl.formatMessage({id: 'folder_name'})}
                                           ref={el => {
                                               inputRef = el
                                           }}
                                    />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-4 rounded-b">
                                    <ButtonCancel event={closeModal} text={t('cancel')}/>
                                    <ButtonConfirm event={type === 'byPath' ? fromBTFS : newFolder} valid={true}
                                                   text={type === 'byPath' ? t('import') : t('create')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full inset-0 z-40"></div>
                </>
            ) : null}
        </>
    );
}