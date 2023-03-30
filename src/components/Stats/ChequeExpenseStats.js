import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { getChequeExpenseAllStats } from 'services/chequeService.js';
import { MULTIPLE_CURRENCY_LIST } from 'utils/constants';
import { t } from 'utils/text.js';
import { switchBalanceUnit } from 'utils/BTFSUtil.js';
import MultipleCurrenyList from './MultipleCurrenyList.js';
import { ChequeMain } from './ChequeStats.js';

const ExpenseChequesMain = ({ chequesStats }) => {
    const { chequeReceiveCount, receiveCashedValue, receiveUncashValue, receiveCashedValuePercent } = chequesStats;
    const title = <h5 className={'text-base font-bold theme-text-main'}>{t('received_cheques')}</h5>;
    return (
        <ChequeMain
            title={title}
            total={chequeReceiveCount}
            cashed={receiveCashedValue}
            uncashed={receiveUncashValue}
            percent={receiveCashedValuePercent}
            unit="BTT"
        />
    );
};

const ExpenseCheques = ({ chequesStats, expenseCountAllStatsData, color }) => {
    return (
        <div className={'relative break-words mb-2 xl:mb-0 rounded-2xl theme-bg theme-text-main common-box-shadow'}>
            <div className="flex flex-col  justify-between" style={{ height: 467 }}>
                <ExpenseChequesMain color={color} chequesStats={chequesStats} />
                <MultipleCurrenyList color={color} type={'sentCheques'} dataList={expenseCountAllStatsData} />
            </div>
        </div>
    );
};

const ExpenseAmountMain = ({ chequesStats, color }) => {
    let { chequeSentValue, cashedValuePercent, cashedValue, uncashedValue } = chequesStats;
    chequeSentValue = switchBalanceUnit(chequeSentValue, 1);
    cashedValue = switchBalanceUnit(cashedValue, 1);
    uncashedValue = switchBalanceUnit(uncashedValue, 1);
    const title = (
        <div className="flex items-center">
            <h5 className={'text-base font-bold theme-text-main'}>{t('sent_cheques_amount')}</h5>
            <Tooltip title={t('cheques_amount_tooltip')}>
                <div className="ml-1">
                    <i className="fas fa-info-circle"></i>
                </div>
            </Tooltip>
        </div>
    );
    return (
        <ChequeMain
            title={title}
            total={chequeSentValue}
            cashed={cashedValue}
            uncashed={uncashedValue}
            percent={cashedValuePercent}
            unit="BTT"
        />
    );
};

const ExpenseAmount = ({ chequesStats, expenseValueAllStatsData, color }) => {
    return (
        <div className={'relative break-words mb-2 xl:mb-0 rounded-2xl theme-bg theme-text-main common-box-shadow'}>
            <div className="flex flex-col  justify-between" style={{ height: 467 }}>
                <ExpenseAmountMain color={color} chequesStats={chequesStats} />
                <MultipleCurrenyList color={color} dataList={expenseValueAllStatsData} />
            </div>
        </div>
    );
};

export default function ChequeExpenseStats({ color }) {
    const [chequesStats, setChequesStats] = useState({
        chequeSentCount: 0,
        chequeSentValue: 0,
        uncashedValue: 0,
        cashedValue: 0,
        cashedValuePercent: 0,
    });
    const [expenseValueAllStatsData, setExpenseValueAllStatsData] = useState(MULTIPLE_CURRENCY_LIST);
    const [expenseCountAllStatsData, setExpenseCountAllStatsData] = useState(MULTIPLE_CURRENCY_LIST);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let { WBTTData, expenseValueAllStatsData, expenseCountAllStatsData } = await getChequeExpenseAllStats();
            if (!didCancel) {
                setChequesStats(WBTTData);
                setExpenseValueAllStatsData(() => expenseValueAllStatsData);
                setExpenseCountAllStatsData(() => expenseCountAllStatsData);
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
                    <div className="flex flex-wrap common-card p-0" style={{boxShadow: 'none'}}>
                        <div className="w-full xl:w-6/12 xl:pr-2">
                            <ExpenseCheques
                                chequesStats={chequesStats}
                                expenseCountAllStatsData={expenseCountAllStatsData}
                                color={color}
                            />
                        </div>

                        <div className="w-full xl:w-6/12 xl:pl-2">
                            <ExpenseAmount
                                chequesStats={chequesStats}
                                expenseValueAllStatsData={expenseValueAllStatsData}
                                color={color}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
