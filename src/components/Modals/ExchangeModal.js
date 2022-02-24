import React, {useState, useEffect, useContext, useRef} from "react";
import {useIntl} from 'react-intl';
import {mainContext} from "reducer";
import {withdraw, deposit} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {inputCheck} from "utils/checks.js";
import {t} from "utils/text.js";

export default function ExchangeModal({color}) {
    const intl = useIntl();
    const inputRefBTT = useRef(null);
    const inputRefWBTT = useRef(null);
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);
    const [maxBTT, setMaxBTT] = useState(0);
    const [maxWBTT, setMaxWBTT] = useState(0);
    const [value, setValue] = useState(null);
    const [target, setTarget] = useState('BTT');

    useEffect(() => {
        const set = function (params) {
            console.log("openExchangeModal event has occured");
            setMaxBTT(params.maxBTT);
            setMaxWBTT(params.maxWBTT);
            setShowModal(true);
        };
        Emitter.on("openExchangeModal", set);
        return () => {
            Emitter.removeListener('openExchangeModal');
        }
    }, []);


    const _exchange = async () => {
        console.log(value, target);
        setShowModal(false);
        return;
        let result = await deposit(0);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'deposit_success', status: 'success', type: 'frontEnd'});
        }
    };

    const setMaxBTTNum = () => {
        inputRefBTT.current.value = maxBTT;
        setValue(maxBTT);
    };

    const setMaxWBTTNum = () => {
        inputRefWBTT.current.value = maxWBTT;
        setValue(maxWBTT);
    };

    const inputChange = (e) => {
        console.log(e.target.value);
        setValue(e.target.value);
    };

    const reverse = () => {
        setValue(null);
        setTarget(target === 'BTT' ? 'WBTT' : 'BTT');
    };

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '300px'}}>

                        <div className="w-full">
                            {/*content*/}
                            <div
                                className={"flex flex-col justify-between h-full border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                {/*header*/}
                                <div className="p-4">
                                    <p className="font-semibold">
                                        BTT - WBTT {t('Exchange')}
                                    </p>
                                </div>
                                {/*body*/}
                                <div className="relative p-4">
                                    {
                                        target === 'BTT' && <div className="flex justify-between">
                                            <div className="grow">
                                                <div className='text-center font-semibold text-lg mb-4'>BTT</div>
                                                <div className='flex'>
                                                    <div className="inputTransition">
                                                        <input
                                                            className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full " + themeStyle.bg[color]}
                                                            placeholder={intl.formatMessage({id: 'max_amount'}) + ' : ' + maxBTT}
                                                            onChange={inputChange}
                                                            type="number"
                                                            min="0"
                                                            ref={inputRefBTT}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                            onClick={setMaxBTTNum}>MAX
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='grow-0 text-lg cursor-pointer text-xl' onClick={reverse}>
                                                <i className="fas fa-arrow-alt-circle-right"></i>
                                            </div>
                                            <div className="grow">
                                                <div className='text-center font-semibold text-lg mb-4'>WBTT</div>
                                                <div className='flex'>
                                                    <div className="inputTransition">
                                                        <input
                                                            className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full text-center " + themeStyle.bg[color]}
                                                            disabled="disabled"
                                                            value={value}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        target === 'WBTT' && <div className="flex justify-between">
                                            <div className="grow">
                                                <div className='text-center font-semibold text-lg mb-4'>WBTT</div>
                                                <div className='flex'>
                                                    <div className="inputTransition">
                                                        <input
                                                            className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full " + themeStyle.bg[color]}
                                                            placeholder={intl.formatMessage({id: 'max_amount'}) + ' : ' + maxWBTT}
                                                            onChange={inputChange}
                                                            type="number"
                                                            min="0"
                                                            ref={inputRefWBTT}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                            onClick={setMaxWBTTNum}>MAX
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='grow-0 text-lg cursor-pointer text-xl' onClick={reverse}>
                                                <i className="fas fa-arrow-alt-circle-right"></i>
                                            </div>
                                            <div className="grow">
                                                <div className='text-center font-semibold text-lg mb-4'>BTT</div>
                                                <div className='flex'>
                                                    <div className="inputTransition">
                                                        <input
                                                            className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full text-center " + themeStyle.bg[color]}
                                                            disabled="disabled"
                                                            value={value}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className='mt-4'>
                                        {t('est_fee')}: &nbsp;
                                        <span className='text-xl font-semibold'>15 BTT</span>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end px-4 pb-4 rounded-b">
                                    <div>
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
                                            onClick={_exchange}
                                        >
                                            {t('confirm')}
                                        </button>
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