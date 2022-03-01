/*eslint-disable*/
import React, {useEffect, useState} from "react";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getNodeWalletStats} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";
import {bttcScanLinkCheck} from "utils/checks.js";

export default function NodeWalletStats({color}) {

    const [BTTCAddress, setBTTCAddress] = useState('--');
    const [chequeAddress, setChequeAddress] = useState('--');
    const [chequeBookBalance, setChequeBookBalance] = useState(0);
    const [BTTCAddressBTT, setBTTCAddressBTT] = useState(0);
    const [BTTCAddressWBTT, setBTTCAddressWBTT] = useState(0);
    const [_chequeBookBalance, set_ChequeBookBalance] = useState(0);
    const [_BTTCAddressBTT, set_BTTCAddressBTT] = useState(0);
    const [_BTTCAddressWBTT, set_BTTCAddressWBTT] = useState(0);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {BTTCAddress, chequeAddress, chequeBookBalance, BTTCAddressBTT, BTTCAddressWBTT, _chequeBookBalance, _BTTCAddressBTT, _BTTCAddressWBTT} = await getNodeWalletStats();
            if (!didCancel) {
                setBTTCAddress(BTTCAddress);
                setChequeAddress(chequeAddress);
                setChequeBookBalance(chequeBookBalance);
                setBTTCAddressBTT(BTTCAddressBTT);
                setBTTCAddressWBTT(BTTCAddressWBTT);
                set_ChequeBookBalance(_chequeBookBalance);
                set_BTTCAddressBTT(_BTTCAddressBTT);
                set_BTTCAddressWBTT(_BTTCAddressWBTT);
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const onDeposit = (e) => {
        e.preventDefault();
        Emitter.emit('openWithdrawDepositModal', {type: 'deposit', max: _BTTCAddressWBTT});
    };

    const onWithdraw = (e) => {
        e.preventDefault();
        Emitter.emit('openWithdrawDepositModal', {type: 'withdraw', max: _chequeBookBalance});
    };

    const onTransfer = (e) => {
        e.preventDefault();
        Emitter.emit('openTransferConfirmModal', {type: 'transfer', maxBTT: _BTTCAddressBTT, maxWBTT: _BTTCAddressWBTT});
    };

    const onExchange = (e) => {
        e.preventDefault();
        Emitter.emit('openExchangeModal', {type: 'exchange', maxBTT: _BTTCAddressBTT, maxWBTT: _BTTCAddressWBTT});
    };

    const showQR = (e, type) => {
        e.preventDefault();
        if (type === 'Cheque') {
            Emitter.emit('openQRModal', {address: chequeAddress});
        }
        if (type === 'BTTC') {
            Emitter.emit('openQRModal', {address: BTTCAddress});
        }
    };

    return (
        <>
            <div className="relative pb-4">
                <div className="mx-auto w-full">
                        <div className="flex flex-wrap">
                            <div className="w-full xl:w-6/12 xl:pr-2">
                                    <div className={"relative break-words rounded md:mb-2 xl:mb-0  " + themeStyle.bg[color] + themeStyle.text[color]}>
                                        <div className="flex items-center p-4 h-180-px">
                                            <div className="relative w-full h-150-px flex flex-col justify-between">
                                                <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                                    BTTC {t('address')}
                                                    <a onClick={(e) => {
                                                        showQR(e, 'BTTC')
                                                    }}><i className="fas fa-qrcode ml-2"></i></a>
                                                    <ClipboardCopy value={BTTCAddress}/>
                                                </h5>
                                                <div className="font-semibold">
                                                    <a href={bttcScanLinkCheck() + '/address/' + BTTCAddress} target='_blank' rel='noreferrer'>{BTTCAddress}</a>
                                                </div>
                                                <div className=''>
                                                    <span className='font-semibold'>{t('balance')}: &nbsp;</span>
                                                    <span className='text-lg font-semibold'>{BTTCAddressBTT} </span>
                                                    <span className='text-xs'>BTT</span>
                                                    <span>&nbsp; / &nbsp;</span>
                                                    <span className='text-lg font-semibold'> {BTTCAddressWBTT} </span>
                                                    <span className='text-xs'>WBTT</span>
                                                </div>
                                                <div className='transfer_exchange'>
                                                    <button
                                                        className={"border-1 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 shadow hover:shadow-md inline-flex items-center font-bold " + themeStyle.bg[color]}
                                                        type="button" onClick={onTransfer}>
                                                        {t('transfer')}
                                                    </button>
                                                    <button
                                                        className={"border-1 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 shadow hover:shadow-md inline-flex items-center font-bold " + themeStyle.bg[color]}
                                                        type="button" onClick={onExchange}>
                                                        BTT
                                                        <i className="fas fa-exchange-alt mx-4"></i>
                                                        WBTT
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="w-full xl:w-6/12 xl:pl-2">
                                    <div className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                        <div className="flex items-center p-4 h-180-px">
                                            <div className="relative w-full h-150-px flex flex-col justify-between">
                                                <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                                    {t('chequebook')} {t('address')}
                                                    <a onClick={(e) => {
                                                        showQR(e, 'Cheque')
                                                    }}><i className="fas fa-qrcode ml-2"></i></a>
                                                    <ClipboardCopy value={chequeAddress}/>
                                                </h5>
                                                <div className='font-semibold'>
                                                    <a href={bttcScanLinkCheck() + '/address/' + chequeAddress} target='_blank' rel='noreferrer'>{chequeAddress}</a>
                                                </div>
                                                <div>
                                                    <span className='font-semibold'>{t('balance')}: &nbsp;</span>
                                                    <span className='text-lg font-semibold'>{chequeBookBalance}</span>
                                                    <span className='text-xs'>WBTT</span>
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
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
}
