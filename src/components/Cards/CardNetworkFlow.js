import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { getNetworkFlow } from 'services/dashboardService.js';
import { t } from 'utils/text.js';

let didCancel = false;

export default function CardNetworkFlow({ color }) {
  const [receive, setReceive] = useState(0);
  const [send, setSend] = useState(0);

  useEffect(() => {
    fetchData();
    let interval = setInterval(() => {
      fetchData();
    }, 6000);
    return () => {
      didCancel = true;
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    didCancel = false;
    let data = await getNetworkFlow();
    if (!didCancel) {
      setReceive(data['receive']);
      setSend(data['send']);
    }
  };

  return (
    <div className="h-full common-card theme-bg">
      <h5 className="mb-4 font-bold text-base theme-text-main">{t('network_traffic')}</h5>
      <div className="flex justify-around xl:flex-col xl:items-center">
        <div className="">
          <Progress
            type="dashboard"
            gapDegree={90}
            strokeWidth={10}
            width={120}
            percent={parseFloat(receive) < 10000 ? receive / 10000 : 100}
            trailColor="#ECF2FF"
            strokeColor="#06A561"
            format={() => (
              <div className="mt-6 theme-text-sub-main">
                <div className="font-bold text-3xl leading-none">{receive}</div>
                <div className="text-xs leading-none">KB/s</div>
                <div className="mt-3 text-xs">In</div>
              </div>
            )}
          />
        </div>
        <div className="xl:mt-2">
          <Progress
            type="dashboard"
            gapDegree={90}
            strokeWidth={10}
            width={120}
            percent={parseFloat(send) < 10000 ? send / 10000 : 100}
            trailColor="#ECF2FF"
            strokeColor="#F99600"
            format={() => (
              <div className="mt-6 theme-text-sub-main">
                <div className="font-bold text-3xl leading-none">{send}</div>
                <div className="text-xs leading-none">KB/s</div>
                <div className="mt-3 text-xs">Out</div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
