import React, {useState, useEffect, useContext, useRef} from "react";
import {useIntl} from 'react-intl';
import {Tooltip} from 'antd';
import {mainContext} from "reducer";
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import {withdraw, deposit} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {FEE} from "utils/constants.js";
import {inputNumberCheck} from "utils/checks.js";

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
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const set = function (params) {
            console.log("openWithdrawDepositModal event has occured");
            openModal();
            setType(params.type);
            if (params.type === 'withdraw') {
                setTitle('chequebook_withdraw');
                setDescription("amount_to_withdraw");
                setMax((params.maxBTT - FEE) > 0 ? params.maxWBTT : 0);
            }
            if (params.type === 'deposit') {
                setTitle('chequebook_deposit');
                setDescription("amount_to_deposit");
                setMax((params.maxBTT - FEE) > 0 ? params.maxWBTT : 0);
            }
            if (params.type === 'change') {
                setTitle('Change Recipient Address');
                setDescription("Please enter new recipient address below.");
            }
        };
        Emitter.on("openWithdrawDepositModal", set);
        return () => {
            Emitter.removeListener('openWithdrawDepositModal');
        }
    }, []);

    const _withdraw = async () => {
        let amount = inputRef.current.value;
        closeModal();
        let result = await withdraw(amount);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'withdraw_success', status: 'success', type: 'frontEnd'});
        }
    };

    const _deposit = async () => {
        let amount = inputRef.current.value;
        closeModal();
        let result = await deposit(amount);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'deposit_success', status: 'success', type: 'frontEnd'});
        }
    };

    const check = () => {
        if (inputNumberCheck(inputRef.current.value, max)) {
            setValid(true);
            return true;
        } else {
            setValid(false);
            return false;
        }
    };

    const inputChange = () => {
        check();
    };

    const manipulation = {
        withdraw: _withdraw,
        deposit: _deposit,
    };

    const setMaxNum = () => {
        inputRef.current.value = max;
    };

    const openModal = () => {
        setShowModal(true);
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    };

    const closeModal = () => {
        setValid(false);
        setShowModal(false);
        document.getElementsByTagName('body')[0].style.overflow = '';
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
                                                onChange={inputChange}
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
                                        <span className='text-xl font-semibold'>{FEE} BTT</span>
                                        <Tooltip placement="bottom"
                                                 title={
                                                     <>
                                                         <p>{t('amount_available_check_2')}</p>
                                                         <p>{t('amount_available_check_3')}</p>
                                                     </>
                                                 }>
                                            <i className="fas fa-question-circle text-lg ml-2"></i>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <ButtonCancel event={closeModal} text={t('cancel')}/>
                                        <ButtonConfirm event={manipulation[type]} valid={valid} text={t(type)}/>
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