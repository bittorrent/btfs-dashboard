import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { getChequeEarningAllStats } from 'services/chequeService.js';
import { t } from 'utils/text.js';
import { MULTIPLE_CURRENCY_LIST } from 'utils/constants';
import MultipleCurrenyList from './MultipleCurrenyList.js';
import { switchBalanceUnit } from 'utils/BTFSUtil.js';
import { ChequeMain } from './ChequeStats.js';

const ReceivedChequesMain = ({ chequesStats }) => {
    const { chequeReceivedCount, cashedCountPercent, cashedCount, uncashedCount } = chequesStats;
    const title = <h5 className={'text-base font-bold theme-text-main'}>{t('received_cheques')}</h5>;
    return (
        <ChequeMain
            title={title}
            total={chequeReceivedCount}
            cashed={cashedCount}
            uncashed={uncashedCount}
            percent={cashedCountPercent}
        />
    );
};

const ReceivedCheques = ({ chequesStats, earningCountAllStatsData, color }) => {
    return (
        <div
            className={
                'relative break-words rounded-2xl mb-2 xl:mb-0 theme-bg theme-text-main common-box-shadow'
            }>
            <div className="flex flex-col justify-between" style={{ height: 467 }}>
                <ReceivedChequesMain chequesStats={chequesStats} color={color} />
                <MultipleCurrenyList type="recievedCheques" color={color} dataList={earningCountAllStatsData} />
            </div>
        </div>
    );
};

const ReceivedAmountMain = ({ chequesStats, color }) => {
    let { chequeReceivedValue, cashedValuePercent, cashedValue, uncashedValue } = chequesStats;
    chequeReceivedValue = switchBalanceUnit(chequeReceivedValue, 1);
    cashedValue = switchBalanceUnit(cashedValue, 1);
    uncashedValue = switchBalanceUnit(uncashedValue, 1);
    const title = (
        <div className="flex items-center theme-text-main">
            <h5 className={'text-base font-bold theme-text-main'}>{t('received_cheques_amount')}</h5>
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
            total={chequeReceivedValue}
            cashed={cashedValue}
            uncashed={uncashedValue}
            percent={cashedValuePercent}
            unit="BTT"
        />
    );
};

const ReceivedAmount = ({ chequesStats, earningValueAllStatsData, color }) => {
    return (
        <div className={'relative break-words rounded-2xl theme-bg theme-text-main common-box-shadow'}>
            <div className="flex flex-col justify-between" style={{ height: 467 }}>
                <ReceivedAmountMain color={color} chequesStats={chequesStats} />
                <MultipleCurrenyList color={color} dataList={earningValueAllStatsData} />
            </div>
        </div>
    );
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
    const [earningCountAllStatsData, setEarningCountAllStatsData] = useState(MULTIPLE_CURRENCY_LIST);
    const [earningValueAllStatsData, setEarningValueAllStatsData] = useState(MULTIPLE_CURRENCY_LIST);

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let { earningCountAllStatsData, earningValueAllStatsData, WBTTData } = await getChequeEarningAllStats();
            if (!didCancel) {
                setChequesStats(WBTTData);
                setEarningCountAllStatsData(() => earningCountAllStatsData);
                setEarningValueAllStatsData(() => earningValueAllStatsData);
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
                <div className="flex flex-wrap common-card p-0" style={{boxShadow: 'none'}}>
                    <div className="w-full xl:w-6/12 xl:pr-2">
                        <ReceivedCheques
                            chequesStats={chequesStats}
                            earningCountAllStatsData={earningCountAllStatsData}
                            color={color}
                        />
                    </div>

                    <div className="w-full xl:w-6/12 xl:pl-2">
                        <ReceivedAmount
                            chequesStats={chequesStats}
                            earningValueAllStatsData={earningValueAllStatsData}
                            color={color}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
