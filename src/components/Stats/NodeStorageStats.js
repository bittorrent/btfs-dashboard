/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import LocalStorageGaugeChart from "components/Charts/LocalStorageGaugeChart.js"
import {getNodeStorageStats} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";


export default function NodeStorageStats({color}) {

    const [capacity, setCapacity] = useState(0);
    const [storageUsed, setStorageUsed] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [hostPrice, setHostPrice] = useState(0);
    const [contracts, setContracts] = useState(0);
    const [uncashed, setUncashed] = useState(0);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {capacity, storageUsed, percentage, hostPrice, contracts, uncashed} = await getNodeStorageStats();
            if (!didCancel) {
                setCapacity(capacity);
                setStorageUsed(storageUsed);
                setPercentage(percentage);
                setHostPrice(hostPrice);
                setContracts(contracts);
                setUncashed(uncashed);
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
                <div className=" mx-auto w-full">
                    <div>
                        <div className="flex flex-wrap">
                            <div className="w-full xl:w-6/12 lg:w-6/12 md:pr-2">
                                <>
                                    <div className={"relative break-words rounded mb-2 xl:mb-0  " + themeStyle.bg[color]  + themeStyle.text[color]}>

                                        <div className="flex items-center p-4 h-125-px">
                                            <div className="relative w-3/4 h-90-px flex flex-col justify-between">
                                                <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('contracts')}
                                                </h5>
                                                <div className="font-semibold text-lg">
                                                    {contracts}
                                                </div>

                                                <div className=''>
                                                    {t('price')}: {hostPrice} WBTT (GB / {t('month')})
                                                </div>

                                            </div>

                                            <div className="relative w-1/4 flex justify-center">
                                                <div
                                                    className={
                                                        "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " + 'bg-emerald-500'
                                                    }
                                                >
                                                    <i className="fas fa-file-signature"></i>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            </div>
                            {/* <div className="w-full xl:w-4/12 lg:w-6/12 md:pl-2 xl:pr-2">
                                <>
                                    <div
                                        className={"relative break-words rounded mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>

                                        <div className="flex items-center p-4 h-125-px">
                                            <div className="relative w-3/4 h-90-px flex flex-col justify-between">
                                                <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('uncashed')} {t('amount')}
                                                </h5>
                                                <div className="">
                                                    <span className='text-lg font-semibold'>{uncashed}</span>
                                                    <span className='unit_color text-xs'>WBTT</span>
                                                </div>

                                                <div className={themeStyle.link[color]}>
                                                    <Link to='/admin/cheque'>{t('cash')} >> </Link>
                                                </div>

                                            </div>

                                            <div className="relative w-1/4 flex justify-center">
                                                <div
                                                    className={
                                                        "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " + 'bg-emerald-500'
                                                    }
                                                >
                                                    <i className="fas fa-coins"></i>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            </div> */}
                            <div className="w-full xl:w-6/12 lg:w-6/12 xl:pl-2">
                                <>
                                    <div className={"relative break-words rounded " + themeStyle.bg[color]  + themeStyle.text[color]}>

                                        <div className="flex items-center p-4 h-125-px">
                                            <div className='h-90-px w-full flex flex-col justify-between'>
                                                <div className='flex'>
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                                {t('storage')}
                                                            </h5>
                                                        </div>
                                                        <div>
                                                            <span className='font-semibold text-lg'>{storageUsed} </span> /&nbsp;
                                                            {capacity}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <LocalStorageGaugeChart color={color} data={percentage}/>
                                                    </div>
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
