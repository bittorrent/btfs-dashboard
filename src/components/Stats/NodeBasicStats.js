import React, { useState, useEffect } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useIntl } from 'react-intl';
import {  Tooltip } from 'antd';
import { ReactComponent as OnlineIcon } from 'assets/img/online.svg';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { getNodeBasicStats, getSimpleNodeBasicStats } from 'services/dashboardService.js';
import { t, Truncate } from 'utils/text.js';
import { btfsScanLinkCheck } from 'utils/checks.js';
import { CHAIN_NAME } from 'utils/constants';

// const UPTIME_PROGRESS = {
//   STROKE_COLOR: '#06A561',
//   TRAIL_COLOR: '#C5F1D5',
// };

const HostID = ({ ID,version, chain}) => {
  return (
    <div className="w-full h-full flex justify-between">
      <div className="flex flex-col justify-between">
        <h5 className="text-base font-bold theme-text-main">
          {t('host_id')}
          <ClipboardCopy value={ID} />
        </h5>
        <div className="font-semibold">
          <a href={btfsScanLinkCheck() + '/#/node/' + ID} target="_blank" rel="noreferrer">
            <Truncate>{ID}</Truncate>
          </a>
        </div>
      </div>
      <div className="h-full flex flex-col justify-center items-center">
        <div className="w-14 h-14 rounded-full flex justify-center items-center theme-fill-shallow">
          <OnlineIcon />
        </div>
        <div className="-mt-2 px-2 py-0.5 rounded-full text-xs text-white theme-fill-base">V{version}-{chain}</div>
      </div>
    </div>
  );
};

const Status = ({ status, peers, message }) => {
  const intl = useIntl();
  return (
    <div className="w-full h-full flex justify-between">
      <div className="flex flex-col justify-between">
        <h5 className="text-base font-bold theme-text-main">{t('status')}</h5>
        <div className="font-semibold">
          {status === 1 && (
            <div className="font-semibold theme-text-success">
              <i className="fas fa-circle mr-2"></i>
              <span>
                {t('online')} - {peers} {t('connected')}
              </span>
            </div>
          )}
          {status === 2 && (
            <div className="font-semibold theme-text-warning">
              <Tooltip
                placement="bottom"
                title={
                  <span>
                    {intl.formatMessage({ id: message[0] })} <br /> {intl.formatMessage({ id: message[1] })}
                  </span>
                }>
                <i className="fas fa-circle mr-2"></i>
                <span>{t('network_unstable')}</span>
              </Tooltip>
            </div>
          )}
          {status === 3 && (
            <div className="font-semibold theme-text-warning">
              <Tooltip
                placement="bottom"
                title={
                  <span>
                    {intl.formatMessage({ id: message[0] })} <br /> {intl.formatMessage({ id: message[1] })}{' '}
                    <br /> {intl.formatMessage({ id: message[2] })}
                  </span>
                }>
                <i className="fas fa-circle mr-2"></i>
                <span>{t('network_unstable')}</span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <div className="h-full">
        <div className="mt-1 w-14 h-14 rounded-full flex justify-center items-center text-white theme-fill-success">
          <i className="fa-solid fa-chart-simple"></i>
        </div>
      </div>
    </div>
  );
};

export default function NodeBasicStats({ isMainMode }) {
  const [ID, setID] = useState('--');
  const [peers, setPeers] = useState('--');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('online');
  const [version, setVersion] = useState('');
  const [chain, setChain] = useState('');

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      if(isMainMode){
        let { ID, peers, status, message,version } = await getNodeBasicStats();
        if (!didCancel) {
          unstable_batchedUpdates(() => {
            setID(ID);
            setPeers(peers);
            setVersion(version);
            setChain(CHAIN_NAME[localStorage.getItem('CHAIN_ID')]);
            setStatus(status);
            setMessage(message);
          });
        }
      }else{
        let { ID } = await getSimpleNodeBasicStats();
        if (!didCancel) {
          unstable_batchedUpdates(() => {
            setID(ID);
          });
        }
        }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mb-4 common-card p-0">
      <div className="mx-auto w-full">
        {isMainMode ?
          <div className="flex flex-wrap">
            <div className="px-6 py-8 w-full border-b rounded-t-2xl theme-bg theme-border-color xl:w-1/2 xl:border-0 xl:border-r xl:rounded-none xl:rounded-l-2xl">
              <HostID ID={ID}  version={version} chain={chain}/>
            </div>
            <div className="px-6 py-8 w-full border-b theme-bg theme-border-color xl:w-1/2 xl:border-0 xl:border-r">
              <Status status={status} peers={peers} message={message} />
            </div>
          </div> :
          <div className="flex flex-wrap">
            <div className="px-6 py-8 w-full rounded-2xl theme-bg theme-border-color xl:w-1/1  xl:rounded-none xl:rounded-l-2xl xl:rounded-r-2xl">
              <HostID ID={ID} />
            </div>
          </div>
         }

      </div>
    </div>
  );
}
