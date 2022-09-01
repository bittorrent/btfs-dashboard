import React, {useState, useEffect, useContext} from "react";
import {mainContext} from "reducer";
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";


export default function ConfigConfirmModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const set = function (params) {
            openModal();
        };
        Emitter.on("openConfigConfirmModal", set);
        return () => {
            Emitter.removeListener('openConfigConfirmModal');
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

    const resetConfigData = async () => {
        Emitter.emit('handleResetConfig', {});
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
                                    {t('reset_advance_config_title')}
                                </p>
                                <div className="p-8">
                                    {t('reset_advance_config_tips')}
                                    <br />
                                    <br />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center p-8 rounded-b justify-end">
                                    <ButtonCancel event={closeModal} text={t('cancel')}/>
                                    <ButtonConfirm valid={true} event={resetConfigData} text={t('confirm')}/>
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