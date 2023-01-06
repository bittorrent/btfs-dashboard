import React, { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { getNodeStorageStats } from 'services/dashboardService.js';
import { t } from 'utils/text.js';

const UncashedAmount = ({ uncashed, uncashedChange }) => {
  return (
    <div className="w-full h-full flex justify-between">
      <div className="w-full flex flex-col justify-between">
        <h5 className="mb-5 text-base font-bold theme-text-main">
          {t('uncashed')} {t('amount')}
        </h5>
        <div className="mb-4 flex justify-between">
          <span className="flex items-end font-bold theme-text-main">
            <span className="mr-1 text-xl leading-none">{uncashed}</span>
            <span className="leading-none">WBTT</span>
          </span>
          <span className="block">
            <div className="mb-px text-sm leading-none theme-text-sub-info">24h</div>
            <div className="text-base leading-none theme-text-success">+{uncashedChange}</div>
          </span>
        </div>
        <div>
          <Link to="/admin/cheque" className="theme-link ">
            {t('cash')} &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  );
};

const Contracts = ({ contracts, hostPrice }) => {
  return (
    <div className="w-full h-full flex justify-between">
      <div className="w-full flex flex-col justify-between">
        <h5 className="mb-5 text-base font-bold theme-text-main">{t('contracts')}</h5>
        <div className="mb-4 flex-grow flex items-end text-xl font-bold leading-none theme-text-main">
          {contracts}
        </div>
        <div className="theme-text-sub-main">
          {t('price')}: {hostPrice} WBTT (GB / {t('month')})
        </div>
      </div>
    </div>
  );
};

const Storage = ({ storageUsed, capacity, percentage }) => {
  return (
    <div className="relative w-full h-full flex justify-between">
      <div className="flex flex-col justify-between">
        <h5 className="mb-5 text-base font-bold theme-text-main">{t('storage')}</h5>
        <div className="flex-grow flex items-end text-xl font-bold leading-none theme-text-main">
          <span className="font-bold text-xl leading-none">{storageUsed}</span>
          <span className="font-bold text-sm leading-none">&nbsp;/{capacity}</span>
        </div>
      </div>
      <div className="absolute right-0">
        <Progress
          type="dashboard"
          gapDegree={180}
          strokeWidth={10}
          width={120}
          percent={percentage}
          trailColor="#ECF2FF"
          strokeColor="#06A561"
          format={percent => <div className="-mt-2 font-bold text-xl theme-text-success">{percent}%</div>}
        />
      </div>
    </div>
  );
};

export default function NodeStorageStats({ color }) {
  const [capacity, setCapacity] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [hostPrice, setHostPrice] = useState(0);
  const [contracts, setContracts] = useState(0);
  const [uncashed, setUncashed] = useState(0);
  const [uncashedChange, setUncashedChange] = useState(0);

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      let { capacity, storageUsed, percentage, hostPrice, contracts, uncashed, uncashedChange } =
        await getNodeStorageStats();
      if (!didCancel) {
        unstable_batchedUpdates(() => {
          setCapacity(capacity);
          setStorageUsed(storageUsed);
          setPercentage(percentage);
          setHostPrice(hostPrice);
          setContracts(contracts);
          setUncashed(uncashed);
          setUncashedChange(uncashedChange);
        });
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <div className="mb-4 relative common-card p-0">
      <div className="mx-auto w-full">
        <div className="flex flex-wrap">
          <div className="px-6 py-8 w-full border-b theme-border-color rounded-t-2xl theme-bg xl:w-1/3 xl:border-0 xl:border-r xl:rounded-none xl:rounded-l-2xl">
            <UncashedAmount uncashed={uncashed} uncashedChange={uncashedChange} />
          </div>
          <div className="px-6 py-8 w-full border-b theme-bg theme-border-color xl:w-1/3 xl:border-0 xl:border-r">
            <Contracts contracts={contracts} hostPrice={hostPrice} />
          </div>
          <div className="px-6 py-8 w-full rounded-b-2xl theme-bg xl:w-1/3 xl:rounded-none xl:rounded-r-2xl">
            <Storage storageUsed={storageUsed} capacity={capacity} percentage={percentage} />
          </div>
        </div>
      </div>
    </div>
  );
}
