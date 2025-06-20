import React, { useContext } from 'react';
import NodeBasicStats from 'components/Stats/NodeBasicStats.js';
import NodeRevenueStats from 'components/Stats/NodeRevenueStats.js';
import NodeWalletStats from 'components/Stats/NodeWalletStats.js';
import NodeStorageStats from 'components/Stats/NodeStorageStats.js';
// import CardHostScore from 'components/Cards/CardHostScore.js';
import CardNetworkFlow from 'components/Cards/CardNetworkFlow.js';
import RevenueHistoryLineChart from 'components/Charts/RevenueHistoryLineChart.js';
import NetworkLineChart from 'components/Charts/NetworkLineChart.js';
import WithdrawDepositModal from 'components/Modals/WithdrawDepositModal.js';
import ExchangeModal from 'components/Modals/ExchangeModal.js';
import TransferConfirmModal from 'components/Modals/TransferConfirmModal.js';
import QRModal from 'components/Modals/QRModal.js';
import CheckDetailModal from 'components/Modals/CheckDetailModal.js';
import PWDModal from 'components/Modals/PWDModal.js';
import { MAIN_PAGE_MODE } from 'utils/constants';

import { mainContext } from 'reducer';

export default function Dashboard() {
  const { state } = useContext(mainContext);
  const { theme, pageMode } = state;
  const isMainMode = MAIN_PAGE_MODE === pageMode;

  return (
    <div>
      <NodeBasicStats color={theme} isMainMode={isMainMode} />
      { isMainMode  &&
        <>
          <div className="mb-4 flex flex-wrap">
            <div className="mb-4 w-full xl:w-1/2 xl:mb-0 xl:pr-2">
            <NodeRevenueStats color={theme} />
            </div>
            <div className="w-full xl:w-6/12 xl:pl-2">
            <RevenueHistoryLineChart color={theme} />
            </div>
          </div>
          <NodeWalletStats color={theme} />
          <NodeStorageStats color={theme} />
        </>
      }
      <div className="flex flex-wrap">
        <div className="mb-4 w-full pr-0 xl:mb-0 xl:w-9/12 xl:pr-2">
          <NetworkLineChart color={theme} />
        </div>
        <div className="w-full pl-0 xl:w-3/12 xl:pl-2">
          <CardNetworkFlow color={theme} />
        </div>
      </div>
      <WithdrawDepositModal color={theme} />
      <ExchangeModal color={theme} />
      <TransferConfirmModal color={theme} />
      <QRModal />
      <PWDModal color={theme} />
      <CheckDetailModal color={theme} />
    </div>
  );
}
