/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {Progress} from 'antd';
import {getChequeExpenseStats} from "services/chequeService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

export default function ChequeExpenseStats({color}) {

    const [chequesStats, setChequesStats] = useState({
        chequeSentCount: 0,
        chequeSentValue: 0,
        uncashedValue: 0,
        cashedValue: 0,
        cashedValuePercent: 0
    })

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let data = await getChequeExpenseStats();
            if (!didCancel) {
                setChequesStats(data);
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <>
            <div className="relative pt-4 pb-4">
                <div className="mx-auto w-full">
                    <div className="flex flex-wrap">
                        <div className="w-full xl:w-6/12 xl:pr-2">
                            <div
                                className={"relative break-words rounded mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="p-4 h-180-px">
                                    <div>
                                        <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                            {t('sent_cheques')}
                                        </h5>
                                    </div>
                                    <div className='p-4'>
                                        <span className='font-semibold text-3xl'>{chequesStats.chequeSentCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full xl:w-6/12 xl:pl-2">
                            <div
                                className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="flex flex-col justify-between p-4 h-180-px">
                                    <div>
                                        <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                            {t('sent_cheques_amount')}
                                        </h5>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div>
                                            <span className='font-semibold text-xl'>{chequesStats.chequeSentValue} </span>
                                            <span className='text-xs'>WBTT</span>
                                        </div>
                                        <div>
                                            {chequesStats.cashedValuePercent} %
                                        </div>
                                    </div>
                                    <div>
                                        <Progress className={color} percent={chequesStats.cashedValuePercent} showInfo={false}
                                                  strokeWidth={30}
                                                  strokeColor={strokeColor}/>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div>
                                            {t('cashed')}
                                            <br/>
                                            {chequesStats.cashedValue} <span className='text-xs'>WBTT</span>
                                        </div>
                                        <div>
                                            {t('uncashed')}
                                            <br/>
                                            {chequesStats.uncashedValue} <span className='text-xs'>WBTT</span>
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
