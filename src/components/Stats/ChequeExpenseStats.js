/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {Progress} from 'antd';
import {getChequeExpenseInfo} from "services/chequeService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let strokeColor = {
    '0%': '#108ee9',
    '100%': '#87d068',
};

export default function ChequeExpenseStats({color}) {

    const [chequeSent, setChequeSent] = useState(0);
    const [chequeExpense, setChequeExpense] = useState(0);
    const [uncashed, setUncashed] = useState(0);
    const [cashed, setCashed] = useState(0);
    const [cashedPercent, setCashedPercent] = useState(0);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {chequeSent, chequeExpense, uncashed, cashed, cashedPercent} = await getChequeExpenseInfo();
            if (!didCancel) {
                setChequeSent(chequeSent);
                setChequeExpense(chequeExpense);
                setUncashed(uncashed);
                setCashed(cashed);
                setCashedPercent(cashedPercent);
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
                <div className=" mx-auto w-full">
                    <div>
                        <div className="flex flex-wrap">
                            <div className="w-full xl:w-6/12 xl:pr-2">
                                <>
                                    <div
                                        className={"relative break-words rounded mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>

                                        <div className=" p-4 h-180-px">
                                            <div className="">
                                                <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('expended_cheques')}
                                                </h5>
                                            </div>

                                            <div className='p-4'>
                                                <span className='font-semibold text-3xl'>{chequeSent}</span>
                                            </div>

                                        </div>

                                    </div>
                                </>
                            </div>

                            <div className="w-full xl:w-6/12 xl:pr-2">
                                <>
                                    <div
                                        className={"relative break-words rounded mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>

                                        <div className=" p-4 h-180-px">
                                            <div className="">
                                                <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('expended_cheques_amount')}
                                                </h5>
                                            </div>

                                            <div className='p-4'>
                                                <span className='font-semibold text-3xl'>{chequeExpense} </span>
                                                <span className='text-xs'>WBTT</span>
                                            </div>

                                        </div>

                                    </div>
                                </>
                            </div>

                            <div className="w-full xl:w-6/12 xl:pl-2">
                                <>
                                    <div
                                        className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>

                                        <div className="flex flex-col justify-between p-4 h-180-px">
                                            <div className="">
                                                <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('expended_cheques_amount')}
                                                </h5>
                                            </div>

                                            <div className='flex justify-between'>
                                                <div>
                                                    <span className='font-semibold text-xl'>{chequeExpense} </span>
                                                    <span className='text-xs'>WBTT</span>
                                                </div>
                                                <div>
                                                    {cashedPercent} %
                                                </div>
                                            </div>

                                            <div className="">
                                                <Progress className={color} percent={cashedPercent} showInfo={false}
                                                          strokeWidth={30}
                                                          strokeColor={strokeColor}/>
                                            </div>

                                            <div className='flex justify-between'>
                                                <div>
                                                    {t('cashed')}
                                                    <br/>
                                                    {cashed} <span className='text-xs'>WBTT</span>
                                                </div>
                                                <div>
                                                    {t('uncashed')}
                                                    <br/>
                                                    {uncashed} <span className='text-xs'>WBTT</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
