import React, {useState, useEffect, useContext} from "react";
import {mainContext} from "reducer";
import {Radio} from 'antd';
import {addPeer} from "services/otherService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let inputRef = null;

export default function UploadToBTFSModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(1);

    useEffect(() => {
        const set = function (params) {
            console.log("openUpload2BTFSModal event has occured");
            setShowModal(true);
        };
        Emitter.on("openUpload2BTFSModal", set);
        return () => {
            Emitter.removeListener('openUpload2BTFSModal');
        }
    }, []);

    const close = () => {
        setShowModal(false);
    };

    const onChange = e => {
        setValue(e.target.value);
    };

    return (

        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex flex-col justify-between z-50 rounded-lg shadow-lg md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "") + themeStyle.bg[color] + themeStyle.text[color]}
                        style={{height: '360px'}}>

                        {/*header*/}
                        <div className="w-full p-4 flex justify-between items-center">
                            <span className="font-semibold">
                                Upload To BTFS
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
                            <div className="h-full flex flex-col justify-between px-4 ">
                                <div
                                    className={"break-all p-4 flex justify-between items-center " + (color === 'light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                    <div className="">
                                        <p>Renter ID</p>
                                        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                                    </div>
                                    <div>
                                        1.32 GB
                                    </div>
                                </div>
                                <div className="pt-4 ">Please choose how long do you want to storage the file.</div>
                                <div className="pt-4">
                                    <Radio.Group onChange={onChange} value={value}>
                                        <Radio value={'30d'}>30 days</Radio>
                                        <Radio value={'180d'}>180 days</Radio>
                                        <Radio value={'360d'}>360 days</Radio>
                                        <Radio value={'customize'}>Customize</Radio>
                                    </Radio.Group>
                                </div>
                                <div className="py-4 flex justify-between">
                                    <div> Price: 7680 WBTT（GB/Month）</div>
                                    <div> Total Cost: <span className="text-xl font-semibold">5417.2141 WBTT</span></div>
                                </div>
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-4 rounded-b">
                            <button
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                    <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full inset-0 z-40"></div>
                </>
            ) : null}

        </>
    );
}