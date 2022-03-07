import React, {useContext} from "react";
import NodeBasicStats from "components/Stats/NodeBasicStats.js";
import NodeRevenueStats from "components/Stats/NodeRevenueStats.js";
import NodeWalletStats from "components/Stats/NodeWalletStats.js";
import NodeStorageStats from "components/Stats/NodeStorageStats.js";
import CardHostScore from "components/Cards/CardHostScore.js";
import CardNetworkFlow from "components/Cards/CardNetworkFlow.js";
import HostScoreHistoryLineChart from "components/Charts/HostScoreHistoryLineChart.js";
import RevenueHistoryLineChart from "components/Charts/RevenueHistoryLineChart.js";
import NetworkLineChart from "components/Charts/NetworkLineChart.js";
import WithdrawDepositModal from "components/Modals/WithdrawDepositModal.js";
import ExchangeModal from "components/Modals/ExchangeModal.js";
import TransferConfirmModal from "components/Modals/TransferConfirmModal.js";
import QRModal from "components/Modals/QRModal.js";

import {mainContext} from "reducer";

export default function Dashboard() {

    const {state} = useContext(mainContext);
    const {theme} = state;

    return (
        <>
            <NodeBasicStats color={theme}/>
            <div className="flex flex-wrap">
                <div className="w-full xl:w-6/12 mb-4 xl:mb-0 xl:pr-2">
                    <CardHostScore color={theme}/>
                </div>
                <div className="w-full xl:w-6/12 mb-4 xl:pl-2">
                    <HostScoreHistoryLineChart color={theme}/>
                </div>
            </div>
            <NodeRevenueStats color={theme}/>
            <RevenueHistoryLineChart color={theme}/>
            <NodeWalletStats color={theme}/>
            <NodeStorageStats color={theme}/>
            <div className="flex flex-wrap">
                <div className="w-full xl:w-9/12 lg:pr-2 mb-2">
                    <NetworkLineChart color={theme}/>
                </div>
                <div className="w-full xl:w-3/12 lg:pl-2 mb-2">
                    <CardNetworkFlow color={theme}/>
                </div>
            </div>
            <WithdrawDepositModal color={theme}/>
            <ExchangeModal color={theme}/>
            <TransferConfirmModal color={theme}/>
            <QRModal color={theme}/>
        </>
    );
}
