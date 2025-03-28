import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Select, Tooltip } from 'antd';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import ButtonCancel from 'components/Buttons/ButtonCancel.js';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import { withdraw, deposit, withdraw10 } from 'services/dashboardService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { FEE, MULTIPLE_CURRENCY_LIST } from 'utils/constants.js';
import { inputNumberCheck } from 'utils/checks.js';
import CommonModal from './CommonModal';

const { Option } = Select;

export default function WithdrawDepositModal({ color }) {
    const intl = useIntl();
    const inputRef = useRef(null);
    // const tokenRef = useRef('WBTT');/
    const [type, setType] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [max, setMax] = useState(0);
    const [account, setAccount] = useState(null);
    const [valid, setValid] = useState(false);
    const maxRef = useRef(null);
    const [tokenCurrent, setTokenCurrent] = useState('WBTT');


    useEffect(() => {
        const set = function (params) {
            openModal();
            setType(params.type);
            let currentObj = {};
            const token = tokenCurrent || 'WBTT';
            let maxnum = 0
            setTokenCurrent(token)
            if (params.type === 'withdraw') {
                setTitle('chequebook_withdraw');
                setDescription('amount_to_withdraw');
                params.allCurrencyBalanceList.forEach(item => {
                    currentObj[item.key] = item.maxBookBalanceCount;
                });
                maxnum = currentObj[token]|| 0
            }
            if (params.type === 'deposit') {
                setTitle('chequebook_deposit');
                setDescription('amount_to_deposit');
                params.allCurrencyBalanceList.forEach(item => {
                    currentObj[item.key] = item.maxAddressCount;
                });
                maxnum = currentObj[token]|| 0
            }
            if (params.type === 'withdraw10') {
                setTitle('BTFS_10_withdraw');
                setDescription('10_withdraw_description');
                setAccount(params.account);
                maxnum = params.maxBTT || 0
                // setMax(params.maxBTT);
                if (params.maxBTT) {
                    setValid(true);
                    // setTimeout(()=>{
                    //     inputRef.current.value = params.maxBTT;
                    // }, 100);
                }
            }
            setMax(maxnum);
            maxRef.current = currentObj;
        };
        Emitter.on('openWithdrawDepositModal', set);
        return () => {
            Emitter.removeListener('openWithdrawDepositModal');
            window.body.style.overflow = '';
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _withdraw10 = async () => {
        let amount = inputRef.current.value;
        closeModal();
        let result = await withdraw10(amount);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', { message: result['Message'], status: 'error' });
        } else {
            Emitter.emit('showMessageAlert', { message: 'withdraw_success', status: 'success', type: 'frontEnd' });
            Emitter.emit('updateWallet');
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
        let result = await withdraw(amount, tokenCurrent);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', { message: result['Message'], status: 'error' });
        } else {
            Emitter.emit('showMessageAlert', { message: 'withdraw_success', status: 'success', type: 'frontEnd' });
            Emitter.emit('updateWallet');
        }
    };

    const _deposit = async () => {
        let amount = inputRef.current.value;
        closeModal();
        let result = await deposit(amount, tokenCurrent);
        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', { message: result['Message'], status: 'error' });
        } else {
            Emitter.emit('showMessageAlert', { message: 'deposit_success', status: 'success', type: 'frontEnd' });
            Emitter.emit('updateWallet');
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
        withdraw10: _withdraw10,
    };

    const setMaxNum = () => {
        if (type === 'withdraw10' && max > 99999) {
            inputRef.current.value = 99999;
            return;
        }
        inputRef.current.value = max;
        check();
    };

    const openModal = () => {
        setShowModal(true);
        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        inputRef.current && (inputRef.current.value = null);
        setValid(false);
        setShowModal(false);
        window.body.style.overflow = '';
    };
    const handleChange = useCallback(value => {
        // tokenRef.current = value;
        setTokenCurrent(value)
        inputRef.current.value = null;
        let maxNum = 0
        if (value === 'BTT') {
             maxNum = maxRef.current.BTT || 0
        } else {
             maxNum = maxRef.current[value] || 0
        }
        setMax(maxNum);
    }, []);

    return (
        <CommonModal visible={showModal} onCancel={closeModal} width={700}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main">{t(title)}</header>
                <main className="mb-12 theme-text-main">
                    <div className="py-4">
                        {type === 'withdraw10' && (
                            <p className="pb-4">
                                {t('node_tron_addr')} :{' '}
                                <span className="font-semibold">
                                    {' '}
                                    {account} <ClipboardCopy value={account} />{' '}
                                </span>
                            </p>
                        )}
                        <p className="mb-4">{t(description)}</p>
                        <div className="flex justify-center items-center">
                            {type !== 'withdraw10' && (
                                <Select
                                    className={color}
                                    popupClassName="theme-ant-select-popup"
                                    defaultValue="WBTT"
                                    style={{ width: 100 }}
                                    onChange={handleChange}
                                    value={tokenCurrent}
                                // dropdownStyle={{ background: themeStyle.bg[color] }}
                                >
                                    {MULTIPLE_CURRENCY_LIST.map(item => {
                                        return (
                                            <Option key={item.key} value={item.key}>
                                                {item.unit}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            )}

                            <div className="inputTransition theme-border-color flex-1">
                                <input
                                    className={'px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full theme-bg'}
                                    placeholder={
                                        type === 'withdraw10'
                                            ? intl.formatMessage({ id: 'available' }) + ' : ' + max
                                            : intl.formatMessage({ id: 'max_amount' }) + ' : ' + max
                                    }
                                    onChange={inputChange}
                                    type="number"
                                    min="0"
                                    // disabled={type !== 'withdraw10' ? false : true}
                                    ref={inputRef}
                                />
                            </div>
                            <div>
                                <button className="common-btn theme-common-btn" onClick={setMaxNum}>
                                    MAX
                                </button>
                            </div>
                        </div>

                        {type === 'withdraw10' && (
                            <p className="pb-4">
                                <br />
                                {t('BTFS_10_withdraw_limit')} : 1000-99999 BTT
                            </p>
                        )}
                    </div>
                </main>
                <footer className="flex justify-between items-center common-modal-footer ">
                    <div className={'theme-text-main ' + (type !== 'withdraw10' ? 'block' : 'hidden')}>
                        {t('est_fee')}: &nbsp;
                        <span className="text-xl font-semibold">{FEE} BTT</span>
                        <Tooltip placement="bottom" title={<p>{t('estimate_transition_fee_tooltip')}</p>}>
                            <i className="fa-regular fa-circle-question text-lg ml-2"></i>
                        </Tooltip>
                    </div>
                    <div>
                        <ButtonCancel className="mr-2" event={closeModal} text={t('cancel')} />
                        <ButtonConfirm event={manipulation[type]} valid={valid} text={t(type)} />
                    </div>
                </footer>
            </div>
        </CommonModal>
    );
}
