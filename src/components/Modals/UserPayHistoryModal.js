import React, { useEffect, useRef, useState } from 'react';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import { Table, Spin, Tooltip } from 'antd';
import CommonModal from './CommonModal';
import { Truncate } from 'utils/text.js';
import { getUserPayHistory } from 'services/proxyService';
import { BTTCSCAN_ADDRESS } from 'utils/constants';
import {
    // switchStorageUnit2,
    switchBalanceUnit,
    // toThousands,
    // getTimes,
    // formatNumber,
} from 'utils/BTFSUtil.js';

export default function UserPayHistoryModal({ color }) {
    const [showModal, setShowModal] = useState(false);
    // const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataList, setDataList] = useState([]);
    const CheckDetailData = useRef({ title: '', dataList: [] });

    useEffect(() => {
        const set = function (params) {
            console.log('openUserPayHistoryModal event has occured', params);
            CheckDetailData.current = params;
            openModal();
        };
        Emitter.on('openUserPayHistoryModal', set);
        return () => {
            Emitter.removeListener('openUserPayHistoryModal');
            window.body.style.overflow = '';
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     // getInfo();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [CheckDetailData.current]);

    const openModal = () => {
        getInfo();
        setShowModal(true);

        window.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        window.body.style.overflow = '';
    };

    const getInfo = async () => {
        if(!CheckDetailData.current) return
        try {
            setLoading(true);
            let res = await getUserPayHistory(CheckDetailData.current);
            // let res2 = [
            //     {
            //         hash: 'QmVSr8H3cLh5ZfN7wemQY35jro87K64mTnLC7Nq2ALUofA',
            //         from: 'QmVSr8H3cLh5ZfN7wemQY35jro87K64mTnLC7Nq2ALUofA',
            //         to: 'QmVSr8H3cLh5ZfN7wemQY35jro87K64mTnLC7Nq2ALUofA',
            //         value: 'string',
            //         pay_time: 0,
            //     },
            // ];
            if (res.Type !== 'error') {
                setDataList([]);
            }

            setLoading(false);
        } catch (error) {}
    };


    function initColumn() {
        return [
            {
                key: 'from',
                title: t('user_balance_table_from'),
                className: 'table_icon provider_icon',
                align: 'left',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.from}>
                            <a href={`${BTTCSCAN_ADDRESS}${record.from}`}>
                                <Truncate after={11} className={' theme-link'}>
                                    {record.from}
                                </Truncate>
                            </a>
                        </Tooltip>
                    );
                },
            },
            {
                title: t('user_balance_table_to'),
                key: 'to',
                align: 'left',
                className: 'send_receive ',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.to}>
                            <a href={`${BTTCSCAN_ADDRESS}${record.to}`}>
                                <Truncate after={11} className={' theme-link'}>
                                    {record.to}
                                </Truncate>
                            </a>
                        </Tooltip>
                    );
                },
            },
            {
                title: t('user_balance_table_value'),
                key: 'value',
                align: 'left',
                className: 'send_receive font-gilroymedium fs-14',
                render: record => {
                    return (
                        <div className="flex items-center  font-gilroymedium fs-14">
                            <Truncate after={11}>{switchBalanceUnit(record.value, 1)}</Truncate>
                        </div>
                    );
                },
            },
            {
                title: t('user_balance_table_hash'),
                key: 'hash',
                align: 'left',
                width: '220px',
                className: 'send_receive font-gilroymedium fs-14',
                render: record => {
                    return (
                        <Tooltip className="cursor-pointer flex " placement="top" title={record.hash}>
                            <a href={`${BTTCSCAN_ADDRESS}${record.hash}`}>
                                <Truncate after={11} className={' theme-link'}>
                                    {record.hash}
                                </Truncate>
                            </a>
                        </Tooltip>
                    );
                },
            },
        ];
    }

    return (
        <CommonModal visible={showModal} onCancel={closeModal} width={800}>
            <div className={'common-modal-wrapper theme-bg'}>
                <header className="common-modal-header theme-text-main mb-2">{t('user_pay_history')}</header>
                <main className="mb-4 text-xs font-medium mb-4 theme-text-sub-info">
                    {t('user_pay_history_desc')}
                </main>
                <Spin spinning={loading}>
                    <div className="card-border pb-30-px">
                        <Table
                            className={`nowrap transactions-table ${
                                color === 'light' ? 'table-page-content-light' : 'table-page-content-dark'
                            }`}
                            rowKey={record => `${record.cid}`}
                            columns={initColumn()}
                            dataSource={dataList}
                            loading={loading}
                            pagination={false}
                        />
                    </div>
                </Spin>
            </div>
        </CommonModal>
    );
}
