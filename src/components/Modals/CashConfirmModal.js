import React, { useEffect, useState, useRef } from 'react';
import { Progress } from 'antd';
import ButtonConfirm from 'components/Buttons/ButtonConfirm.js';
import { cash } from 'services/chequeService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { PRECISION_RATE } from 'utils/constants.js';
import { toNonExponential } from 'utils/BTFSUtil';
import CommonModal from './CommonModal';

export default function CashConfirmModal() {
    const [showModal, setShowModal] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const cashList = useRef([]);
    const [percentage, setPercentage] = useState(0);
    const [err, setErr] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const set = async function (params) {
            console.log('openCashConfirmModal event has occured');
            const currencyData = {};
            const currencyList = [];
            params.data.forEach(item => {
                const { amount } = item;
                const { key, unit, icon } = item.selectItemData;
                const rate = item.selectItemData?.price?.rate ?? PRECISION_RATE;
                if (!currencyData[key]) {
                    currencyData[key] = {};
                    currencyData[key].total = 0;
                    currencyData[key].len = 0;
                    currencyData[key].unit = unit;
                    currencyData[key].icon = icon;
                    currencyData[key].rate = rate;
                }
                currencyData[key].amount = amount;
                currencyData[key].total += amount;
                currencyData[key].len++;
            });
            Object.keys(currencyData).forEach(key => {
                currencyData[key].total = currencyData[key].total / currencyData[key].rate;
                currencyList.push(currencyData[key]);
            });

            cashList.current.currencyList = currencyList;
            cashList.current.list = params.data;

            setShowModal(true);
        };
        Emitter.on('openCashConfirmModal', set);
        return () => {
            Emitter.removeListener('openCashConfirmModal');
        };
    }, []);

    const onCashProgress = (progress, totalSize) => {
        let percentage = Math.round((progress / totalSize) * 100);
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
            <CommonModal visible={showModal} onCancel={() => setShowModal(false)} width={540}>
                <div className={'common-modal-wrapper theme-bg'}>
                    <header className="common-modal-header mb-4">{t('cash_confirm')}</header>
                    <main className="mb-8">
                        <p className="mb-8 text-xs leading-none theme-text-sub-main">
                            {t('cashing')} {t('from')} {cashList.current?.list?.length} {t('vault')}
                        </p>
                        <div className={'px-3 py-4 border rounded flex flex-col theme-border-color'}>
                            <div className="pb-4 border-b flex justify-between items-start theme-border-color">
                                <div className="text-sm theme-text-sub-main">{t('total')}</div>
                                <div className="text-xl font-semibold text-right">
                                    {cashList.current?.currencyList?.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={
                                                    'theme-text-main ' + cashList.current?.currencyList?.length - 1 === index
                                                        ? ''
                                                        : 'mb-3'
                                                }>
                                                <span className="mr-1.5 helvetica-b font-bold text-base">
                                                    {toNonExponential(item.total)}
                                                </span>
                                                <span className="text-sm">{item.unit}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-between items-center">
                                <div className="text-sm theme-text-sub-main">{t('est_fee')}</div>
                                <div className="theme-text-main">
                                    <span className="mr-1.5 helvetica-b font-bold text-base">
                                        {(25.2801 * cashList.current?.list?.length).toFixed(2)}
                                    </span>
                                    <span className="text-sm">BTT</span>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer className="common-modal-footer">
                        <ButtonConfirm event={submit} valid={true} text={t('confirm')} />
                    </footer>
                </div>
            </CommonModal>
            <CommonModal visible={showResult} onCancel={close} width={400}>
                <div className="common-modal-wrapper theme-bg">
                    <main className="flex flex-col justify-center items-center theme-bg theme-text-main">
                        <div className="font-semibold mb-4"> {t('cashing_status')} </div>
                        {!err && <Progress type="circle" percent={percentage} />}
                        {err && <Progress type="circle" percent={percentage} status="exception" />}
                        {message && (
                            <div className="font-semibold mt-4 w-full overflow-auto text-center"> {message} </div>
                        )}
                    </main>
                </div>
            </CommonModal>
        </>
    );
}
