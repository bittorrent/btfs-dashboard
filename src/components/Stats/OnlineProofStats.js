/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { getHeartBeatsStats } from 'services/dashboardService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

let didCancel = false;

export default function HeartBeatsStats({ color }) {
  const [statusContarct, setStatusContarct] = useState('--');
  const [total, setTotal] = useState('--');
  const [gas, setGas] = useState('--');

  useEffect(() => {
    fetchData();
    return () => {
      didCancel = true;
    };
  }, []);

  const fetchData = async () => {
    didCancel = false;
    let { status_contract, total_count, total_gas_spend } = await getHeartBeatsStats();

    if (!didCancel) {
      setStatusContarct(status_contract ?? '--');
      setTotal(total_count ?? 0);
      setGas(total_gas_spend ?? 0);
    }
  };

  const showQR = e => {
    e.preventDefault();
    Emitter.emit('openQRModal', { address: statusContarct });
  };

  return (
    <div className="mb-4 flex flex-wrap">
      <div className="w-full h-128-px mb-4 lg:mb-0 lg:w-1/2 lg:pr-2">
        <div className="h-full common-card theme-bg">
          <h5 className="flex justify-between items-center text-base theme-text-main">
            <div>
              <span>{t('heart_contract')}</span>
              <Tooltip placement="bottom" title={<p>{t('heart_contract_des')}</p>}>
                <i className="fas fa-question-circle text-ms ml-2"></i>
              </Tooltip>
            </div>
            <div>
              <button className="ml-2 rounded copy-btn theme-copy-btn" onClick={e => showQR(e, 'BTTC')}>
                <i className="fas fa-qrcode"></i>
              </button>
              <ClipboardCopy value={statusContarct} />
            </div>
          </h5>
          <div className="mt-8 theme-text-main">
            <span className="mr-2 text-sm font-bold">{statusContarct}</span>
          </div>
        </div>
      </div>
      <div className="w-full h-128-px lg:w-1/2 lg:pl-2">
        <div className="h-full common-card theme-bg">
          <h5 className="text-base theme-text-main">{t('heart_transaction')}</h5>
          <div className="mt-7 theme-text-main">
            <span>
              <span className="text-lg font-bold">{total}</span>
              <span> {t('in_total')}</span>
            </span>
            <span className="ml-8">
              <span className="text-lg font-bold">{gas} BTT</span>
              <span> {t('gas_spend')}</span>
              <Tooltip placement="bottom" title={<p>{t('gas_spend_des')}</p>}>
                <i className="fas fa-question-circle ml-1 text-xs"></i>
              </Tooltip>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
