/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {Tooltip} from 'antd';
import {unstable_batchedUpdates} from 'react-dom';
import {getNodeRevenueStats} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";
import {t} from "utils/text.js";


const dataList = [
{
    icon: "wbtt",
    value: 2580.7585,
    bttValue: 2580.7585,
    unit:"WBTT",
},
{
    icon: "usdd",
    value: 2580.7585,
    bttValue: 2580.7585,
    unit:"USDD",
    },
    {
    icon: "trx",
    value: 2580.7585,
    bttValue: 2580.7585,
    unit:"TRX",
    },
    {
    icon: "usdt",
    value: 2580.7585,
    bttValue: 2580.7585,
    unit:"USDT_t",
    },
];

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

    const showChequeExpenseTips = ()=>{
        Emitter.emit('openCheckDetailModal', {title: t("checks_expense_detials") ,dataList});
    }
    const showChequeEarningTips = ()=>{
        Emitter.emit('openCheckDetailModal', {title: t("cheque_earning_detail"), dataList:dataList});
    }
    return (
        <>
            <div className="relative w-full h-full flex flex-col">

                {/* <div className="w-full h-full flex flex-col">
                
                </div> */}
                <div className="w-full flex-1 mb-40-px">
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
                                <div className="relative flex justify-between items-center">
                                    <div className="relative flex flex-col">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                                <i className="fas fa-circle text-green-500 mr-2"></i>
                                                {t("cheque_earnings")}
                                                <Tooltip
                                                    placement="bottom"
                                                    title={<p>{t("cheque_earnings_des")}</p>}
                                                >
                                                    <i className="fas fa-question-circle ml-1 font-semibold text-xs"></i>
                                                </Tooltip>
                                                &nbsp;(100%)
                                            </h5>
                                            <div>
                                                <span className='text-lg font-semibold'>{chequeEarning}</span>
                                                <span className='text-xs'>WBTT</span>
                                            </div>
                                        </div>
                                        <div>
                                            <i onClick={showChequeEarningTips} class="fa-solid  fa-circle-chevron-right font-semibold cursor-pointer"></i>
                                        </div> 
                                    </div>
                                    
                                    <div className="relative flex flex-col justify-between mt-2">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            <i className="fas fa-circle text-green-400 text- mr-2"></i>
                                            {t('airdrop')}&nbsp;(0%)
                                        </h5>
                                        <div className="font-semibold text-lg">
                                            {t('coming_soon')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                </div>
                <div style={{height:'30px'}}></div>

                <div className="w-full flex-1  md:mb-2 xl:mb-0">
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
                            <div className="relative flex justify-between items-center">
                                <div className="relative flex flex-col">
                                    <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                        <i className="fas fa-circle text-red-500 text- mr-2"></i>
                                        {t('cheque_expense')}&nbsp;({chequeExpensePercent}%)
                                    </h5>
                                    <div>
                                        <span className='text-lg font-semibold'>{chequeExpense}</span>
                                        <span className='text-xs'>WBTT</span>
                                    </div>
                                </div>
                                <div>
                                    <i onClick={showChequeExpenseTips} class="fa-solid  fa-circle-chevron-right font-semibold  cursor-pointer"></i>
                                </div> 
                            </div>

                            <div className="relative flex flex-col justify-between mt-2">
                                <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                    <i className="fas fa-circle text-red-400 text- mr-2"></i>
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
        </>
    );
}
