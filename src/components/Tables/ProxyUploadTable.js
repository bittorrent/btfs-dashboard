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
import { switchStorageUnit2, switchBalanceUnit2, toThousands } from 'utils/BTFSUtil.js'; //
import { BTTCSCAN_ADDRESS, FINDER_FILE_MAIN } from 'utils/constants';
import { sortList } from 'utils/BTFSUtil';
import moment from 'moment';


function ProxyUploadTable({ bttcAddr, vaultAddr, color, activeKey }) {
    const [listLoading, setListLoading] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (activeKey === '1') {
            fetchData();
        }
        // fetchCashOutData();
    }, [activeKey]);

    const fetchData = async () => {
        try {
            setListLoading(true);
            let res = await getProxyUploadList();
            if (res?.Type === 'error') {
                setListLoading(false);
                return;
            }
            if (res && res.length) {
                const list = sortList(res, 'created_at');
                setDataList(list);
                setTotal(res.length);
            }
            setListLoading(false);
        } catch (error) {}
    };

    const handleView = item => {
        Emitter.emit('openProxyUploadModal', item);
    };

    function initColumn() {
        return [
            {
                key: 'address',
                title: t('proxy_upload_table_address'),
                className: 'table_icon provider_icon',
                align: 'left',
                width: '200px',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.from}>
                            <a
                                className="flex"
                                href={`${BTTCSCAN_ADDRESS}${record.from}`}
                                target="_blank"
                                rel="noreferrer">
                                <Truncate after={11} className={' theme-link'}>
                                    {record.from}
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
                width: '220px',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.cid}>
                            <a
                                className="flex"
                                href={`${FINDER_FILE_MAIN}${record.cid}`}
                                target="_blank"
                                rel="noreferrer">
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
                className: 'theme-text-main  fs-14  whitespace-nowrap',
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
                    return <div>{switchBalanceUnit2(record.total_pay) + ' BTT'}</div>;
                },
            },
            {
                title: t('proxy_upload_table_unitprice'),
                key: 'unitprice',
                align: 'left',
                className: 'send_receive font-gilroymedium  theme-text-main   whitespace-nowrap fs-14 sp-list-latency',
                render: record => {
                    return <div>{toThousands(record.price) + ' BTT'}</div>;
                },
            },
            {
                title: t('proxy_upload_table_created_time'),
                key: 'paytime',
                align: 'left',
                className: 'send_receive font-gilroymedium fs-14',
                render: record => {
                    return (
                        <div className="flex items-center  font-gilroymedium fs-14">
                            {moment.unix(record.created_at).utcOffset(480).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                    );
                },
            },
            {
                title: t('proxy_upload_table_view'),
                key: 'view',
                align: 'left',
                className: 'send_receive font-gilroymedium fs-14',
                width:'80px',
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
                    // pagination={false}
                    scroll={{ y: 270, x: 'max-content' }}
                    pagination={{
                        pageSize: 10,
                        total: total,
                        showTotal: total => `Total:${total}`,
                        simple: true,
                        className: 'flex table-pagination-total',
                    }}
                />
            </div>
            <ProxyUploadModal color={color} />
        </>
    );
}

export default ProxyUploadTable;
