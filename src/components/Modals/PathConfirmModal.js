import React, {useState, useEffect, useContext} from "react";
import {mainContext} from "reducer";
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

import {changeRepo} from "services/otherService.js";

export default function PWDModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);
    const [path, setPath] =  useState('')
    const [volume, setVolume] =  useState('')

    useEffect(() => {
        const set = function (params) {
            console.log("openPathConfirmModal event has occured");
            openModal();
            console.log('params', params)
            setPath(params.path)
            setVolume(params.volume)
        };
        Emitter.on("openPathConfirmModal", set);
        return () => {
            Emitter.removeListener('openPathConfirmModal');
            window.body.style.overflow = '';
        }
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
        // let path = inputRef.current.value;
        // closeModal();
        let {Type, Message} = await changeRepo(path.replace(/\s*/g, ""), volume);
        if (Type === 'error') {
            Emitter.emit('showMessageAlert', {message: Message, status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'change_success', status: 'success'});
        }
        closeModal();
    };


    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '350px'}}>
                        <button
                            className=" absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
                            onClick={closeModal}
                        >
                            <span>×</span>
                        </button>
                        <div className="w-full">
                            {/*content*/}
                            <div
                                className={"h-full flex flex-col justify-between border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <p className=" font-semibold p-8">
                                    {t('storage_path_confirmation')}
                                </p>
                                <div className="p-8">
                                    {t('storage_path_info')}
                                    <br />
                                    <br />
                                    {path}
                                </div>
                                {/*footer*/}
                                <div className="flex items-center p-8 rounded-b justify-end">
                                    <ButtonCancel event={closeModal} text={t('cancel')}/>
                                    <ButtonConfirm valid={true} event={checkPath} text={t('confirm')}/>
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