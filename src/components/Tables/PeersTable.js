/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import { getPeers } from 'services/otherService.js';
import { t } from 'utils/text.js';
import { ceilLatency } from 'utils/BTFSUtil.js';
import { btfsScanLinkCheck } from 'utils/checks.js';

let didCancel = false;
let peersAll = [];

export default function PeersTable({ color }) {
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [peers, setPeers] = useState(null);

  const fetchData = async () => {
    didCancel = false;
    let { peers } = await getPeers();
    if (!didCancel) {
      peersAll = peers;
      setTotal(peers.length);
      sliceDate(1);
      setCurrent(1);
    }
  };

  const sliceDate = page => {
    setPeers(peersAll.slice((page - 1) * 10, (page - 1) * 10 + 10));
  };

  const pageChange = useCallback(value => {
    setCurrent(value);
    sliceDate(value);
  }, []);

  const mapFlag = name => {
    try {
      return require('assets/flags/' + name + '.png').default;
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      didCancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="common-card theme-bg theme-text-main">
      <h3 className="mb-8 theme-text-main">
        {t('peers')} : {total}
      </h3>
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-transparent border-collapse">
          <thead className="theme-table-head-bg">
            <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
              <th className="common-table-head-th">{t('location')}</th>
              <th className="common-table-head-th">{t('latency')}</th>
              <th className="common-table-head-th">{t('peer')} ID</th>
              <th className="common-table-head-th">{t('connection')}</th>
            </tr>
          </thead>
          <tbody>
            {peers &&
              peers.map((items, index) => {
                return (
                  <tr
                    key={index}
                    className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">
                    <td className="common-table-body-td">
                      {items['CountryShort'] !== '-' && (
                        <img
                          src={mapFlag(items['CountryShort'])}
                          alt=""
                          className="inline mr-2 mb-1"
                          width={22}
                        />
                      )}
                      <span>{items['CountryShort'] !== '-' ? items['CountryShort'] : '--'}</span>
                    </td>
                    <td className="common-table-body-td">{ceilLatency(items['Latency'])}</td>
                    <td className="common-table-body-td">
                      <div className="flex">
                        <a href={btfsScanLinkCheck() + '/#/node/' + items['Peer']} target="_blank">
                          {items['Peer']}
                        </a>
                      </div>
                    </td>
                    <td className="common-table-body-td">{items['Addr']}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!peers && (
          <div className="w-full flex justify-center pt-4">
            <img
              alt="loading"
              src={require('../../assets/img/loading.svg').default}
              style={{ width: '50px', height: '50px' }}
            />
          </div>
        )}
      </div>
      <div>
        <Pagination
          className={'mt-4 ' + color}
          simple
          current={current}
          total={total}
          hideOnSinglePage={true}
          onChange={pageChange}
        />
      </div>
    </div>
  );
}

PeersTable.defaultProps = {
  color: 'light',
};

PeersTable.propTypes = {
  color: PropTypes.oneOf(['light', 'dark']),
};
