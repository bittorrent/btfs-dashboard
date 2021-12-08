/*eslint-disable*/
import React, {useEffect, useState, useContext, useRef} from "react";
import {mainContext} from "reducer";
import {Progress} from 'antd';
import {uploadFiles} from "services/filesService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function UploadModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const name = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const set = async function (params) {
            console.log("openUploadModal event has occured");
            setShowModal(true);
            name.current = params.data[0].path.split('/')[0];
            await upload(params.data, params.path, name.current);
            Emitter.emit('updateFiles');
        };
        Emitter.on("openUploadModal", set);
        return () => {
            Emitter.removeListener('openUploadModal');
        }
    }, []);

    const onUploadProgress = function (label) {
        return (progress, totalSize) => {
            if (label === name.current) {
                let percentage = Math.round(progress / totalSize * 100);
                setPercentage(percentage);
            }
        }
    };

    const upload = async (input, path, label) => {
        reset();
        let result = await uploadFiles(input, path, onUploadProgress(name.current), setErr, setMessage);
        if (result && label === name.current) {
            setPercentage(100);
        }
    };

    const close = () => {
        reset();
        setShowModal(false);
    };

    const reset = () => {
        setErr(false);
        setMessage(null);
        setPercentage(0);
    }

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '300px'}}>
                        <button
                            className="absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
                            onClick={close}
                        >
                            <span>×</span>
                        </button>

                        <div className="w-full ">
                            <div
                                className={"px-4 h-full border-0 rounded-lg shadow-lg flex flex-col justify-center items-center" + themeStyle.bg[color] + ' ' + themeStyle.text[color]}>
                                <div className="font-semibold mb-4"> {t('upload_status')} </div>
                                {!err && <Progress type="circle" percent={percentage}/>}
                                {err && <Progress type="circle" percent={percentage} status="exception"/>}
                                <div className="font-semibold mt-4 w-full overflow-auto text-center">
                                    {t('uploading')} &nbsp;
                                    <span className={themeStyle.title[color]}>
                                        {name.current}
                                    </span>
                                </div>
                                {message &&
                                <div className="font-semibold mt-4 w-full overflow-auto text-center"> {message} </div>}
                                <div style={{height: '25px'}}>
                                    {(!err && percentage === 0) && <img alt="" style={{height: '25px'}} src={require('../../assets/img/bar-loading.svg').default}/>}
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