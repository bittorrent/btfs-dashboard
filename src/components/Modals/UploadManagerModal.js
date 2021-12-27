import React, {useEffect, useContext} from "react";
import {mainContext} from "reducer";
import {Progress} from 'antd';
import {addPeer} from "services/otherService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t, Truncate} from "utils/text.js";

let strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

export default function UploadManagerModal({color}) {
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        const set = function (params) {
            console.log("openManagerModal event has occured");
            setShowModal(true);
        };
        Emitter.on("openManagerModal", set);
        return () => {
            Emitter.removeListener('openManagerModal');
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
                                Upload Manager
                            </span>

                            <button
                                className="bg-transparent text-2xl font-semibold outline-none focus:outline-none text-blueGray-400"
                                onClick={close}
                            >
                                <span>×</span>
                            </button>
                        </div>
                        <div className="w-full overflow-auto" style={{height: '400px'}}>
                            {/*content*/}
                            <div className="flex flex-col justify-center">

                                <div
                                    className={"mx-4 py-2 mb-2 " + (color === 'light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                    <div className="px-2 flex justify-between">
                                        <div>
                                            <p> File Name: 123.pdf </p>
                                            <p> xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx </p>
                                        </div>
                                        <div>
                                            1.35 GB
                                        </div>
                                    </div>
                                    <div className="p-4">

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
                                        </div>


                                    </div>
                                </div>

                                <div
                                    className={"mx-4 py-2 mb-2 " + (color === 'light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                    <div className="px-2 flex justify-between">
                                        <div>
                                            <p> File Name: 123.pdf </p>
                                            <p> xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx </p>
                                        </div>
                                        <div>
                                            1.35 GB
                                        </div>
                                    </div>
                                    <div className="p-4">

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
                                        </div>


                                    </div>
                                </div>

                                <div
                                    className={"mx-4 py-2 mb-2 " + (color === 'light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                    <div className="px-2 flex justify-between">
                                        <div>
                                            <p> File Name: 123.pdf </p>
                                            <p> xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx </p>
                                        </div>
                                        <div>
                                            1.35 GB
                                        </div>
                                    </div>
                                    <div className="p-4">

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
                                        </div>


                                    </div>
                                </div>

                                <div
                                    className={"mx-4 py-2 mb-2 " + (color === 'light' ? 'bg-blueGray-50' : 'bg-lightBlue-800')}>
                                    <div className="px-2 flex justify-between">
                                        <div>
                                            <p> File Name: 123.pdf </p>
                                            <p> xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx </p>
                                        </div>
                                        <div>
                                            1.35 GB
                                        </div>
                                    </div>
                                    <div className="p-4">

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="w-1/4">
                                                <Truncate>{'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}</Truncate></div>
                                            <div className="w-3/4"><Progress className={color} strokeColor={strokeColor}
                                                                             percent={10 * 10}
                                                                             format={() => (100 + '%')}/></div>
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