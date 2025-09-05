/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState,  useCallback } from 'react';
import { Pagination,Select,  Tooltip } from 'antd';
import PropTypes from 'prop-types';
import AutoRenewTableDropdown from 'components/Dropdowns/AutoRenewTableDropdown.js';
import DisableAutoRenewModal from 'components/Modals/DisableAutoRenewModal';
import EnableAutoRenewModal from 'components/Modals/EnableAutoRenewModal';
import AutoRenewInfoModal from 'components/Modals/AutoRenewInfoModal';
// import { useHistory } from 'react-router-dom';
import { switchStorageUnit2 } from 'utils/BTFSUtil.js';
import {  BTFSSCAN_PROVIDER,FINDER_FILE_MAIN } from "utils/constants";
import moment from 'moment';
import { t } from 'utils/text.js';
import Emitter from 'utils/eventBus';
import { getRenewList } from 'services/filesService.js';
import { Truncate } from 'utils/text.js';

const { Option } = Select;

export default function AutoRenewFileTable({ color }) {
    // const history = useHistory();
    const [loading, setLoading] = useState(false);
    // const [itemSelected, setItemSelected] = useState(0);
    const [files, setFiles] = useState(null);
    const [initFiles, setInitFiles] = useState(null);
    const [total, setTotal] = useState(0);
    // const batchList = useRef([]);
    const [current, setCurrent] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            let data = await getRenewList();
            setLoading(false);
            if (data) {
                let list = data?.renewals || []
                let total = data?.total  || 0
                setTotal(total)
                setFiles(list);
                setInitFiles(list);
            } else {
                // setBucketList(() => []);
            }
        } catch (error) {}
    };
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const pageChange = useCallback(value => {
        setCurrent(value);
        sliceDate(value);
    }, []);

    const sliceDate = page => {
        // setFiles(filesAll.slice((page - 1) * 10, (page - 1) * 10 + 10));
    };

    const handleView = item => {
        Emitter.emit('openAutoRenewInfoModal', item);
    };

    const fileLink = hash => {
        if (!hash) return;
        let url = FINDER_FILE_MAIN + hash;
        window.open(url, '_blank');
    };
    const spLink = hash => {
        if (!hash) return;
        let url = BTFSSCAN_PROVIDER + hash;
        window.open(url, '_blank');
    };

    const handleChange = value => {
        if (value === 'all') {
            setFiles(initFiles);
            return;
        }
        const arr = initFiles.filter(v => !!value === v.auto_renewal);
        setFiles(arr);
    };

    return (
        <>
            <div className="relative w-full flex flex-col">
                <div className="w-full overflow-x-auto">
                    <table className="w-full bg-transparent border-collapse">
                        <thead className="theme-table-head-bg">
                            <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
                                {
                                    // <th className="common-table-head-th" style={{ width: '50px' }}>
                                    //     <input
                                    //         type="checkbox"
                                    //         name="checkboxHub"
                                    //         className="bg-blue form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                    //         onClick={selectAll}
                                    //     />
                                    // </th>
                                }
                                <th className="common-table-head-th" style={{ minWidth: '150px' }}>
                                    {t('auto_renew_file_cid')}
                                </th>
                                <th className="common-table-head-th">{t('auto_renew_file_filesize')}</th>
                                <th className="common-table-head-th" style={{ minWidth: '150px' }}>
                                    {t('auto_renew_file_uploaded_time')}
                                </th>
                                <th className="common-table-head-th" style={{ minWidth: '150px' }}>
                                    {t('auto_renew_file_sp')}
                                </th>
                                <th className="common-table-head-th">
                                    <Select
                                        defaultValue="all"
                                        style={{ width: 140 }}
                                        bordered={false}
                                        className="common-table-head-select"
                                        onChange={handleChange}
                                        popupClassName={` ${
                                            color === 'light' ? '' : 'common-select-option-dark'
                                        }`}
                                        // open={true}
                                        // options={statusOptions}
                                    >
                                        <Option value="all">{t('all')}</Option>
                                        <Option value={1}>{t('auto_renew_on')}</Option>
                                        <Option value={0}>{t('auto_renew_off')}</Option>
                                    </Select>
                                </th>
                                <th className="common-table-head-th">{t('auto_renew_file_more_info')}</th>
                                <th className="common-table-head-th">{t('auto_renew_operation')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files &&
                                files.map((item, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">
                                            {
                                                // <td className="common-table-body-td">
                                                //     <input
                                                //         type="checkbox"
                                                //         name="checkbox"
                                                //         className="bg-blue form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                                //         onClick={e => {}}
                                                //     />
                                                // </td>
                                            }
                                            <td
                                                className="common-table-body-td"
                                                style={{
                                                    minWidth: '160px',
                                                    maxWidth: '300px',
                                                }}>
                                                <div className="flex">
                                                    <a
                                                        className="flex"
                                                        onClick={() => {
                                                            fileLink(item['file_hash']);
                                                        }}>
                                                        <div className="flex w-full flex-col justify-center ">
                                                            {item['file_hash'].length > 14 ? (
                                                                <Tooltip
                                                                    className="cursor-pointer flex "
                                                                    placement="top"
                                                                    title={item['file_hash']}>
                                                                    <span className="">
                                                                        <Truncate
                                                                            start={5}
                                                                            className="theme-link ">
                                                                            {item['file_hash']}
                                                                        </Truncate>
                                                                    </span>
                                                                </Tooltip>
                                                            ) : (
                                                                <span className="ml-3 font-bold">
                                                                    {item['file_hash']}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="common-table-body-td">
                                                {switchStorageUnit2(item['file_size'])}
                                            </td>
                                            <td className="common-table-body-td">
                                                {item.created_at
                                                    ? moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                                                    : '--'}
                                            </td>
                                            <td className="common-table-body-td">
                                                <span
                                                    className="cursor-pointer theme-text-base"
                                                    onClick={() => {
                                                        spLink(item['sp'][0]);
                                                    }}>
                                                    <Truncate start={5} className="theme-link ">
                                                        {item['sp'][0]}
                                                    </Truncate>
                                                </span>
                                            </td>
                                            <td className="common-table-body-td">
                                                {item?.auto_renewal ? t('On') : t('Off')}
                                            </td>
                                            <td className="common-table-body-td">
                                                <span
                                                    className="cursor-pointer theme-text-base"
                                                    onClick={() => {
                                                        handleView(item);
                                                    }}>
                                                    {t('view')}
                                                </span>
                                            </td>

                                            <td className="common-table-body-td">
                                                <AutoRenewTableDropdown
                                                    color={color}
                                                    size={item['file_size']}
                                                    cid={item.file_hash}
                                                    autorenewOn={item.auto_renewal}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="w-full flex justify-center pt-4">
                            <img
                                alt="loading"
                                src={require('../../assets/img/loading.svg').default}
                                style={{ width: '50px', height: '50px' }}
                            />
                        </div>
                    )}
                    {files && total === 0 && (
                        <div className="w-full flex justify-center p-4">{t('no_data')}</div>
                    )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                <div>Total: {total}</div>
                <Pagination
                    className={color}
                    simple
                    current={current}
                    total={total}
                    hideOnSinglePage={true}
                    onChange={pageChange}
                />
            </div>
            </div>

            <EnableAutoRenewModal color={color} fetchData={fetchData}/>
            <DisableAutoRenewModal color={color} fetchData={fetchData}/>
            <AutoRenewInfoModal color={color}   />
        </>
    );
}

AutoRenewFileTable.defaultProps = {
    color: 'light',
};

AutoRenewFileTable.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};
