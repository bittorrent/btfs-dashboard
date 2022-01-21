import React, {useState, useEffect, useContext, useRef} from "react";
import {useIntl} from 'react-intl';
import {mainContext} from "reducer";
import {withdraw, deposit} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {inputCheck} from "utils/checks.js";
import {t} from "utils/text.js";

export default function WithdrawDepositModal({color}) {
    const intl = useIntl();
    const inputRef = useRef(null);
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [type, setType] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [max, setMax] = useState(0);

    useEffect(() => {
        const set = function (params) {
            console.log("openWithdrawDepositModal event has occured");
            setType(params.type);
            if (params.type === 'withdraw') {
                setTitle('chequebook_withdraw');
                setDescription("amount_to_withdraw");
                setMax(params.max);
            }
            if (params.type === 'deposit') {
                setTitle('chequebook_deposit');
                setDescription("amount_to_deposit");
                setMax(params.max);
            }
            if (params.type === 'change') {
                setTitle('Change Recipient Address');
                setDescription("Please enter new recipient address below.");
            }
            setShowModal(true);
        };
        Emitter.on("openWithdrawDepositModal", set);
        return () => {
            Emitter.removeListener('openWithdrawDepositModal');
        }
    }, []);

    const _withdraw = async () => {
        let amount = inputRef.current.value;
        inputCheck();
        setShowModal(false);
        let result = await withdraw(amount);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'withdraw_success', status: 'success', type: 'frontEnd'});
        }
    };

    const _deposit = async () => {
        let amount = inputRef.current.value;
        inputCheck();
        setShowModal(false);
        let result = await deposit(amount);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'deposit_success', status: 'success', type: 'frontEnd'});
        }
    };

    const manipulation = {
        withdraw: _withdraw,
        deposit: _deposit,
    };

    const setMaxNum = () => {
        inputRef.current.value = max;
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
                                    <p className=" font-semibold">
                                        {t(title)}
                                    </p>
                                </div>
                                {/*body*/}
                                <div className="relative p-4">
                                    <p className="pb-4">
                                        {t(description)}
                                        <br/>
                                    </p>
                                    <div className="flex">
                                        <div className="inputTransition flex-1">
                                            <input
                                                className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full " + themeStyle.bg[color]}
                                                placeholder={intl.formatMessage({id: 'max_amount'}) + ' : ' + max}
                                                type="number"
                                                min="0"
                                                ref={inputRef}
                                            />
                                        </div>
                                        <div>
                                            <button className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                    onClick={setMaxNum}>MAX</button>
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-between p-4 rounded-b">
                                    <div>
                                        {t('est_fee')}: &nbsp;
                                        <span className='text-xl font-semibold'>28 BTT</span>
                                    </div>
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
                                            onClick={manipulation[type]}
                                        >
                                            {t(type)}
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