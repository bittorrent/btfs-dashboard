/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {unstable_batchedUpdates} from 'react-dom';
import {Tooltip} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getNodeWalletStats} from "services/dashboardService.js";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

let didCancel = false;

export default function HeartBeatsStats({color}) {

    const [BTTCAddress, setBTTCAddress] = useState('--');
    const [chequeAddress, setChequeAddress] = useState('--');
    const [_chequeBookWBTT, set_ChequeBookWBTT] = useState(0);
    const [_BTTCAddressBTT, set_BTTCAddressBTT] = useState(0);
    const [_BTTCAddressWBTT, set_BTTCAddressWBTT] = useState(0);

    useEffect(() => {
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const fetchData = async () => {
        didCancel = false;
        let {BTTCAddress, chequeAddress, maxAvailableChequeBookWBTT, maxAvailableBTT, maxAvailableWBTT} = await getNodeWalletStats();
        if (!didCancel) {
            unstable_batchedUpdates(() => {
                setBTTCAddress(BTTCAddress);
                setChequeAddress(chequeAddress);
                set_ChequeBookWBTT(maxAvailableChequeBookWBTT);
                set_BTTCAddressBTT(maxAvailableBTT);
                set_BTTCAddressWBTT(maxAvailableWBTT);
            })
        }
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
                                            <ClipboardCopy value={BTTCAddress}/>
                                        </div>
                                    </h5>
                                    <div className="font-semibold">
                                        {BTTCAddress}
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
                                        <div className="flex items-center">
                                            <p>
                                                <span className="text-lg text-black font-bold">123</span>
                                                <span> {t('in_total')}</span>
                                            </p>
                                            <p className="ml-8">
                                                <span className="text-lg text-black font-bold">456</span>
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
