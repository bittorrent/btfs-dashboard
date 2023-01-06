/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import { getHeartBeatsReportlist } from 'services/dashboardService.js';
import { Truncate, t } from 'utils/text.js';

let didCancel = false;
export default function OnlineProofTable({ color }) {
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [peerId, setPeerId] = useState('');

  const pageChange = useCallback(page => {
    updateTable(page);
  }, []);

  const updateTable = async page => {
    didCancel = false;

    let { records, total, peer_id } = await getHeartBeatsReportlist((page - 1) * 10, 10);
    if (!didCancel) {
      setList(records);
      setTotal(total);
      setCurrent(page);
      setPeerId(peer_id);
    }
  };

  useEffect(() => {
    updateTable(1);
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <div className="common-card theme-bg">
      <div className="mb-4">
        <div className="mb-4 flex justify-between">
          <h3 className="text-base theme-text-main">{t('transaction_list')}</h3>
        </div>
        <div className="text-xs theme-text-sub-main">{t('list_des')}</div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-transparent border-collapse">
          <thead className="theme-table-head-bg">
            <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
              <th className="common-table-head-th">{t('heart_th_time')}</th>
              <th className="common-table-head-th">{t('heart_th_txhash')}</th>
              <th className="common-table-head-th">{t('heart_th_from')}</th>
              <th className="common-table-head-th">{t('heart_th_contract')}</th>
              <th className="common-table-head-th">
                <span>{t('heart_th_nonce')}</span>
                <Tooltip
                  overlayInnerStyle={{ width: '200px' }}
                  placement="rightTop"
                  title={<p>{t('heart_th_nonce_tips')}</p>}>
                  <i className="fas fa-question-circle ml-1 text-xs"></i>
                </Tooltip>
              </th>
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
                      <span>{items['report_time']}</span>
                    </td>
                    <td className="common-table-body-td">
                      <a href={'https://bttcscan.com/tx/' + items['tx_hash']} target="_blank">
                        <Truncate>{items['tx_hash']}</Truncate>
                      </a>
                    </td>
                    <td className="common-table-body-td">
                      <a href={'https://bttcscan.com/address/' + items['bttc_addr']} target="_blank">
                        <Truncate>{items['bttc_addr']}</Truncate>({t('bttc_addr')})
                      </a>
                    </td>
                    <td className="common-table-body-td">
                      <a href={'https://bttcscan.com/address/' + items['status_contract']} target="_blank">
                        <Truncate>{items['status_contract']}</Truncate>
                      </a>
                    </td>
                    <td className="common-table-body-td">
                      {items['nonce']}(+{items['increase_nonce']})
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
  );
}

OnlineProofTable.defaultProps = {
  color: 'light',
};

OnlineProofTable.propTypes = {
  color: PropTypes.oneOf(['light', 'dark']),
};
