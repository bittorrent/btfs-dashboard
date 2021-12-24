import React, {useEffect, useContext} from "react";
import {mainContext} from "reducer";
import {addPeer} from "services/otherService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let inputRef = null;

export default function AddConnectionModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        const set = function (params) {
            console.log("openAddConnectionModal event has occured");
            setShowModal(true);
        };
        Emitter.on("openAddConnectionModal", set);
        return () => {
            Emitter.removeListener('openAddConnectionModal');
        }
    }, []);

    const add = async () => {
        setShowModal(false);
        let {Strings, Type, Message} = await addPeer(inputRef.value);
        if(Strings && Strings.length){
            Emitter.emit('showMessageAlert', {message: 'add_connection_success', status: 'success', type:'frontEnd'});
        } else {
            if(Type==='error') {
                Emitter.emit('showMessageAlert', {message: Message, status: 'error'});
            } else {
                Emitter.emit('showMessageAlert', {message: 'add_connection_failed', status: 'error', type:'frontEnd'});
            }
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
                            <div className={"h-full border-0 rounded-lg shadow-lg flex flex-col justify-between " + themeStyle.bg[color] + themeStyle.text[color]}>
                                {/*header*/}
                                <div className="flex items-start justify-between p-4">
                                    <p className="text-1xl font-semibold">
                                        {t('add_connection')}
                                    </p>
                                </div>
                                {/*body*/}
                                <div className="relative p-4">

                                    <p className="pb-4">
                                        {t('address_to_connect')}
                                        <br/>
                                        E.G.  /ip4/76.176.168.65/tcp/4001/p2p/QmbBHw1Xx9pUpAbrVZUKTPL5R
                                    </p>
                                    <input type="text"
                                           className={"p4 border-0 px-3 py-3 placeholder-blueGray-300 rounded text-sm shadow focus:outline-none focus:ring w-full " +  themeStyle.bg[color]}
                                           placeholder="Address"
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
                                        {t('cancel')}
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={add}
                                    >
                                        {t('confirm')}
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