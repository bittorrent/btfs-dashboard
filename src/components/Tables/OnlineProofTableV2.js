/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import { getHeartBeatsReportlistV2 } from 'services/dashboardService.js';
import { t } from 'utils/text.js';
import OnlineProofDetailModal from 'components/Modals/OnlineProofDetailModal';
import Emitter from 'utils/eventBus';

let didCancel = false;
export default function OnlineProofTable({ color }) {
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [bttcAddr, setBttcAddr] = useState('');

  const openDetailModal = (item, bttcAddr) => {
    Emitter.emit('openOnlineProofDetailModal', { item, bttcAddr });
  };

  const pageChange = useCallback(page => {
    updateTable(page);
  }, []);

  const updateTable = async page => {
    didCancel = false;
    let { records, total, peer_id, bttc_addr } = await getHeartBeatsReportlistV2((page - 1) * 10, 10);
    if (!didCancel) {
      setList(records);
      setTotal(total);
      setCurrent(page);
      setPeerId(peer_id);
      setBttcAddr(bttc_addr);
    }
  };

  useEffect(() => {
    updateTable(1);
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <>
      <div className="common-card theme-bg">
        <div className="mb-4">
          <div className="mb-4 flex justify-between">
            <h3 className="text-base theme-text-main">{t('online_proof_detail')}</h3>
            {peerId && (
              <a href={`https://scan.btfs.io/#/node/${peerId}`} target="_blank" className="theme-link">
                {t('heart_to_scan')}
              </a>
            )}
          </div>
          <div className="text-xs theme-text-sub-main">{t('list_des')}</div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full bg-transparent border-collapse">
            <thead className="theme-table-head-bg">
              <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
                <th className="common-table-head-th">{t('online_proof_node_id')}</th>
                <th className="common-table-head-th">{t('online_proof_sign_time')}</th>
                <th className="common-table-head-th">{t('online_proof_heart_beats')}</th>
                <th className="common-table-head-th">{t('online_proof_table_detail')}</th>
              </tr>
            </thead>
            <tbody>
              {list &&
                list.map((items, index) => {
                  return (
                    <tr
                      key={index}
                      className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">
                      <td className="common-table-body-td">
                        <span>{items.last_signed_info.peer}</span>
                      </td>
                      <td className="common-table-body-td">
                        <span>
                          {moment.unix(items.last_signed_info.signed_time).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                      </td>
                      <td className="common-table-body-td">
                        <span>{items.last_signed_info.nonce}</span>
                      </td>
                      <td className="common-table-body-td">
                        <a className="theme-link" onClick={() => openDetailModal(items, bttcAddr)}>
                          {t('check')}
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!list && (
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
      <OnlineProofDetailModal />
    </>
  );
}

OnlineProofTable.defaultProps = {
  color: 'light',
};

OnlineProofTable.propTypes = {
  color: PropTypes.oneOf(['light', 'dark']),
};
