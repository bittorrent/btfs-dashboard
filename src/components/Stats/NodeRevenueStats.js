/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {Tooltip} from 'antd';
import {unstable_batchedUpdates} from 'react-dom';
import {getNodeRevenueStats} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";


export default function NodeRevenueStats({color}) {

    const [chequeEarning, setChequeEarning] = useState(0);
    const [chequeExpense, setChequeExpense] = useState(0);
    const [uncashedPercent, setUncashedPercent] = useState(0);
    const [cashedPercent, setCashedPercent] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [gasFee, setGasFee] = useState(0);
    const [gasFeePercent, setGasFeePercent] = useState(0);
    const [chequeExpensePercent, setChequeExpensePercent] = useState(0);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {chequeEarning, chequeExpense, uncashedPercent, cashedPercent, totalExpense, gasFee, gasFeePercent, chequeExpensePercent} = await getNodeRevenueStats();
            if (!didCancel) {
                unstable_batchedUpdates(() => {
                    setChequeEarning(chequeEarning);
                    setChequeExpense(chequeExpense);
                    setCashedPercent(cashedPercent);
                    setUncashedPercent(uncashedPercent);

                    setTotalExpense(totalExpense);
                    setGasFee(gasFee);
                    setGasFeePercent(gasFeePercent);
                    setChequeExpensePercent(chequeExpensePercent);
                })
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <>
            <div className="relative pb-4">
                <div className="mx-auto w-full">
                    <div className="flex flex-wrap">
                        <div className="w-full xl:w-6/12 md:pr-2 md:mb-2 xl:mb-0">
                            <div
                                className={"relative break-words rounded flex flex-row items-center justify-between p-4 h-full " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="w-1/2 border-r h-full flex flex-col justify-center">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('total_earnings')}
                                        </h5>
                                        <div>
                                            <span className="text-lg font-semibold">{chequeEarning}</span>
                                            <span className='text-xs'>BTT (WBTT)</span>
                                        </div>
                                </div>
                                <div className="w-1/2 pl-2 flex flex-col justify-between h-full">
                                    <div className="relative flex flex-col">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('cheque_earnings')}&nbsp;(100%)
                                        </h5>
                                        <div>
                                            <span className='text-lg font-semibold'>{chequeEarning}</span>
                                            <span className='text-xs'>WBTT</span>
                                        </div>
                                    </div>

                                    <div className="relative flex flex-col justify-between mt-2">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('airdrop')}&nbsp;(0%)
                                        </h5>
                                        <div className="font-semibold text-lg">
                                            {t('coming_soon')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full xl:w-6/12 md:pr-2 md:mb-2 xl:mb-0">
                            <div
                                className={"relative break-words rounded flex flex-row items-center justify-between p-4 h-full " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="w-1/2 border-r h-full flex flex-col justify-center overflow-auto">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('total_expense')}
                                        </h5>
                                        <div>
                                            <span className="text-lg font-semibold">{totalExpense}</span>
                                            <span className='text-xs'>BTT (WBTT)</span>
                                        </div>
                                </div>
                                <div className="w-1/2 pl-2 flex flex-col justify-between h-full">
                                    <div className="relative flex flex-col">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('cheque_expense')}&nbsp;({chequeExpensePercent}%)
                                        </h5>
                                        <div>
                                            <span className='text-lg font-semibold'>{chequeExpense}</span>
                                            <span className='text-xs'>WBTT</span>
                                        </div>
                                    </div>

                                    <div className="relative flex flex-col justify-between mt-2">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('gas_fee')}
                                            <Tooltip placement="bottom"
                                                title={<p>{t('cheque_expense_des')}</p>}>
                                                <i className="fas fa-question-circle ml-1 font-semibold text-xs"></i>
                                            </Tooltip>
                                            &nbsp;
                                            ({gasFeePercent}%)
                                        </h5>
                                        <div>
                                            <span className='text-lg font-semibold'>{gasFee}</span>
                                            <span className='text-xs'>BTT</span>
                                        </div>
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
