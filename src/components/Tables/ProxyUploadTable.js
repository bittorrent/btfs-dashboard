import { useState, useEffect } from 'react';
import { Table, Tooltip } from 'antd';
// import { Link } from 'react-router-dom';
import { t } from 'utils/text.js';
// import { AmountTruncate, AddressJumpTruncate, Truncate } from 'components/text/index';
// import './index.less';

import ProxyUploadModal from 'components/Modals/ProxyUploadModal';
import { Truncate } from 'utils/text.js';
import { getProxyUploadList } from 'services/proxyService';
import Emitter from 'utils/eventBus';
import { switchStorageUnit2 } from 'utils/BTFSUtil.js';
import {  BTTCSCAN_ADDRESS,FINDER_FILE_MAIN } from "utils/constants";

function ProxyUploadTable({ bttcAddr, vaultAddr, color }) {
    const [listLoading, setListLoading] = useState(true);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData();
        // fetchCashOutData();
    }, []);

    const fetchData = async () => {
        try {
            setListLoading(true);
            setDataList([]);
            let res = await getProxyUploadList();
            console.log(res, 'getProxyUploadList');
            // if (res.code === 0) {
            // }
            setListLoading(false);
        } catch (error) {}
    };

    const handleView = item => {
        Emitter.emit('openProxyUploadModal', { item });
    };

    function initColumn() {
        return [
            {
                key: 'address',
                title: t('proxy_upload_table_address'),
                className: 'table_icon provider_icon',
                align: 'left',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.address}>
                            <a
                                className="flex"
                                href={`${BTTCSCAN_ADDRESS}${record.address}`}>
                                <Truncate after={11} className={' theme-link'}>
                                    {record.address}
                                </Truncate>
                            </a>
                        </Tooltip>
                    );
                },
            },
            {
                title: t('proxy_upload_table_cid'),
                key: 'cid',
                align: 'left',
                className: 'send_receive ',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.cid}>
                            <a
                                className="flex"
                                href={`${FINDER_FILE_MAIN}${record.cid}`}>
                                <Truncate after={11} className={' theme-link'}>
                                    {record.cid}
                                </Truncate>
                            </a>
                        </Tooltip>
                    );
                },
            },
            {
                title: t('proxy_upload_table_filesize'),
                key: 'file_size',
                align: 'left',
                className: 'theme-text-main  fs-14',
                render: record => {
                    return <span>{switchStorageUnit2(record.file_size)}</span>;
                },
            },
            {
                title: t('proxy_upload_table_fees'),
                key: 'fees',
                align: 'left',
                className: 'send_receive font-gilroymedium theme-text-main  fs-14',
                render: record => {
                    return <div>{record.total_pay + ' BTT'}</div>;
                },
            },
            {
                title: t('proxy_upload_table_unitprice'),
                key: 'unitprice',
                align: 'left',
                className: 'send_receive font-gilroymedium  theme-text-main  fs-14 sp-list-latency',
                render: record => {
                    return <div>{record.price + ' BTT'}</div>;
                },
            },
            {
                title: t('proxy_upload_table_view'),
                key: 'view',
                align: 'left',
                className: 'send_receive font-gilroymedium fs-14',
                render: record => {
                    return (
                        <div
                            className="cursor-pointer theme-text-base"
                            onClick={() => {
                                handleView(record);
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
            <ProxyUploadModal color={color} />
        </>
    );
}

export default ProxyUploadTable;
