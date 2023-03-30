import React, { useEffect, useState } from 'react';
import HostScoreRingChart from 'components/Charts/HostScoreRingChart.js';
import HostScoreProgressChart from 'components/Charts/HostScoreProgressChart.js';
import { getHostAllScore } from 'services/dashboardService.js';

let didCancel = false;
export default function CardHostScore({ color }) {
  const [newRingChartData, setNewRingChartData] = useState({
    lastUpdated: 0,
    level: 0,
  });
  const [newProgressChartData, setNewProgressChartData] = useState({
    uptimeLevel: 0,
    ageLevel: 0,
    versionLevel: 0,
    activeLevel: 0,
  });

  const [newScoreInit, setNewScoreInit] = useState(true);

  useEffect(() => {
    fetchData();
    return () => {
      didCancel = true;
    };
  }, []);

  const fetchData = async () => {
    didCancel = false;
    const [data2] = await getHostAllScore();
    const newLeftData = data2.leftData;
    const newRightData = data2.rightData;
    if (!didCancel) {
      if (newLeftData.level) {
        setNewRingChartData(newLeftData);
        setNewProgressChartData(newRightData);
        setNewScoreInit(false);
      } else {
        setNewScoreInit(true);
      }
    }
  };

  return (
    <div className={'h-full common-card p-0 shadow-none lg:shadow-md'}>
      <div className="flex flex-wrap h-full">
        <div className="mb-4 w-full common-card p-0 theme-bg theme-border-color lg:mb-0 lg:w-1/2 lg:border-r lg:shadow-none lg:rounded-none lg:rounded-l-2xl">
          <HostScoreRingChart data={newRingChartData} color={color} />
        </div>
        <div className="w-full common-card p-0 theme-bg lg:w-1/2 lg:shadow-none lg:rounded-none lg:rounded-r-2xl">
          <HostScoreProgressChart scoreInit={newScoreInit} data={newProgressChartData} color={color} />
        </div>
      </div>
    </div>
  );
}
