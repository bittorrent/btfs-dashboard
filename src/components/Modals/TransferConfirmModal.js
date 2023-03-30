import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Select, Tooltip } from 'antd';
import ButtonCancel from 'components/Buttons/ButtonCancel.js';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import { BTTTransfer, WBTTTransfer, currencyTransfer } from 'services/dashboardService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { FEE, MULTIPLE_CURRENCY_LIST } from 'utils/constants.js';
import { inputAddressCheck, inputNumberCheck } from 'utils/checks.js';
import CommonModal from './CommonModal';

const { Option } = Select;

export default function TransferConfirmModal({ color }) {
    const intl = useIntl();
    const inputAddressRef = useRef(null);
    const inputAmountRef = useRef(null);
    const tokenRef = useRef('BTT');
    const maxRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [max, setMax] = useState(0);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const set = async function (params) {
            console.log('openTransferConfirmModal event has occured');
            openModal();
            tokenRef.current = 'BTT';
            const currentObj = {
                BTT: params.maxBTT,
            };
            params.allCurrencyBalanceList.forEach(item => {
                currentObj[item.key] = item.maxAddressCount;
            });

            maxRef.current = currentObj;

            setMax(maxRef.current.BTT);
        };
        Emitter.on('openTransferConfirmModal', set);
        return () => {
            Emitter.removeListener('openTransferConfirmModal');
            window.body.style.overflow = '';
        };
    }, []);

    const next = () => {
        setShowConfirm(true);
    };

    const submit = async () => {
        closeModal();
        setShowConfirm(false);

        let result;
        if (tokenRef.current === 'BTT') {
            result = await BTTTransfer(
                inputAddressRef.current.value.trim(),
                inputAmountRef.current.value,
                tokenRef.current
            );
        }
        if (tokenRef.current === 'WBTT') {
            result = await WBTTTransfer(
                inputAddressRef.current.value.trim(),
                inputAmountRef.current.value,
                tokenRef.current
            );
        } else {
            result = await currencyTransfer(
                inputAddressRef.current.value.trim(),
                inputAmountRef.current.value,
                tokenRef.current
            );
        }

        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', { message: result['Message'], status: 'error' });
        } else {
            Emitter.emit('showMessageAlert', { message: 'transfer_success', status: 'success', type: 'frontEnd' });
            Emitter.emit('updateWallet');
        }
    };

    const check = () => {
        inputAddressRef.current.style.color = '';
        if (
            inputAddressCheck(inputAddressRef.current.value.trim()) &&
            inputNumberCheck(inputAmountRef.current.value, max)
        ) {
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
        check();
    };

    const inputChange = () => {
        check();
    };

    const onBlur = () => {
        if (!inputAddressCheck(inputAddressRef.current.value.trim())) {
            inputAddressRef.current.style.color = 'red';
        }
    };

    const handleChange = useCallback(value => {
        tokenRef.current = value;
        inputAmountRef.current.value = null;

        if (value === 'BTT') {
            setMax(maxRef.current.BTT);
        } else {
            setMax(maxRef.current[value]);
        }
        // if (value === 'WBTT') {
        //     setMax(maxRef.current.WBTT);
        // }
    }, []);

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
            <CommonModal visible={showModal} onCancel={closeModal} width={640}>
                <div className={'common-modal-wrapper theme-bg'}>
                    <header className="common-modal-header theme-text-main">{t('transfer')}</header>
                    <main className="mb-12 theme-text-main">
                        <div className="relative flex flex-col">
                            <div className="flex pb-2">
                                <div className="mr-4 font-semibold w-120-px flex items-center">{t('send_to')}</div>
                                <div className="inputTransition theme-border-color flex-1">
                                    <input
                                        className="px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full h-35-px theme-bg"
                                        type="text"
                                        placeholder={intl.formatMessage({ id: 'enter_bttc_address' })}
                                        onChange={inputChange}
                                        onBlur={onBlur}
                                        ref={inputAddressRef}
                                    />
                                </div>
                            </div>

                            <div className="flex pt-2">
                                <div className="mr-4 font-semibold w-120-px flex items-center">{t('send_amount')}</div>
                                <div>
                                    <Select
                                        className={'theme-border-color ' + color}
                                        defaultValue="BTT"
                                        style={{ width: 90 }}
                                        onChange={handleChange}
                                    // dropdownStyle={{ background: themeStyle.bg[color] }}
                                    >
                                        <Option value="BTT">BTT</Option>
                                        {MULTIPLE_CURRENCY_LIST.map(item => {
                                            return (
                                                <Option key={item.key} value={item.key}>
                                                    {item.unit}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </div>
                                <div className="inputTransition theme-border-color flex-1">
                                    <input
                                        className="px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full h-35-px theme-bg"
                                        placeholder={intl.formatMessage({ id: 'max_available_amount' }) + ' : ' + max}
                                        onChange={inputChange}
                                        type="number"
                                        min="0"
                                        ref={inputAmountRef}
                                    />
                                </div>
                                <div>
                                    <button className="common-btn theme-common-btn" onClick={setMaxNum}>
                                        MAX
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="flex flex-wrap items-center justify-between common-modal-footer theme-text-main">
                        <div>
                            {t('est_fee')}: &nbsp;
                            <span className="text-xl font-semibold">{FEE} BTT</span>
                            <Tooltip placement="bottom" title={<p>{t('estimate_transition_fee_tooltip')}</p>}>
                                <i className="fa-regular fa-circle-question text-lg ml-2"></i>
                            </Tooltip>
                        </div>
                        <div>
                            <ButtonCancel className="mr-2" event={closeModal} text={t('cancel')} />
                            <ButtonConfirm event={next} valid={!valid} text={t('next')} />
                        </div>
                    </footer>
                </div>
            </CommonModal>
            <CommonModal visible={showConfirm} onCancel={close}>
                <div className={'common-modal-wrapper theme-bg'}>
                    <header className="common-modal-header theme-text-main">{t('transfer_confirmation')}</header>
                    <main className="mb-12 theme-text-main">
                        <div className="relative px-4 flex flex-col">
                            <div>
                                <p className="p-2">{t('send_to')}</p>
                                <p className="p-2 font-semibold">{inputAddressRef.current?.value}</p>
                            </div>

                            <div className="flex">
                                <div className="flex-1">
                                    <p className="p-2">{t('send_amount')}</p>
                                    <p className="p-2 font-semibold">
                                        {inputAmountRef.current?.value} &nbsp; {tokenRef.current}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="p-2">{t('est_fee')}</p>
                                    <p className="p-2 font-semibold">{FEE} BTT</p>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer className="flex flex-wrap items-center justify-between common-modal-footer theme-text-main">
                        <div>
                            {t('total')}: &nbsp;
                            <span className="text-xl font-semibold">
                                {inputAmountRef.current?.value} {tokenRef.current} + {FEE} BTT
                            </span>
                        </div>
                        <div>
                            <ButtonCancel className="mr-2" event={close} text={t('return')} />
                            <ButtonConfirm event={submit} valid={true} text={t('confirm')} />
                        </div>
                    </footer>
                </div>
            </CommonModal>
        </>
    );
}
