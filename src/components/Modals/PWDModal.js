import React, {useState, useEffect, useContext, useRef} from "react";
import {mainContext} from "reducer";
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import {withdraw10} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function PWDModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState(null);
    const [valid, setValid] = useState(false);
    const inputRef = useRef(null);
    const amountRef = useRef(0);

    useEffect(() => {
        const set = function (params) {
            console.log("openPWDModal event has occured");
            openModal();
            setType(params.type);
            amountRef.current = params.amount;
        };
        Emitter.on("openPWDModal", set);
        return () => {
            Emitter.removeListener('openPWDModal');
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

    const setPWD = async () => {
        let pwd = inputRef.current.value;
        closeModal();
        let result = await withdraw10(amountRef.current, pwd);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'withdraw_success', status: 'success', type: 'frontEnd'});
            Emitter.emit("updateWallet");
        }
    };

    const check = () => {
        if (inputRef.current.value) {
            setValid(true);
            return true;
        } else {
            setValid(false);
            return false;
        }
    };

    const inputChange = () => {
        check();
    };


    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '300px'}}>
                        <button
                            className=" absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
                            onClick={closeModal}
                        >
                            <span>×</span>
                        </button>
                        <div className="w-full">
                            {/*content*/}
                            <div
                                className={"h-full flex flex-col justify-between items-center border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="p-4">
                                    <p className=" font-semibold">
                                        Need to input your password {type}
                                    </p>
                                </div>
                                <div className="inputTransition">
                                    <input
                                        className={"mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full text-center " + themeStyle.bg[color]}
                                        placeholder={'your password'}
                                        onChange={inputChange}
                                        type='text'
                                        ref={inputRef}
                                    />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-between p-4 rounded-b">
                                    <ButtonCancel event={closeModal} text={t('cancel')}/>
                                    <ButtonConfirm event={setPWD} valid={valid} text={t('confirm')}/>
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