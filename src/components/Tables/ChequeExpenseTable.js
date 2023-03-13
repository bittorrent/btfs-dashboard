/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { getChequeExpenseList } from 'services/chequeService.js';
import { Truncate, t } from 'utils/text.js';
import { switchBalanceUnit } from 'utils/BTFSUtil.js';
import { btfsScanLinkCheck, bttcScanLinkCheck } from 'utils/checks.js';

let didCancel = false;
let chequesAll = [];

export default function ChequeExpenseTable({ color }) {
  const [cheques, setCheques] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  const sliceDate = page => {
    setCheques(chequesAll.slice((page - 1) * 10, (page - 1) * 10 + 10));
  };

  const pageChange = useCallback(value => {
    setCurrent(value);
    sliceDate(value);
  }, []);

  const updateTable = async () => {
    didCancel = false;
    let { cheques, total } = await getChequeExpenseList();
    if (!didCancel) {
      chequesAll = cheques;
      setTotal(total);
      sliceDate(1);
      setCurrent(1);
    }
  };

  useEffect(() => {
    updateTable();
    return () => {
      didCancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-w-0 w-full flex flex-col shadow-lg rounded break-words theme-bg theme-text-main">
      <div className="w-full overflow-x-auto" style={{ minHeight: 160 }}>
        <table className="w-full bg-transparent border-collapse">
          <thead className="theme-table-head-bg">
            <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
              <th className="common-table-head-th">{t('host_id')}</th>
              <th className="common-table-head-th">{t('blockchain')}</th>
              <th className="common-table-head-th">{t('chequebook')}</th>
              <th className="common-table-head-th">{t('currency_type')}</th>
              <th className="common-table-head-th">{t('total_sent')}</th>
            </tr>
          </thead>
          <tbody>
            {cheques &&
              cheques.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">
                    <td className="common-table-body-td">
                      <div className="flex">
                        <a href={btfsScanLinkCheck() + '/#/node/' + item['PeerID']} target="_blank">
                          <Truncate>{item['PeerID']}</Truncate>
                        </a>
                        <ClipboardCopy value={item['PeerID']} />
                      </div>
                    </td>
                    <td className="common-table-body-td">BTTC</td>
                    <td className="common-table-body-td">
                      <div className="flex">
                        <a href={bttcScanLinkCheck() + '/address/' + item['Vault']} target="_blank">
                          <Truncate>{item['Vault']}</Truncate>
                        </a>
                        <ClipboardCopy value={item['Vault']} />
                      </div>
                    </td>
                    <td className="common-table-body-td">
                      <div className="flex items-center">
                        <img src={require(`assets/img/${item.icon}.svg`).default} width={20} height={20} alt="" className="mr-2" />
                        {item.unit}
                      </div>
                    </td>
                    <td className="common-table-body-td">
                      {switchBalanceUnit(item['Payout'], item?.price?.rate)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!cheques && (
          <div className="w-full flex justify-center p-12">
            <img
              alt="loading"
              src={require('../../assets/img/loading.svg').default}
              style={{ width: '50px', height: '50px' }}
            />
          </div>
        )}
        {cheques && total === 0 && (
          <div className="p-12 w-full flex justify-center theme-text-main">{t('no_data')}</div>
        )}
      </div>
      <div className="flex justify-between items-center theme-text-main">
        <div className="p-4">Total: {total}</div>
        <div>
          <Pagination
            className={'mt-4 ' + color}
            simple
            showTotal={true}
            current={current}
            total={total}
            hideOnSinglePage={true}
            onChange={pageChange}
          />
        </div>
      </div>
    </div>
  );
}

ChequeExpenseTable.defaultProps = {
  color: 'light',
};

ChequeExpenseTable.propTypes = {
  color: PropTypes.oneOf(['light', 'dark']),
};
