import React, {useEffect, useContext} from "react";
import {mainContext} from "reducer";
import {addPeer} from "services/otherService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let inputRef = null;

export default function UploadContractModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        const set = function (params) {
            console.log("openUploadContractModal event has occured");
            setShowModal(true);
        };
        Emitter.on("openUploadContractModal", set);
        return () => {
            Emitter.removeListener('openUploadContractModal');
        }
    }, []);

    const close = () => {
        setShowModal(false);
    };

    return (

        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed z-50 rounded-lg shadow-lg md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "") + themeStyle.bg[color] + themeStyle.text[color]}
                        style={{height: '500px'}}>

                        {/*header*/}
                        <div className="w-full p-4 flex justify-between items-center">
                            <span className="font-semibold">
                                Contract Detail
                            </span>

                            <button
                                className="bg-transparent text-2xl font-semibold outline-none focus:outline-none text-blueGray-400"
                                onClick={close}
                            >
                                <span>×</span>
                            </button>
                        </div>
                        <div className="w-full ">
                            {/*content*/}
                            <div className="h-full flex flex-col justify-center">

                                    <div className="p-4 flex justify-between">
                                        <div className="px-4">
                                            <p>Contract ID</p>
                                            <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                                        </div>
                                        <div className="px-4">
                                            <p>Status</p>
                                            <p className='text-red-500'>Effective</p>
                                        </div>
                                    </div>

                                    <div className="px-4 flex justify-between">
                                        <div className={"break-all p-4 " + (color==='light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                            <p>Renter ID</p>
                                            <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                                        </div>
                                        <div></div>
                                        <div className={"break-all p-4 " + (color==='light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                            <p>Host ID</p>
                                            <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className={"p-4 " + (color==='light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                            <div className="p-2">
                                                File hash: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                            </div>

                                            <div className="flex">
                                                <div className="flex-1">
                                                    <p className="p-2">File Size: 1.63 GB</p>
                                                    <p className="p-2">Rent Period: 6 Month</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="p-2">Shard Count: 1258</p>
                                                    <p className="p-2">Rent Start: 2022/03/03</p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="p-2">Shard Size: 100 KB</p>
                                                    <p className="p-2">Rent End: 2022/09/02</p>
                                                </div>
                                            </div>

                                            <div className="">
                                                <p className="p-2">Price: 7680 BTT (GB/Month)</p>
                                                <p className="p-2 text-xl font-semibold">Cheque Amount: 10268 WBTT</p>
                                            </div>
                                        </div>
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