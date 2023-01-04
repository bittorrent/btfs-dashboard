/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from 'react';
import QRModal from 'components/Modals/QRModal.js';
import OnlineProofStats from 'components/Stats/OnlineProofStats.js';
import OnlineProofStatsV2 from 'components/Stats/OnlineProofStatsV2.js';
import OnlineProofTable from 'components/Tables/OnlineProofTable.js';
import OnlineProofTableV2 from 'components/Tables/OnlineProofTableV2.js';
import { getHeartBeatsStats } from 'services/dashboardService.js';
import { t } from 'utils/text.js';
import { mainContext } from 'reducer';
import { Tooltip } from 'antd';

const V2 = 2;
const V1 = 1;

export default function HeartBeats() {
  const { state } = useContext(mainContext);
  const { theme } = state;

  const [version, setVersion] = useState(V2);
  const [hasV1Data, setHasV1Data] = useState(false);

  const handleClick = () => {
    setVersion(version === V2 ? V1 : V2);
  };

  const fetchV1Data = async () => {
    let { status_contract, total_count, total_gas_spend } = await getHeartBeatsStats();
    setHasV1Data(!!(status_contract || total_count || total_gas_spend));
  };

  useEffect(() => {
    fetchV1Data();
  }, []);

  return (
    <div>
      {hasV1Data && <SwitchVersion version={version} onClick={handleClick} />}
      {version === V2 && (
        <>
          <OnlineProofStatsV2 color={theme} />
          <OnlineProofTableV2 color={theme} />
          <QRModal color={theme} />
        </>
      )}
      {hasV1Data && version === V1 && (
        <>
          <OnlineProofStats color={theme} />
          <OnlineProofTable color={theme} />
          <QRModal color={theme} />
        </>
      )}
    </div>
  );
}

function SwitchVersion({ version, onClick }) {
  return (
    <div className={`flex justify-end py-2`}>
      <a onClick={onClick} className="flex items-center theme-link">
        <span className={`text-md font-bold`}>{version === V2 ? t('switch_to_v1') : t('switch_to_v2')}</span>
        <span className={`text-sm px-1`}>
          <i className="fas fa-arrows-alt-h"></i>
        </span>
        <Tooltip title={t('switch_v1_v2_tootip')}>
          <span className="text-sm">
            <i className="fas fa-question-circle"></i>
          </span>
        </Tooltip>
      </a>
    </div>
  );
}
