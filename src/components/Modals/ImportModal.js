import React, {useEffect, useContext, useState} from "react";
import {useIntl} from 'react-intl';
import {mainContext} from "reducer";
import {importFromBTFS, createNewFolder} from "services/filesService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";

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
            setType(params.type);
            setPath(params.path);
            setShowModal(true);
        };
        Emitter.on("openImportModal", set);
        return () => {
            Emitter.removeListener('openImportModal');
        }
    }, []);

    const fromBTFS = async () => {
        setShowModal(false);
        let {result} = await importFromBTFS(inputRef.value, path);
        if (result === true) {
            Emitter.emit("updateFiles");
            Emitter.emit('showMessageAlert', {message: 'import_success', status: 'success', type:'frontEnd'});
        } else {
            if (result.Message) {
                Emitter.emit('showMessageAlert', {message: result.Message, status: 'error'});
            } else {
                Emitter.emit('showMessageAlert', {message: 'import_fail', status: 'error', type:'frontEnd'});
            }
        }
    };

    const newFolder = async () => {
        setShowModal(false);
        let result = await createNewFolder(inputRef.value, path);
        if (result) {
            Emitter.emit("updateFiles");
            Emitter.emit('showMessageAlert', {message: 'create_folder_success', status: 'success', type:'frontEnd'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'create_folder_fail', status: 'error', type:'frontEnd'});
        }
    };

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '300px'}}>
                        <div className="flex-1">
                            {/*content*/}
                            <div
                                className={"border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                {/*header*/}
                                <div className="flex items-start justify-between p-4">
                                    <p className=" font-semibold">
                                        {type === 'byPath' ? intl.formatMessage({id: 'import_from_btfs'}) : "New folder"}
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
                                        {type === 'byPath' ? intl.formatMessage({id: 'insert_cid'}) : "Insert the name of the folder you want to create."}
                                        <br/>
                                        {type === 'byPath' ? "QmfHJdnQQ3Q9R2QwBbyxcNsjHBeKeQoxXbdfYkFzEyrUEE" : ""}
                                    </p>
                                    <input type="text"
                                           className={"p4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 " + color}
                                           placeholder={type === 'byPath' ? "CID" : "Folder Name"}
                                           ref={el => {
                                               inputRef = el
                                           }}
                                    />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-4 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            type === 'byPath' ? fromBTFS() : newFolder()
                                        }}
                                    >
                                        {type === 'byPath' ? intl.formatMessage({id: 'import'}) : "Create"}
                                    </button>
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