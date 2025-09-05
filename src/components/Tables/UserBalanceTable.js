import { useState, useEffect } from 'react';
import { Table, Tooltip } from 'antd';
import { t } from 'utils/text.js';
import Emitter from 'utils/eventBus';
import {  toThousands } from "utils/BTFSUtil.js";  //switchBalanceUnit,
import {  BTTCSCAN_ADDRESS } from "utils/constants";


import { Truncate } from 'utils/text.js';
import { getUserBlance } from 'services/proxyService';

import UserPayHistoryModal from 'components/Modals/UserPayHistoryModal';

function UserBalanceTable({ bttcAddr, vaultAddr, color }) {
    const [listLoading, setListLoading] = useState(true);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData();
        // fetchCashOutData();
    }, []);

    const fetchData = async () => {
        try {
            setListLoading(true);
            let res = await getUserBlance();
            console.log(res, '-----');
            //   if (res.code === 0) {
            //   }
            setDataList([]);
            setListLoading(false);
        } catch (error) {}
    };

    const handleView = item => {
        Emitter.emit('openUserPayHistoryModal', { item });
    };

    // const addressLink = hash => {
    //     if (!hash) return;
    //     let url = 'https://bttcscan.com/address/' + hash;
    //     window.open(url, '_blank');
    // };

    function initColumn() {
        return [
            {
                key: 'address',
                title: t('user_balance_table_address'),
                className: 'table_icon provider_icon',
                align: 'left',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.address}>
                            <a
                                href={`${BTTCSCAN_ADDRESS}${record.address}`}>
                                <Truncate after={15} className={' theme-link'}>
                                    {record.address}
                                </Truncate>
                            </a>
                        </Tooltip>
                    );
                },
            },
            {
                title: t('user_balance_table_balance'),
                key: 'balance',
                align: 'left',
                className: 'send_receive ',
                render: record => {
                    return (
                        <div className="flex items-center theme-text-main  font-gilroymedium fs-14">
                            <Truncate after={11}>{toThousands(record.balance)}</Truncate>
                        </div>
                    );
                },
            },
            {
                title: t('user_balance_table_deposit_history'),
                key: 'view',
                align: 'left',
                width: '220px',
                className: 'send_receive font-gilroymedium fs-14',
                render: record => {
                    return (
                        <div
                            className="cursor-pointer theme-text-base"
                            onClick={() => {
                                handleView(record.address);
                            }}>
                            {t('view')}
                        </div>
                    );
                },
            },
        ];
    }

    return (
        <>
            <div className="card-border pb-30-px">
                <Table
                    className={`nowrap transactions-table ${
                        color === 'light' ? 'table-page-content-light' : 'table-page-content-dark'
                    }`}
                    rowKey={record => `${record.cid}`}
                    columns={initColumn()}
                    dataSource={dataList}
                    loading={listLoading}
                    pagination={false}
                />
            </div>
            <UserPayHistoryModal color={color} />
        </>
    );
}

export default UserBalanceTable;
