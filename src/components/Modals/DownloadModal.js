import React, {useEffect, useState, useContext, useRef} from "react";
import {mainContext} from "reducer";
import {Progress} from 'antd';
import {downloadFile, downloadFolder} from "services/filesService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function DownloadModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const name = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);

    useEffect(() => {
        const set = async function (params) {
            console.log("openDownloadModal event has occured");
            openModal();
            name.current = params.name;
            let result = await download(params.hash, params.name, params.size, params.type);
            console.log(result);
        };
        Emitter.on("openDownloadModal", set);
        return () => {
            Emitter.removeListener('openDownloadModal');
            document.getElementsByTagName('body')[0].style.overflow = '';
        }
    }, []);

    const download = async (hash, name, size, type) => {
        let onDownLoadProgress = (progress) => {
            let percentage = Math.round(progress.loaded / size * 100);
            setPercentage(percentage);
        };
        setErr(false);
        let result;
        if (type === 2) {
            result = await downloadFile(hash, name, size, onDownLoadProgress, setErr);
        }
        if (type === 1) {
            result = await downloadFolder(hash, name, size, onDownLoadProgress, setErr);
        }
        return result;
    };

    const reset = () => {
        setErr(false);
        setPercentage(0);
    };

    const openModal = () => {
        setShowModal(true);
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    };

    const closeModal = () => {
        reset();
        setShowModal(false);
        document.getElementsByTagName('body')[0].style.overflow = '';
    };

    return (
        <>
            {showModal ? (
                <>
                    <div className={"fixed flex z-50 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '300px'}}>
                        <button className="absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
                            onClick={closeModal}
                        >
                            <span>×</span>
                        </button>

                        <div className="w-full ">
                            <div className={" h-full border-0 rounded-lg shadow-lg flex flex-col justify-center items-center " + themeStyle.bg[color] + ' ' + themeStyle.text[color]}>
                                <div className="font-semibold mb-4"> {t('download_status')}  </div>
                                {(!err && percentage < 100) && <Progress type="circle" percent={percentage}/>}
                                {err && percentage < 100 && <Progress type="circle" percent={percentage} status="exception"/>}
                                {percentage >= 100 && <Progress type="circle" percent={percentage}/>}
                                <div className="font-semibold mt-4 w-full overflow-auto text-center">
                                    {t('downloading')}  &nbsp;
                                    <span className={themeStyle.title[color]}>
                                       {name.current}
                                    </span>
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