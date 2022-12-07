/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import {Tooltip} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getHeartBeatsStats} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let didCancel = false;

export default function HeartBeatsStats({color}) {

    const [statusContarct, setStatusContarct] = useState('--');
    const [total, setTotal] = useState('--');
    const [gas, setGas] = useState('--');

    useEffect(() => {
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const fetchData = async () => {
        didCancel = false;
        let {status_contract, total_count, total_gas_spend} = await getHeartBeatsStats();

        if (!didCancel) {
            setStatusContarct(status_contract ?? '--');
            setTotal(total_count ?? 0);
            setGas(total_gas_spend ?? 0);
        }
    };

    const showQR = (e) => {
        e.preventDefault();
        Emitter.emit('openQRModal', {address: statusContarct});
    };

    return (
        <>
            <div className="relative pb-4">
                <div className="mx-auto w-full">
                    <div className="flex flex-wrap">
                        <div className="w-full xl:w-6/12 xl:pr-2">
                            <div
                                className={"relative break-words rounded md:mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="relative w-full h-125-px flex flex-col justify-between p-5">
                                    <h5 className={"uppercase font-bold flex justify-between " + themeStyle.title[color]}>
                                        <div>
                                            {t('heart_contract')}
                                            <Tooltip placement="bottom"
                                                     title={<p>{t('heart_contract_des')}</p>}>
                                                <i className="fas fa-question-circle text-lg ml-2"></i>
                                            </Tooltip>
                                        </div>
                                       
                                        <div>
                                            <a onClick={(e) => {
                                                showQR(e, 'BTTC')
                                            }}><i className="fas fa-qrcode ml-2"></i></a>
                                            <ClipboardCopy value={statusContarct}/>
                                        </div>
                                    </h5>
                                    <div className="font-semibold">
                                        {statusContarct}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full xl:w-6/12 xl:pl-2">
                            <div
                                className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                    <div className="relative w-full h-125-px flex flex-col justify-between p-5">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('heart_transaction')}
                                        </h5>
                                        <div className="flex items-center overflow-auto">
                                            <p className="flex-shrink-0">
                                                <span className="text-lg text-black font-bold">{total}</span>
                                                <span> {t('in_total')}</span>
                                            </p>
                                            <p className="ml-8 flex-shrink-0">
                                                <span className="text-lg text-black font-bold">{gas} BTT</span>
                                                <span> {t('gas_spend')}</span>
                                                <Tooltip placement="bottom"
                                                        title={<p>{t('gas_spend_des')}</p>}>
                                                    <i className="fas fa-question-circle ml-1 text-xs"></i>
                                                </Tooltip>
                                            </p>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
