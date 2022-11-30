/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Progress } from 'antd';
import { getChequeEarningAllStats } from "services/chequeService.js";
import themeStyle from "utils/themeStyle.js";
import { t } from "utils/text.js";
import { MULTIPLE_CURRENY_LIST } from "utils/constants";
import MultipleCurrenyList from "./MultipleCurrenyList.js"

let strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

export default function ChequeEarningStats({ color }) {

    const [chequesStats, setChequesStats] = useState({
        chequeReceivedCount: 0,
        uncashedCount: 0,
        cashedCount: 0,
        chequeReceivedValue: 0,
        uncashedValue: 0,
        cashedValue: 0,
        cashedCountPercent: 0,
        cashedValuePercent: 0,
    });
    const [earningValueAllStatsData, setEarningValueAllStatsData] = useState(MULTIPLE_CURRENY_LIST);
    const [earningCountAllStatsData, setEarningCountAllStatsData] = useState(MULTIPLE_CURRENY_LIST);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let { earningValueAllStatsData, earningCountAllStatsData, WBTTData } = await getChequeEarningAllStats();
            if (!didCancel) {
                setChequesStats(WBTTData);
                setEarningValueAllStatsData(() => earningValueAllStatsData);
                setEarningCountAllStatsData(() => earningCountAllStatsData)
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <div className="relative pt-4 pb-4">
            <div className="mx-auto w-full">
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-6/12 xl:pr-2">
                        <div
                            className={"relative break-words rounded mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>
                            {/* <div className="flex flex-col justify-between p-4 h-180-px"> */}
                            <div className="flex flex-col justify-between p-4 h-600-px">
                                <div>
                                    <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                        {t('received_cheques')}
                                    </h5>
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        <span className='font-semibold text-xl'>{chequesStats.chequeReceivedCount} </span>
                                    </div>
                                    <div>
                                        {chequesStats.cashedCountPercent} %
                                    </div>
                                </div>
                                <div>
                                    <Progress className={color} percent={chequesStats.cashedCountPercent} showInfo={false}
                                        strokeWidth={30} strokeColor={strokeColor} />
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        {t('cashed')}
                                        <br />
                                        {chequesStats.cashedCount}
                                    </div>
                                    <div>
                                        {t('uncashed')}
                                        <br />
                                        {chequesStats.uncashedCount}
                                    </div>
                                </div>

                                <MultipleCurrenyList type="recievedCheques" color={color} dataList={earningValueAllStatsData} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full xl:w-6/12 xl:pl-2">
                        <div
                            className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                            {/* <div className="flex flex-col justify-between p-4 h-180-px"> */}
                            <div className="flex flex-col justify-between p-4 h-600-px">
                                <div>
                                    <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                        {t('received_cheques_amount')}
                                    </h5>
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        <span className='font-semibold text-xl'>{chequesStats.chequeReceivedValue} </span>
                                        <span className='text-xs'>WBTT</span>
                                    </div>
                                    <div>
                                        {chequesStats.cashedValuePercent} %
                                    </div>
                                </div>
                                <div>
                                    <Progress className={color} percent={chequesStats.cashedValuePercent} showInfo={false}
                                        strokeWidth={30} strokeColor={strokeColor} />
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        {t('cashed')}
                                        <br />
                                        {chequesStats.cashedValue} <span className='text-xs'>WBTT</span>
                                    </div>
                                    <div>
                                        {t('uncashed')}
                                        <br />
                                        {chequesStats.uncashedValue} <span className='text-xs'>WBTT</span>
                                    </div>
                                </div>
                                <MultipleCurrenyList color={color} dataList={earningCountAllStatsData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
