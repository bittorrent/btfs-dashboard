import React, {useEffect, useState, useContext, useCallback, useRef} from "react";
import {useIntl} from 'react-intl';
import {mainContext} from "reducer";
import {Select} from 'antd';
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {FEE} from "utils/constants.js";
import {inputAddressCheck, inputNumberCheck} from "utils/checks.js";

const {Option} = Select;

export default function TransferConfirmModal({color}) {
    const intl = useIntl();
    const inputAddressRef = useRef(null);
    const inputAmountRef = useRef(null);
    const tokenRef = useRef('BTT');
    const maxRef = useRef(null);
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [max, setMax] = useState(0);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const set = async function (params) {
            console.log("openTransferConfirmModal event has occured");
            maxRef.current = {
                BTT: (params.maxBTT - FEE) > 0 ? params.maxBTT - FEE : 0,
                WBTT: params.maxWBTT
            };
            setMax(maxRef.current.BTT);
            setShowModal(true);
        };
        Emitter.on("openTransferConfirmModal", set);
        return () => {
            Emitter.removeListener('openTransferConfirmModal');
        }
    }, []);

    const next = async () => {
        setShowConfirm(true);
        console.log(inputAddressRef.current.value, inputAmountRef.current.value, tokenRef.current);
    };

    const submit = async () => {
        setShowModal(false);
        setShowConfirm(false);
        console.log(inputAddressRef.current.value, inputAmountRef.current.value, tokenRef.current);
    };

    const check = () => {
        if (inputAddressCheck(inputAddressRef.current.value) && inputNumberCheck(inputAmountRef.current.value, max)) {
            setValid(true);
            return true;
        } else {
            setValid(false);
            return false;
        }
    };

    const close = () => {
        setShowConfirm(false);
    };

    const setMaxNum = () => {
        inputAmountRef.current.value = max;
    };

    const inputChange = () => {
        check();
    };

    const handleChange = useCallback((value) => {
        tokenRef.current = value;
        inputAmountRef.current.value = null;
        if (value === 'BTT') {
            setMax(maxRef.current.BTT);
        }
        if (value === 'WBTT') {
            console.log(maxRef.current.WBTT);
            setMax(maxRef.current.WBTT);
        }
    }, []);

    return (
        <>
            {
                showConfirm ? (
                    <>
                        <div
                            className={"fixed flex z-100 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                            style={{height: '300px'}}>
                            <button
                                className="absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
                                onClick={close}
                            >
                                <span>×</span>
                            </button>
                            <div className="w-full">
                                {/*content*/}
                                <div
                                    className={"flex flex-col justify-between h-full border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                    {/*header*/}
                                    <div className="p-4">
                                        <p className=" font-semibold">
                                            {t('transfer')}  {t('confirmation')}
                                        </p>
                                    </div>
                                    {/*body*/}
                                    <div className="relative px-4 flex flex-col">

                                        <div>
                                            <p className='p-2'>Send to</p>
                                            <p className='p-2 font-semibold'>{inputAddressRef.current.value}</p>
                                        </div>

                                        <div className="flex">
                                            <div className="flex-1">
                                                <p className='p-2'>Transfer Amount</p>
                                                <p className='p-2 font-semibold'>{inputAmountRef.current.value} &nbsp; {tokenRef.current}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className='p-2'>Estimated transaction fee</p>
                                                <p className='p-2 font-semibold'>{FEE} BTT</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div
                                        className="flex flex-wrap items-center justify-center lg:justify-between p-4 rounded-b">
                                        <div>
                                            {t('total')}: &nbsp;
                                            <span className='text-xl font-semibold'>{inputAmountRef.current.value} BTT + {FEE} BTT</span>
                                        </div>
                                        <div>
                                            <ButtonConfirm event={submit} valid={true} text={t('confirm')}/>
                                        </div>
                                    </div>
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
                        <div
                            className={"fixed flex z-50 modal_center md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                            style={{height: '300px'}}>
                            <div className="w-full">
                                {/*content*/}
                                <div
                                    className={"flex flex-col justify-between h-full border-0 rounded-lg shadow-lg " + themeStyle.bg[color] + themeStyle.text[color]}>
                                    {/*header*/}
                                    <div className="p-4">
                                        <p className=" font-semibold">
                                            {t('transfer')}
                                        </p>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-4 flex flex-col">

                                        <div className="flex pb-2">
                                            <div className='mr-4 font-semibold w-50-px flex items-center'>To</div>
                                            <div className="inputTransition flex-1">
                                                <input
                                                    className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full h-35-px " + themeStyle.bg[color]}
                                                    type="text"
                                                    placeholder='please enter BTTC address'
                                                    onChange={inputChange}
                                                    ref={inputAddressRef}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex pt-2">
                                            <div className='mr-4 font-semibold w-50-px flex items-center'>Amount</div>
                                            <div>
                                                <Select className={color} defaultValue="BTT" style={{width: 90}}
                                                        onChange={handleChange}
                                                        dropdownStyle={{background: themeStyle.bg[color]}}>
                                                    <Option value="BTT">BTT</Option>
                                                    <Option value="WBTT">WBTT</Option>
                                                </Select>
                                            </div>
                                            <div className="inputTransition flex-1">
                                                <input
                                                    className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full h-35-px " + themeStyle.bg[color]}
                                                    placeholder={intl.formatMessage({id: 'max_amount'}) + ' : ' + max}
                                                    onChange={inputChange}
                                                    type="number"
                                                    min="0"
                                                    ref={inputAmountRef}
                                                />
                                            </div>
                                            <div>
                                                <button
                                                    className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                    onClick={setMaxNum}>MAX
                                                </button>
                                            </div>
                                        </div>
                                        <p className='pt-4'>The available maximum amount = Maximum Amount - Estimated Transaction Fee </p>
                                    </div>
                                    {/*footer*/}
                                    <div
                                        className="flex flex-wrap items-center justify-center lg:justify-between p-4 rounded-b">
                                        <div>
                                            {t('est_fee')}: &nbsp;
                                            <span className='text-xl font-semibold'>{FEE} BTT</span>
                                        </div>
                                        <div>
                                            <ButtonCancel event={setShowModal} text={t('cancel')}/>
                                            <ButtonConfirm event={next} valid={valid} text={t('next')}/>
                                        </div>
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