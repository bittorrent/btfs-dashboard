import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { getChequeReceivedDetailList, getChequeSentDetailList } from 'services/chequeService.js';
import { Truncate, t } from 'utils/text.js';
import { switchBalanceUnit } from 'utils/BTFSUtil.js';
import { btfsScanLinkCheck, bttcScanLinkCheck } from 'utils/checks.js';

let didCancel = false;

export default function ChequeDetailTable({ color, type }) {
  const [cheques, setCheques] = useState(null);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  const pageChange = useCallback(page => {
    updateTable(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTable = async page => {
    didCancel = false;
    let data;
    if (type === 'earning') {
      data = await getChequeReceivedDetailList((page - 1) * 10, 10);
    }
    if (type === 'expense') {
      data = await getChequeSentDetailList((page - 1) * 10, 10);
    }

    let { cheques, total } = data;

    if (!didCancel) {
      setCheques(cheques);
      setTotal(total);
      setCurrent(page);
    }
  };

  useEffect(() => {
    updateTable(1);
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
              <th className="common-table-head-th">
                {type === 'earning' && t('chequebook')}
                {type === 'expense' && t('recipient')}
              </th>
              <th className="common-table-head-th">{t('currency_type')}</th>
              <th className="common-table-head-th">
                <div className="flex items-center">
                  <div>{t('amount')}</div>
                </div>
              </th>
              <th className="common-table-head-th">
                {type === 'earning' && t('receive')}
                {type === 'expense' && t('send')}
                &nbsp;{t('time')}
              </th>
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
                        <a
                          href={btfsScanLinkCheck() + '/#/node/' + item['PeerId']}
                          target="_blank"
                          rel="noreferrer">
                          <Truncate>{item['PeerId']}</Truncate>
                        </a>
                        <ClipboardCopy value={item['PeerId']} />
                      </div>
                    </td>
                    <td className="common-table-body-td">BTTC</td>
                    <td className="common-table-body-td">
                      {type === 'earning' && (
                        <div className="flex">
                          <a
                            href={bttcScanLinkCheck() + '/address/' + item['Vault']}
                            target="_blank"
                            rel="noreferrer">
                            <Truncate>{item['Vault']}</Truncate>
                          </a>
                          <ClipboardCopy value={item['Vault']} />
                        </div>
                      )}
                      {type === 'expense' && (
                        <div className="flex">
                          <a
                            href={bttcScanLinkCheck() + '/address/' + item['Beneficiary']}
                            target="_blank"
                            rel="noreferrer">
                            <Truncate>{item['Beneficiary']}</Truncate>
                          </a>
                          <ClipboardCopy value={item['Beneficiary']} />
                        </div>
                      )}
                    </td>
                    <td className="common-table-body-td">
                      <div className="flex items-center">
                        <img src={require(`assets/img/${item.icon}.svg`).default} width={20} height={20} alt="" className="mr-2" />
                        {item.unit}
                      </div>
                    </td>
                    <td className="common-table-body-td">
                      {switchBalanceUnit(item['Amount'], item?.price?.rate)}
                    </td>
                    <td className="common-table-body-td">{new Date(item['Time'] * 1000).toLocaleString()}</td>
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

ChequeDetailTable.defaultProps = {
  color: 'light',
};

ChequeDetailTable.propTypes = {
  color: PropTypes.oneOf(['light', 'dark']),
};
