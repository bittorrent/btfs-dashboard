/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { getChequeCashingList } from 'services/chequeService.js';
import { Truncate, t } from 'utils/text.js';
import Emitter from 'utils/eventBus';
import { switchBalanceUnit } from 'utils/BTFSUtil.js';
import { btfsScanLinkCheck, bttcScanLinkCheck } from 'utils/checks.js';

let didCancel = false;

export default function ChequeCashingListTable({ color, enableCash }) {
    const [cheques, setCheques] = useState(null);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);

    const select = (e, id, amount, selectItemData) => {
        enableCash(e.target.checked, id, amount, false, selectItemData);
    };

    const unSelect = () => {
        enableCash(false, null, null, true);
        let checkbox = document.getElementsByName('checkbox');
        checkbox.forEach(item => {
            item.checked = '';
        });
    };

    const pageChange = useCallback(page => {
        updateTable(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateTable = async page => {
        didCancel = false;
        let { cheques, total } = await getChequeCashingList((page - 1) * 10, 10);
        if (!didCancel) {
            setCheques(cheques);
            setTotal(total);
            setCurrent(page);
            unSelect();
        }
    };

    useEffect(() => {
        const set = async function () {
            setTimeout(() => {
                updateTable(1);
            }, 1000);
        };
        Emitter.on('updateCashingList', set);
        return () => {
            Emitter.removeListener('updateCashingList');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                            <th className="common-table-head-th" style={{ width: '50px' }}></th>
                            <th className="common-table-head-th">{t('host_id')}</th>
                            <th className="common-table-head-th">{t('blockchain')}</th>
                            <th className="common-table-head-th">{t('chequebook')}</th>
                            <th className="common-table-head-th">{t('currency_type')}</th>
                            <th className="common-table-head-th">
                                <div className="flex items-center">
                                    <div>{t('uncashed')}</div>
                                </div>
                            </th>
                            <th className="common-table-head-th">
                                <div className="flex items-center">
                                    <div>{t('cashed')}</div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cheques && cheques.map((item, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">
                                        <td className="common-table-body-td">
                                            <input
                                                type="checkbox"
                                                name="checkbox"
                                                className="bg-blue form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150 "
                                                onClick={e => {
                                                    select(e, item['PeerID'], item['Payout'] - item['CashedAmount'], item);
                                                }}
                                            />
                                        </td>
                                        <td className="common-table-body-td">
                                            <div className="flex">
                                                <a href={btfsScanLinkCheck() + '/#/node/' + item['PeerID']} target="_blank">
                                                    <Truncate>{item['PeerID']}</Truncate>
                                                </a>
                                                <ClipboardCopy value={item['PeerID']} />
                                            </div>
                                        </td>
                                        <td className="common-table-body-td">
                                            <div className='flex items-center'>
                                                <img src={require(`assets/img/bttc.svg`).default} alt="" className="mr-2" />
                                                <span>BTTC</span>
                                            </div>
                                        </td>
                                        <td className="common-table-body-td">
                                            <div className="flex">
                                                <a href={bttcScanLinkCheck() + '/address/' + item['Vault']} target="_blank">
                                                    <Truncate>{item['Vault']}</Truncate>
                                                </a>
                                                <ClipboardCopy value={item['Vault']} />
                                            </div>
                                        </td>
                                        <td className="common-table-body-td">
                                            <div className='flex items-center'>
                                                <img src={require(`assets/img/${item.icon}.svg`).default} width={20} height={20} alt="" className="mr-2" />
                                                {item.unit}
                                            </div>
                                        </td>
                                        <td className="common-table-body-td">
                                            {switchBalanceUnit(item['Payout'] - item['CashedAmount'], item?.price?.rate)}
                                        </td>
                                        <td className="common-table-body-td">
                                            {switchBalanceUnit(item['CashedAmount'], item?.price?.rate)}
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

ChequeCashingListTable.defaultProps = {
    color: 'light',
};

ChequeCashingListTable.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};
