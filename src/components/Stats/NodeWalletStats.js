import React, { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { SwapOutlined } from '@ant-design/icons';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { getNodeWalletStats } from 'services/dashboardService.js';
import Emitter from 'utils/eventBus';
import { t, Truncate } from 'utils/text.js';
import { bttcScanLinkCheck } from 'utils/checks.js';
import ButtonRoundRect from 'components/Buttons/ButtonRoundRect';

const CoinItem = ({ item, valueAttr }) => {
    return (
        <div key={item.unit} className="flex justify-start items-center w-1/2 mb-2">
            <img src={require(`assets/img/${item.icon}.svg`).default} alt="" className="mr-2 w-6 h-6" />
            <div className="font-bold theme-text-main">
                <span className={'text-base mr-2'}>{item?.[valueAttr] ?? '-'}</span>
                <span className={'text-xs'}>{item.unit}</span>
            </div>
        </div>
    );
};

const BTTCWalletStats = ({
    showQR,
    BTTCAddress,
    BTTCAddressBTT,
    allCurrencyBalanceList,
    onTransfer,
    onExchange,
}) => {
    return (
        <div className="h-full">
            <header className="mb-5 flex justify-between items-center">
                <div>
                    <div className="mb-1">
                        <span className="font-bold text-base theme-text-main">BTTC {t('address')}</span>
                        <button className="ml-2 rounded copy-btn theme-copy-btn" onClick={e => showQR(e, 'BTTC')}>
                            <i className="fas fa-qrcode"></i>
                        </button>
                        <ClipboardCopy value={BTTCAddress} />
                    </div>
                    <div className="flex">
                        <a
                            className="theme-link"
                            href={bttcScanLinkCheck() + '/address/' + BTTCAddress}
                            target="_blank"
                            rel="noreferrer">
                            <Truncate className="theme-link">{BTTCAddress}</Truncate>
                        </a>
                    </div>
                </div>
                <div className="mr-2 w-14 h-14 flex justify-center items-center  rounded-full theme-fill-shallow">
                    <img src={require(`assets/img/btt.svg`).default} alt="" width={35} height={35} />
                </div>
            </header>
            <main className="p-6 rounded-xl bttc-balance theme-text-main" style={{ height: '15.125rem' }}>
                <h5 className="mb-4 font-bold theme-text-main">BTTC {t('address_balance')}</h5>
                <div className="mb-4 flex items-center font-bold">
                    <div className="mr-2 w-10 h-10 flex justify-center items-center rounded-full theme-fill-shallow">
                        <img src={require(`assets/img/btt.svg`).default} alt="" width={35} height={35} />
                    </div>
                    <div>
                        <span className="mr-1 text-xl">{BTTCAddressBTT}</span>
                        <span className="text-sm">BTT</span>
                    </div>
                </div>
                <div className="mb-4 flex flex-wrap" style={{ width: 'calc(100% - 60px)' }}>
                    {allCurrencyBalanceList.map(item => (
                        <CoinItem key={item.unit} item={item} valueAttr="addressValue" />
                    ))}
                </div>
                <div>
                    <ButtonRoundRect className="mr-2" text={t('transfer')} onClick={onTransfer} />
                    <ButtonRoundRect
                        className="mr-2"
                        text={
                            <span>
                                BTT
                                <SwapOutlined className="mx-1" style={{ verticalAlign: 1 }} />
                                WBTT
                            </span>
                        }
                        onClick={onExchange}
                    />
                </div>
            </main>
        </div>
    );
};

const ChequeBookStats = ({ showQR, chequeAddress, allCurrencyBalanceList, onWithdraw, onDeposit }) => {
    return (
        <div className="h-full">
            <header className="mb-5 flex justify-between items-center">
                <div>
                    <div className="mb-1">
                        <span className="font-bold text-base theme-text-main">BTTC {t('vault_contract_address')}</span>
                        <button className="ml-2 rounded copy-btn theme-copy-btn" onClick={e => showQR(e, 'Cheque')}>
                            <i className="fas fa-qrcode"></i>
                        </button>
                        <ClipboardCopy value={chequeAddress} />
                    </div>
                    <div className="flex">
                        <a
                            className="theme-link"
                            href={bttcScanLinkCheck() + '/address/' + chequeAddress}
                            target="_blank"
                            rel="noreferrer">
                            <Truncate className="theme-link">{chequeAddress}</Truncate>
                        </a>
                    </div>
                </div>
                <div
                    className="mr-2 w-14 h-14 flex justify-center items-center  rounded-full"
                    style={{ background: '#FEEFD9' }}>
                    <img src={require(`assets/img/btt.svg`).default} alt="" width={35} height={35} />
                </div>
            </header>
            <main
                className="p-6 rounded-xl flex flex-col justify-between vault-balance theme-text-main"
                style={{ height: '15.125rem' }}>
                <h5 className="mb-4 font-bold theme-text-main">BTTC {t('vault_contract_balance')}</h5>
                <div>
                    <div className="mb-4 flex flex-wrap" style={{ width: 'calc(100% - 60px)' }}>
                        {allCurrencyBalanceList.map(item => (
                            <CoinItem key={item.unit} item={item} valueAttr="bookBalanceValue" />
                        ))}
                    </div>
                    <div>
                        <ButtonRoundRect className="mr-2" text={t('chequebook_withdraw')} onClick={onWithdraw} />
                        <ButtonRoundRect text={t('chequebook_deposit')} onClick={onDeposit} />
                    </div>
                </div>
            </main>
        </div>
    );
};

let didCancel = false;

export default function NodeWalletStats({ color }) {
    const [BTTCAddress, setBTTCAddress] = useState('--');
    const [chequeAddress, setChequeAddress] = useState('--');
    // eslint-disable-next-line no-unused-vars
    const [chequeBookBalance, setChequeBookBalance] = useState(0);
    const [BTTCAddressBTT, setBTTCAddressBTT] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [BTTCAddressWBTT, setBTTCAddressWBTT] = useState(0);
    const [_chequeBookWBTT, set_ChequeBookWBTT] = useState(0);
    const [_BTTCAddressBTT, set_BTTCAddressBTT] = useState(0);
    const [_BTTCAddressWBTT, set_BTTCAddressWBTT] = useState(0);
    const [balance10, setBalance10] = useState(0);
    const [tronAddress, setTronAddress] = useState('--');
    const [allCurrencyBalanceList, setAllCurrencyBalanceList] = useState([]);

    useEffect(() => {
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    useEffect(() => {
        const set = async function () {
            setTimeout(() => {
                fetchData();
            }, 3000);
        };
        Emitter.on('updateWallet', set);
        return () => {
            Emitter.removeListener('updateWallet');
        };
    }, []);

    const fetchData = async () => {
        didCancel = false;
        let {
            BTTCAddress,
            chequeAddress,
            chequeBookBalance,
            BTTCAddressBTT,
            BTTCAddressWBTT,
            maxAvailableChequeBookWBTT,
            maxAvailableBTT,
            maxAvailableWBTT,
            balance10,
            tronAddress,
            // allCurrencyBalanceList,
            chequeMapBookAllBalanceData,
        } = await getNodeWalletStats();
        if (!didCancel) {
            unstable_batchedUpdates(() => {
                setBTTCAddress(BTTCAddress);
                setChequeAddress(chequeAddress);
                setChequeBookBalance(chequeBookBalance);
                setBTTCAddressBTT(BTTCAddressBTT);
                setBTTCAddressWBTT(BTTCAddressWBTT);
                set_ChequeBookWBTT(maxAvailableChequeBookWBTT);
                set_BTTCAddressBTT(maxAvailableBTT);
                set_BTTCAddressWBTT(maxAvailableWBTT);
                setBalance10(balance10);
                setTronAddress(tronAddress);
                setAllCurrencyBalanceList(() => chequeMapBookAllBalanceData);
            });
        }
    };

    const onDeposit = e => {
        e.preventDefault();
        Emitter.emit('openWithdrawDepositModal', {
            type: 'deposit',
            maxWBTT: _BTTCAddressWBTT,
            allCurrencyBalanceList: allCurrencyBalanceList,
        });
    };

    const onWithdraw = e => {
        e.preventDefault();
        Emitter.emit('openWithdrawDepositModal', {
            type: 'withdraw',
            maxWBTT: _chequeBookWBTT,
            allCurrencyBalanceList: allCurrencyBalanceList,
        });
    };

    // eslint-disable-next-line no-unused-vars
    const onWithdraw10 = e => {
        e.preventDefault();
        console.log(tronAddress);
        Emitter.emit('openWithdrawDepositModal', {
            type: 'withdraw10',
            maxBTT: balance10,
            account: tronAddress,
            allCurrencyBalanceList: allCurrencyBalanceList,
        });
    };

    const onTransfer = e => {
        e.preventDefault();
        Emitter.emit('openTransferConfirmModal', {
            type: 'transfer',
            maxBTT: _BTTCAddressBTT,
            maxWBTT: _BTTCAddressWBTT,
            allCurrencyBalanceList: allCurrencyBalanceList,
        });
    };

    const onExchange = e => {
        e.preventDefault();
        Emitter.emit('openExchangeModal', {
            type: 'exchange',
            maxBTT: _BTTCAddressBTT,
            maxWBTT: _BTTCAddressWBTT,
        });
    };

    const showQR = (e, type) => {
        e.preventDefault();
        if (type === 'Cheque') {
            Emitter.emit('openQRModal', { address: chequeAddress });
        }
        if (type === 'BTTC') {
            Emitter.emit('openQRModal', { address: BTTCAddress });
        }
    };

    return (
        <div className="mb-4 flex flex-wrap items-stretch common-card shadow-none xl:shadow-md p-0">
            <div className="mb-4 w-full common-card theme-bg theme-border-color xl:mb-0 xl:w-1/2 xl:border-r xl:shadow-none xl:rounded-none xl:rounded-l-2xl">
                <BTTCWalletStats
                    showQR={showQR}
                    BTTCAddress={BTTCAddress}
                    BTTCAddressBTT={BTTCAddressBTT}
                    allCurrencyBalanceList={allCurrencyBalanceList}
                    onTransfer={onTransfer}
                    onExchange={onExchange}
                />
            </div>
            <div className="w-full common-card theme-bg xl:w-1/2 xl:shadow-none xl:rounded-none xl:rounded-r-2xl">
                <ChequeBookStats
                    showQR={showQR}
                    chequeAddress={chequeAddress}
                    allCurrencyBalanceList={allCurrencyBalanceList}
                    onWithdraw={onWithdraw}
                    onDeposit={onDeposit}
                />
            </div>
        </div>
    );
}
