import React, {useState, useEffect, useContext, useRef} from "react";
import {useIntl} from 'react-intl';
import {mainContext} from "reducer";
import {Tooltip} from 'antd';
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import {BTT2WBTT, WBTT2BTT} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {FEE} from "utils/constants.js";
import {inputNumberCheck} from "utils/checks.js";

export default function ExchangeModal({color}) {
    const intl = useIntl();
    const inputRefBTT = useRef(null);
    const inputRefWBTT = useRef(null);
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);
    const [maxBTT, setMaxBTT] = useState(0);
    const [maxWBTT, setMaxWBTT] = useState(0);
    const [value, setValue] = useState('');
    const [target, setTarget] = useState('BTT');
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const set = function (params) {
            console.log("openExchangeModal event has occured");
            openModal();
            setMaxBTT(params.maxBTT);
            setMaxWBTT(params.maxWBTT);
            setValue('');
        };
        Emitter.on("openExchangeModal", set);
        return () => {
            Emitter.removeListener('openExchangeModal');
            window.body.style.overflow = '';
        }
    }, []);


    const _exchange = async () => {
        closeModal();
        let result;
        if (target === 'BTT') {
            result = await BTT2WBTT(value);
        }
        if (target === 'WBTT') {
            result = await WBTT2BTT(value);
        }

        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'exchange_success', status: 'success', type: 'frontEnd'});
            Emitter.emit("updateWallet");
        }
    };

    const check = () => {
        if (inputNumberCheck(target==='BTT' ? inputRefBTT.current.value : inputRefWBTT.current.value, target==='BTT' ? maxBTT : maxWBTT)) {
            setValid(true);
            return true;
        } else {
            setValid(false);
            return false;
        }
    };

    const setMaxBTTNum = () => {
        inputRefBTT.current.value = maxBTT;
        setValue(maxBTT);
        check();
    };

    const setMaxWBTTNum = () => {
        inputRefWBTT.current.value = maxWBTT;
        setValue(maxWBTT);
        check();
    };

    const inputChange = (e) => {
        setValue(e.target.value);
        check();
    };

    const reverse = () => {
        setValue('');
        setTarget(target === 'BTT' ? 'WBTT' : 'BTT');
    };

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setValid(false);
        setShowModal(false);
        window.body.style.overflow = '';
    };

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: '350px'}}>

                        <div className="w-full">
                            {/*content*/}
                            <div
                                className={"flex flex-col justify-between h-full border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                {/*header*/}
                                <div className="p-4">
                                    <p className="font-semibold">
                                        BTT - WBTT {t('exchange')}
                                    </p>
                                </div>
                                {/*body*/}
                                <div className="relative p-4">
                                    {
                                        target === 'BTT' && <div className="flex justify-between">
                                            <div className="grow">
                                                <div className='text-center font-semibold text-lg mb-4'>BTT</div>
                                                <div className='flex'>
                                                    <div>
                                                        <button
                                                            className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                            onClick={setMaxBTTNum}>MAX
                                                        </button>
                                                    </div>
                                                    <div className="inputTransition">
                                                        <input
                                                            className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full " + themeStyle.bg[color]}
                                                            placeholder={intl.formatMessage({id: 'max_available_amount'}) + ' : ' + maxBTT}
                                                            onChange={inputChange}
                                                            type="number"
                                                            min="0"
                                                            ref={inputRefBTT}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='grow-0 text-lg cursor-pointer text-xl' onClick={reverse}>
                                                <div className='text-center font-semibold text-lg mb-4'>&nbsp;</div>
                                                <div className='flex items-center h-50-px'>
                                                    <i className="fas fa-arrow-alt-circle-right text-indigo-500"></i>
                                                </div>
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
                                                    <div>
                                                        <button
                                                            className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                            onClick={setMaxWBTTNum}>MAX
                                                        </button>
                                                    </div>
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
                                                </div>
                                            </div>
                                            <div className='grow-0 text-lg cursor-pointer text-xl' onClick={reverse}>
                                                <div className='text-center font-semibold text-lg mb-4'>&nbsp;</div>
                                                <div className='flex items-center h-50-px'>
                                                    <i className="fas fa-arrow-alt-circle-right text-indigo-500"></i>
                                                </div>
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
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-center lg:justify-between p-4 rounded-b">
                                    <div>
                                        {t('est_fee')}: &nbsp;
                                        <span className='text-xl font-semibold'>{FEE} BTT</span>
                                        <Tooltip placement="bottom"
                                                 title={
                                                     <>
                                                         <p>{t('amount_available_check_1')}</p>
                                                         <p>{t('amount_available_check_2')}</p>
                                                         <p>{t('amount_available_check_3')}</p>
                                                     </>
                                                 }>
                                            <i className="fas fa-question-circle text-lg ml-2"></i>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <ButtonCancel event={closeModal} text={t('cancel')}/>
                                        <ButtonConfirm event={_exchange} valid={valid} text={t('confirm')}/>
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