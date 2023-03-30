import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import ButtonCancel from 'components/Buttons/ButtonCancel.js';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import { BTT2WBTT, WBTT2BTT } from 'services/dashboardService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { FEE } from 'utils/constants.js';
import { inputNumberCheck } from 'utils/checks.js';
import CommonModal from './CommonModal';

export default function ExchangeModal({ color }) {
    const intl = useIntl();
    const inputRefBTT = useRef(null);
    const inputRefWBTT = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [maxBTT, setMaxBTT] = useState(0);
    const [maxWBTT, setMaxWBTT] = useState(0);
    const [value, setValue] = useState('');
    const [target, setTarget] = useState('BTT');
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const set = function (params) {
            console.log('openExchangeModal event has occured');
            openModal();
            setMaxBTT(params.maxBTT);
            setMaxWBTT(params.maxWBTT);
            setValue('');
        };
        Emitter.on('openExchangeModal', set);
        return () => {
            Emitter.removeListener('openExchangeModal');
            window.body.style.overflow = '';
        };
    }, []);

    const _exchange = async () => {
        closeModal();
        let result;
        if (target === 'BTT') {
            result = await BTT2WBTT(value, target);
        }
        if (target === 'WBTT') {
            result = await WBTT2BTT(value, target);
        }

        if (result['Type'] === 'error') {
            Emitter.emit('showMessageAlert', { message: result['Message'], status: 'error' });
        } else {
            Emitter.emit('showMessageAlert', { message: 'exchange_success', status: 'success', type: 'frontEnd' });
            Emitter.emit('updateWallet');
        }
    };

    const check = () => {
        if (
            inputNumberCheck(
                target === 'BTT' ? inputRefBTT.current.value : inputRefWBTT.current.value,
                target === 'BTT' ? maxBTT : maxWBTT
            )
        ) {
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

    const inputChange = e => {
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
        <CommonModal visible={showModal} onCancel={closeModal} width={640}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main">BTT - WBTT {t('exchange')}</header>
                <main className="mb-12 theme-text-main">
                    <div className="relative">
                        {target === 'BTT' && (
                            <div className="flex justify-between">
                                <div className="grow">
                                    <div className="text-center font-semibold text-lg mb-4">BTT</div>
                                    <div className="flex items-center ">
                                        <button className="common-btn theme-common-btn" onClick={setMaxBTTNum}>
                                            MAX
                                        </button>
                                        <div className="inputTransition theme-border-color">
                                            <input
                                                className="px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full theme-bg"
                                                placeholder={intl.formatMessage({ id: 'max_available_amount' }) + ' : ' + maxBTT}
                                                onChange={inputChange}
                                                type="number"
                                                min="0"
                                                ref={inputRefBTT}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grow-0 cursor-pointer text-xl" onClick={reverse}>
                                    <div className="text-center font-semibold text-lg mb-4">&nbsp;</div>
                                    <div className="flex items-center h-50-px">
                                        <i className="fas fa-arrow-alt-circle-right theme-text-base"></i>
                                    </div>
                                </div>
                                <div className="grow">
                                    <div className="text-center font-semibold text-lg mb-4">WBTT</div>
                                    <div className="flex">
                                        <div className="inputTransition theme-border-color">
                                            <input
                                                className="border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full text-center theme-bg theme-border-color"
                                                disabled="disabled"
                                                value={value}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {target === 'WBTT' && (
                            <div className="flex justify-between">
                                <div className="grow">
                                    <div className="text-center font-semibold text-lg mb-4">WBTT</div>
                                    <div className="flex items-center">
                                        <button className="common-btn theme-common-btn" onClick={setMaxWBTTNum}>
                                            MAX
                                        </button>
                                        <div className="inputTransition theme-border-color">
                                            <input
                                                className="border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full theme-bg theme-border-color"
                                                placeholder={intl.formatMessage({ id: 'max_amount' }) + ' : ' + maxWBTT}
                                                onChange={inputChange}
                                                type="number"
                                                min="0"
                                                ref={inputRefWBTT}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grow-0 cursor-pointer text-xl" onClick={reverse}>
                                    <div className="text-center font-semibold text-lg mb-4">&nbsp;</div>
                                    <div className="flex items-center h-50-px">
                                        <i className="fas fa-arrow-alt-circle-right theme-text-base"></i>
                                    </div>
                                </div>
                                <div className="grow">
                                    <div className="text-center font-semibold text-lg mb-4">BTT</div>
                                    <div className="flex">
                                        <div className="inputTransition theme-border-color">
                                            <input
                                                className="border-black px-3 py-3 placeholder-blueGray-300 text-sm focus:outline-none w-full text-center theme-bg theme-border-color"
                                                disabled="disabled"
                                                value={value}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <footer className="flex items-center justify-between common-modal-footer theme-text-main">
                    <div>
                        {t('est_fee')}: &nbsp;
                        <span className="text-xl font-semibold">{FEE} BTT</span>
                        <Tooltip placement="bottom" title={<p>{t('estimate_transition_fee_tooltip')}</p>}>
                            <i className="fas fa-question-circle text-lg ml-2"></i>
                        </Tooltip>
                    </div>
                    <div>
                        <ButtonCancel className="mr-2" event={closeModal} text={t('cancel')} />
                        <ButtonConfirm event={_exchange} valid={valid} text={t('confirm')} />
                    </div>
                </footer>
            </div>
        </CommonModal>
    );
}
