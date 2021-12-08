import React, {useEffect, useState} from "react";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getNodeWalletStats} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";


export default function NodeWalletStats({color}) {

    const [BTTCAddress, setBTTCAddress] = useState('--');
    const [chequeAddress, setChequeAddress] = useState('--');
    const [chequeBookBalance, setChequeBookBalance] = useState(0);
    const [BTTCAddressBTT, setBTTCAddressBTT] = useState(0);
    const [BTTCAddressWBTT, setBTTCAddressWBTT] = useState(0);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {BTTCAddress, chequeAddress, chequeBookBalance, BTTCAddressBTT, BTTCAddressWBTT} = await getNodeWalletStats();
            if (!didCancel) {
                setBTTCAddress(BTTCAddress);
                setChequeAddress(chequeAddress);
                setChequeBookBalance(chequeBookBalance);
                setBTTCAddressBTT(BTTCAddressBTT);
                setBTTCAddressWBTT(BTTCAddressWBTT);
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const onDeposit = (e) => {
        e.preventDefault();
        Emitter.emit('openWithdrawDepositModal', {type: 'deposit', max: BTTCAddressWBTT});
    };

    const onWithdraw = (e) => {
        e.preventDefault();
        Emitter.emit('openWithdrawDepositModal', {type: 'withdraw', max: chequeBookBalance});
    };

    return (
        <>
            <div className="relative pb-4">
                <div className=" mx-auto w-full">
                    <div>
                        <div className="flex flex-wrap">
                            <div className="w-full xl:w-6/12  xl:pr-2">
                                <>
                                    <div className={"relative break-words rounded md:mb-2 xl:mb-0  " + themeStyle.bg[color]  + themeStyle.text[color]}>

                                        <div className="flex items-center p-4 h-180-px">
                                            <div className="relative w-full h-150-px flex flex-col justify-between">
                                                <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                    BTTC {t('address')}
                                                    <ClipboardCopy value={BTTCAddress}/>
                                                </h5>
                                                <div className="font-semibold ">
                                                    {BTTCAddress}
                                                </div>

                                                <div className="font-semibold ">
                                                    <span className=''>{t('balance')}: </span>
                                                </div>

                                                <div className='flex flex-col'>
                                                    <div className="">
                                                        <span className='text-lg font-semibold'>{BTTCAddressBTT} </span>
                                                        <span className='unit_color text-xs'>BTT</span>
                                                    </div>
                                                    <div className="">
                                                        <span className='text-lg font-semibold'> {BTTCAddressWBTT} </span>
                                                        <span className='unit_color text-xs'>WBTT</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                            <div className="w-full xl:w-6/12  xl:pl-2">
                                <>
                                    <div className={"relative break-words rounded " + themeStyle.bg[color]  + themeStyle.text[color]}>

                                        <div className="flex items-center p-4 h-180-px">
                                            <div className="relative w-full h-150-px flex flex-col justify-between">
                                                <h5 className={" uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('chequebook')} {t('address')}
                                                    <ClipboardCopy value={chequeAddress}/>
                                                </h5>

                                                <div className='font-semibold'>
                                                    {chequeAddress}
                                                </div>

                                                <div className="">
                                                    <span className='font-semibold'>{t('balance')}: </span>
                                                    <span className='text-lg font-semibold'>{chequeBookBalance}</span>
                                                    <span className='unit_color text-xs'>WBTT</span>
                                                </div>

                                                <div className='withdraw_deposit'>
                                                    <button
                                                        className={"border-1 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 shadow hover:shadow-md inline-flex items-center font-bold " + themeStyle.bg[color]}
                                                        type="button" onClick={onWithdraw}>
                                                        {t('withdraw')}
                                                    </button>

                                                    <button
                                                        className={"border-1 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 shadow hover:shadow-md inline-flex items-center font-bold " + themeStyle.bg[color]}
                                                        type="button" onClick={onDeposit}>
                                                        {t('deposit')}
                                                    </button>
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
