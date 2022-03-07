import React, {useEffect, useContext, useRef} from "react";
import {mainContext} from "reducer";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function MessageModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = React.useState(false);
    const message = useRef(null);

    useEffect(() => {
        const set = function (params) {
            console.log("openMessageModal event has occured");
            openModal();
            message.current = params.message;
        };
        Emitter.on("openMessageModal", set);
        return () => {
            Emitter.removeListener('openMessageModal');
            window.body.style.overflow = '';
        }
    }, []);

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow= 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        window.body.style.overflow = '';
    };

    return (
        <>
            {showModal ? (
                <>
                    <div className={"fixed flex z-50 md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '300px'}}>
                        <button
                            className="absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
                            onClick={closeModal}
                        >
                            <span>×</span>
                        </button>
                        <div className="w-full ">
                            {/*content*/}
                            <div className={"h-full flex flex-col justify-center items-center border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="p-4">
                                    <img alt="" src={require('../../assets/img/key.png').default} width='50px' height='50px'/>
                                </div>
                                <div className="p-4">
                                    {message.current} <ClipboardCopy value={message.current}/>
                                </div>
                                <div className="p-4 font-semibold text-red-500 text-center">
                                    {t('key_warning_1')} <br/>
                                    {t('key_warning_2')}
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