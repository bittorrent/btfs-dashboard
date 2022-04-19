import React, {useEffect, useContext, useRef} from "react";
import {mainContext} from "reducer";
import QRCode from "qrcode.react";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";

export default function QRModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = React.useState(false);
    const address = useRef(null);

    useEffect(() => {
        const set = function (params) {
            console.log("openQRModal event has occured");
            openModal();
            address.current = params.address;
        };
        Emitter.on("openQRModal", set);
        return () => {
            Emitter.removeListener('openQRModal');
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

    return (
        <>
            {showModal ? (
                <>
                    <div className={"fixed flex z-50 md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '350px'}}>
                        <button className=" absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
                            onClick={closeModal}
                        >
                            <span>×</span>
                        </button>
                        <div className="w-full">
                            {/*content*/}
                            <div className={"h-full flex flex-col justify-center items-center border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="w-1/2 h-1/2">
                                    <QRCode style={{margin: 'auto'}} value={address.current}/><br/>
                                </div>
                                <div className="input-group mt-3">
                                    <div className="input-group-append">
                                        {address.current}
                                        <ClipboardCopy value={address.current}/>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        </div>
                    </div>
                    <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full inset-0 z-40"></div>
                </>
            ) : null}
        </>
    );
}