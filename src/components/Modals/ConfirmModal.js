import React, {useEffect, useState, useContext, useRef} from "react";
import {mainContext} from "reducer";
import {Progress} from 'antd';
import {cash} from "services/chequeService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {precision} from "utils/BTFSUtil.js";

export default function ConfirmModal({color}) {

    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const cashList = useRef([]);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const set = async function (params) {
            console.log("openConfirmModal event has occured");
            cashList.current.list = params.data;
            cashList.current.total = 0;

            cashList.current.list.forEach((item) => {
                cashList.current.total = (cashList.current.total + item.amount);
            });

            cashList.current.total = cashList.current.total / precision;

            setShowModal(true);
        };
        Emitter.on("openConfirmModal", set);
        return () => {
            Emitter.removeListener('openConfirmModal');
        }
    }, []);

    const onCashProgress = (progress, totalSize) => {
        let percentage = Math.round(progress / totalSize * 100);
        setPercentage(percentage);
    };

    const submit = async () => {
        reset();
        setShowModal(false);
        setShowResult(true);
        let result = await cash(cashList.current.list, onCashProgress, setErr, setMessage);

        if (result) {
            setPercentage(100);
        }

        Emitter.emit('updateCashingList');
    };

    const close = () => {
        reset();
        setShowModal(false);
        setShowResult(false);
    };

    const reset = () => {
        setErr(false);
        setMessage(null);
        setPercentage(0);
    };

    return (
        <>
            {
                showResult ? (
                    <>
                        <div className={"fixed flex z-50 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
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
                                    <div className="font-semibold mb-4"> {t('cashing_status')} </div>
                                    {!err && <Progress type="circle" percent={percentage}/>}
                                    {err && <Progress type="circle" percent={percentage} status="exception"/>}
                                    {message && <div className="font-semibold mt-4 w-full overflow-auto text-center"> {message} </div>}
                                </div>
                            </div>
                        </div>
                        <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full inset-0 z-40"></div>
                    </>
                ) : null
            }
            {
                showModal ? (
                    <>
                        <div className={"fixed flex z-50 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                            style={{height: '300px'}}>
                            <div className="w-full">
                                {/*content*/}
                                <div
                                    className={"flex flex-col justify-between h-full border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                    {/*header*/}
                                    <div className="p-4">
                                        <p className=" font-semibold">
                                            {t('cash_confirm')}
                                        </p>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-4 flex-auto">
                                        <p className="pb-2">
                                            {t('cashing')} {t('from')} {cashList.current.list.length} {t('vault')}
                                            <br/>
                                        </p>
                                        <div
                                            className={" flex flex-col " + (color === 'light' ? 'bg-blueGray-100' : 'bg-blueGray-600')}>
                                            <div className='flex justify-between p-3'>
                                                <div>{t('total')}</div>
                                                <div className='text-xl font-semibold'>{cashList.current.total} WBTT
                                                </div>
                                            </div>
                                            <div className='flex justify-between p-3'>
                                                <div>{t('est_fee')}</div>
                                                <div className='text-xl font-semibold'>
                                                    {parseFloat(25.2801 * cashList.current.list.length).toFixed(2)} BTT
                                                </div>
                                            </div>
                                        </div>
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
                                            onClick={submit}
                                        >
                                            {t('confirm')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full inset-0 z-40"></div>
                    </>
                ) : null
            }
        </>
    );
}