import React, { useEffect, useState } from 'react';
import { Progress, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { unstable_batchedUpdates } from 'react-dom';
import { getNodeRevenueStats } from 'services/dashboardService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

const ChequeItem = ({
    value,
    unit,
    percent,
    dotColor = '#848484',
    text,
    hasDetail,
    onDetail,
    disabled,
    tooltip,
}) => {
    dotColor = disabled ? '#848484' : dotColor;
    const titleClassName = disabled ? ' theme-text-sub-main' : ' theme-text-main';
    return (
        <div className="py-2 flex justify-between items-center">
            <div className="my-2">
                <div className={'font-bold mb-1' + titleClassName}>
                    <span className="mr-1 text-base">{value}</span>
                    {unit && <span>{unit}</span>}
                </div>
                <div className="flex items-center theme-text-main">
                    <span className="w-2 h-2 inline-block rounded" style={{ backgroundColor: dotColor }}></span>
                    <span className="mx-1">{text}</span>
                    {tooltip && <span className="mr-2 mb-0.5 leading-none theme-hover-color">{tooltip}</span>}
                    <span>{percent}%</span>
                </div>
            </div>
            {hasDetail && (
                <div className="h-full flex items-center">
                    <button className="round-btn w-6 h-6 theme-round-btn" onClick={onDetail}>
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

const TotalEarnings = ({ chequeEarning, showChequeEarningTips }) => {
    return (
        <div className="w-full h-full flex justify-between">
            <div className="w-full flex flex-col justify-between">
                <header className="mb-5 font-bold theme-text-main">
                    <h5 className="text-base theme-text-main">{t('total_earnings')}</h5>
                    <div>
                        <span className="mr-1 text-xl">{chequeEarning}</span>
                        <span>BTT</span>
                    </div>
                </header>
                <main>
                    <div>
                        <ChequeItem
                            value={chequeEarning}
                            unit="BTT"
                            percent={100}
                            dotColor="#F99600"
                            text={t('cheque_earnings')}
                            hasDetail
                            onDetail={showChequeEarningTips}
                            tooltip={
                                <Tooltip placement="bottom" title={<p>{t('cheque_earnings_des')}</p>}>
                                    <InfoCircleOutlined />
                                </Tooltip>
                            }
                        />
                        <ChequeItem value={t('coming_soon')} text={t('airdrop')} percent={0} disabled />
                    </div>
                    <div>
                        <Progress
                            type="circle"
                            strokeWidth={20}
                            strokeLinecap="butt"
                            trailColor="#F99600"
                            strokeColor="#F99600"
                            percent={100}
                            width={90}
                            format={() => (
                                <span className="text-base" style={{ color: '#5A607F' }}>
                                    <i className="fa-solid fa-receipt"></i>
                                </span>
                            )}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

const TotalExpense = ({
    totalExpense,
    chequeExpensePercent,
    chequeExpense,
    showChequeExpenseTips,
    gasFeePercent,
    gasFee,
}) => {
    return (
        <div className="w-full h-full flex justify-between">
            <div className="w-full flex flex-col justify-between">
                <header className="mb-5 font-bold theme-text-main">
                    <h5 className="text-base theme-text-main">{t('total_expense')}</h5>
                    <div>
                        <span className="mr-1 text-xl">{totalExpense}</span>
                        <span>BTT</span>
                    </div>
                </header>
                <main>
                    <div>
                        <ChequeItem
                            value={chequeExpense}
                            unit="BTT"
                            percent={chequeExpensePercent}
                            dotColor="#2EBBB9"
                            text={t('cheque_expense')}
                            hasDetail
                            onDetail={showChequeExpenseTips}
                            tooltip={
                                <Tooltip placement="bottom" title={<p>{t('cheque_earnings_des')}</p>}>
                                    <InfoCircleOutlined />
                                </Tooltip>
                            }
                        />
                        <ChequeItem
                            value={gasFee}
                            unit="BTT"
                            percent={gasFeePercent}
                            dotColor="#2E5EBB"
                            text={t('gas_fee')}
                            tooltip={
                                <Tooltip placement="bottom" title={<p>{t('cheque_expense_des')}</p>}>
                                    <InfoCircleOutlined />
                                </Tooltip>
                            }
                        />
                    </div>
                    <div>
                        <Progress
                            type="circle"
                            strokeWidth={20}
                            strokeLinecap="butt"
                            trailColor="#2E5EBB"
                            strokeColor="#2EBBB9"
                            percent={chequeExpensePercent}
                            width={90}
                            format={() => (
                                <span className="text-base" style={{ color: '#5A607F' }}>
                                    <i className="fa-solid fa-receipt"></i>
                                </span>
                            )}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default function NodeRevenueStats({ color }) {
    const [chequeEarning, setChequeEarning] = useState(0);
    const [chequeExpense, setChequeExpense] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [uncashedPercent, setUncashedPercent] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [cashedPercent, setCashedPercent] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [gasFee, setGasFee] = useState(0);
    const [gasFeePercent, setGasFeePercent] = useState(0);
    const [chequeExpensePercent, setChequeExpensePercent] = useState(0);
    const [checksExpenseDetailList, setChecksExpenseDetailList] = useState([]);
    const [chequeEarningDetailList, setChequeEarningDetailData] = useState([]);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {
                chequeEarning,
                chequeExpense,
                uncashedPercent,
                cashedPercent,
                totalExpense,
                gasFee,
                gasFeePercent,
                chequeExpensePercent,
                checksExpenseDetailsData,
                chequeEarningDetailData,
            } = await getNodeRevenueStats();
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
                    setChecksExpenseDetailList(() => {
                        return checksExpenseDetailsData;
                    });
                    setChequeEarningDetailData(() => {
                        return chequeEarningDetailData;
                    });
                });
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const showChequeExpenseTips = () => {
        Emitter.emit('openCheckDetailModal', {
            title: t('checks_expense_details'),
            dataList: checksExpenseDetailList,
        });
    };

    const showChequeEarningTips = () => {
        Emitter.emit('openCheckDetailModal', {
            title: t('cheque_earning_detail'),
            dataList: chequeEarningDetailList,
        });
    };

    return (
        <div className="w-full h-full common-card shadow-none lg:shadow-md p-0">
            <div className="flex flex-wrap h-full">
                <div className="mb-4 w-full common-card theme-bg theme-border-color lg:mb-0 lg:w-1/2 lg:border-r lg:shadow-none lg:rounded-none lg:rounded-l-2xl">
                    <TotalEarnings chequeEarning={chequeEarning} showChequeEarningTips={showChequeEarningTips} />
                </div>
                <div className="w-full common-card theme-bg lg:w-1/2 lg:shadow-none lg:rounded-none lg:rounded-r-2xl">
                    <TotalExpense
                        totalExpense={totalExpense}
                        chequeExpensePercent={chequeExpensePercent}
                        chequeExpense={chequeExpense}
                        showChequeExpenseTips={showChequeExpenseTips}
                        gasFeePercent={gasFeePercent}
                        gasFee={gasFee}
                    />
                </div>
            </div>
        </div>
    );
}
