import React, {useState, useEffect, useContext, useRef, useCallback} from "react";
import {useIntl} from 'react-intl';
import {Select, Tooltip} from 'antd';
import {mainContext} from "reducer";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import ButtonCancel from "components/Buttons/ButtonCancel.js";
import ButtonConfirm from "components/Buttons/ButtonConfirm.js";
import {withdraw, deposit, withdraw10} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {FEE, MULTIPLE_CURRENY_LIST} from "utils/constants.js";
import {inputNumberCheck} from "utils/checks.js";

const {Option} = Select;

export default function WithdrawDepositModal({color}) {
    const intl = useIntl();
    const inputRef = useRef(null);
    const tokenRef = useRef('WBTT');
    const {state} = useContext(mainContext);
    const {sidebarShow} = state;
    const [type, setType] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [max, setMax] = useState(0);
    const [account, setAccount] = useState(null);
    const [valid, setValid] = useState(false);
    const maxRef = useRef(null);

    useEffect(() => {
        const set = function (params) {
            openModal();
            setType(params.type);
            let currentObj = {};

            if (params.type === 'withdraw') {
                setTitle('chequebook_withdraw');
                setDescription("amount_to_withdraw");
                setMax(params.maxWBTT);
                params.allCurrencyBalanceList.forEach(item => {
                    currentObj[item.key] = item.maxBookBalanceCount;
                });
            }
            if (params.type === 'deposit') {
                setTitle('chequebook_deposit');
                setDescription("amount_to_deposit");
                setMax(params.maxWBTT);
                params.allCurrencyBalanceList.forEach(item => {
                    currentObj[item.key] = item.maxAddressCount;
                });
            }
            if (params.type === 'withdraw10') {
                setTitle('BTFS_10_withdraw');
                setDescription('10_withdraw_description');
                setAccount(params.account);
                setMax(params.maxBTT);
                if(params.maxBTT) {
                    setValid(true);
                    // setTimeout(()=>{
                    //     inputRef.current.value = params.maxBTT;
                    // }, 100);
                }
            }
           
            maxRef.current = currentObj;
        };
        Emitter.on("openWithdrawDepositModal", set);
        return () => {
            Emitter.removeListener('openWithdrawDepositModal');
            window.body.style.overflow = '';
        }
    }, []);

    const _withdraw10 = async () => {
        let amount = inputRef.current.value;
        closeModal();
        let result = await withdraw10(amount);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'withdraw_success', status: 'success', type: 'frontEnd'});
            Emitter.emit("updateWallet");
        }
        // needPWD()
    };

    /*
    const needPWD = () => {
        Emitter.emit('openPWDModal', {type: 'init', amount: inputRef.current.value});
        closeModal();
    };*/

    const _withdraw = async () => {
        let amount = inputRef.current.value;
        closeModal();
        let result = await withdraw(amount, tokenRef.current);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'withdraw_success', status: 'success', type: 'frontEnd'});
            Emitter.emit("updateWallet");
        }
    };

    const _deposit = async () => {
        let amount = inputRef.current.value;
        closeModal();
        let result = await deposit(amount, tokenRef.current);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', {message: result['Message'], status: 'error'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'deposit_success', status: 'success', type: 'frontEnd'});
            Emitter.emit("updateWallet");
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
        withdraw10: _withdraw10
    };

    const setMaxNum = () => {
        if (type === 'withdraw10' && max > 99999) {
            inputRef.current.value = 99999
            return
        }
        inputRef.current.value = max;
        check();
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
    const handleChange = useCallback((value) => {
        tokenRef.current = value;
        inputRef.current.value = null;
        if (value === 'BTT') {
            setMax(maxRef.current.BTT);
        }else{
            setMax(maxRef.current[value]);
        }

    }, []);

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={"fixed flex z-50 md:w-1/2 md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " + (sidebarShow ? "md:left-64" : "")}
                        style={{height: 'min-content'}}>
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
                                    {type === 'withdraw10' && <p className="pb-4">
                                        {t('node_tron_addr')} : <span className='font-semibold'> {account} <ClipboardCopy value={account}/> </span>
                                    </p>
                                    }
                                    <p className="pb-4">
                                        {t(description)}
                                        <br/>
                                    </p>
                                    <div className="flex justify-center items-center">
                                        {
                                            type !== 'withdraw10'? <div>
                                            <Select className={color} defaultValue="WBTT" style={{width: 100}}
                                                onChange={handleChange}
                                                    dropdownStyle={{background: themeStyle.bg[color]}}>
                                                {
                                                    MULTIPLE_CURRENY_LIST.map(item=>{
                                                        return (
                                                            <Option value={item.key}>{item.unit}</Option>
                                                        )
                                                    })
                                                }
                                            
                                            </Select>
                                        </div>: ""
                                        }
                                        
                                        <div className="inputTransition flex-1">
                                            <input
                                                className={"p4 mb-1 border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full " + themeStyle.bg[color]}
                                                placeholder={type === 'withdraw10' ? intl.formatMessage({id: 'available'}) + ' : ' + max  : intl.formatMessage({id: 'max_amount'}) + ' : ' + max}
                                                onChange={inputChange}
                                                type="number"
                                                min="0"
                                                // disabled={type !== 'withdraw10' ? false : true}
                                                ref={inputRef}
                                            />
                                        </div>
                                        {/* {type !== 'withdraw10' && <div>
                                            <button
                                                className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                onClick={setMaxNum}>MAX
                                            </button>
                                        </div>} */}
                                        <div>
                                            <button
                                                className="bg-indigo-500 text-white active:bg-indigo-600 h-full rounded focus:outline-none p-2 ease-linear transition-all duration-150"
                                                onClick={setMaxNum}>MAX
                                            </button>
                                        </div>
                                    </div>

                                        {type === 'withdraw10' && <p className="pb-4">
                                            <br />
                                            {t('BTFS_10_withdraw_limit')} : 1000-99999 BTT
                                        </p>
                                        }
                                    </div>
                                {/*footer*/}
                                <div
                                    className={"flex items-center p-4 rounded-b " + (type !== 'withdraw10' ? 'justify-between' : 'justify-end')}>
                                    <div className={type !== 'withdraw10' ? 'block' : 'hidden'}>
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