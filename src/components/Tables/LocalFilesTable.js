/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Breadcrumb, Pagination, Tabs, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import FileTableDropdown from 'components/Dropdowns/FileTableDropdown.js';
import ImportFilesDropdown from 'components/Dropdowns/ImportFilesDropdown.js';
import ImportFilesEncryptDropdown from 'components/Dropdowns/ImportFilesEncryptDropdown.js';
import FileBlackListModal from 'components/Modals/FileBlackListModal.js';
import FileControl from 'components/Footers/FileControl.js';
import S3ApiTable from './S3ApiTable';
import AutoRenewFileTable from './AutoRenewFileTable';
import { getRootFiles, getHashByPath, getFolerSize, getFiles, searchFiles } from 'services/filesService.js';
import { switchStorageUnit2 } from 'utils/BTFSUtil.js';
import { t } from 'utils/text.js';
import moment from 'moment';

import Emitter from 'utils/eventBus';
import { Truncate } from 'utils/text';

let didCancel = false;
let filesAll = [];
let nameArray = [];

export default function LocalFilesTable({ color }) {
    const intl = useIntl();
    const inputRef = useRef(null);
    const batchList = useRef([]);
    const [itemSelected, setItemSelected] = useState(0);
    const [breadcrumbName, setBreadcrumbName] = useState([]);
    const [files, setFiles] = useState(null);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [batch, setBatch] = useState([]);
    const [activeKey, setActiveKey] = useState('1');
    const [activeFileKey, setActiveFileKey] = useState('1');
    const [showFileBlackListModal, setShowFileBlackListModal] = useState(false);

    const selectAll = e => {
        let fileControl = document.getElementById('fileControl');
        let checkbox = document.getElementsByName('checkbox');

        if (e.target.checked) {
            checkbox.forEach(item => {
                item.checked = 'checked';
            });
            fileControl.style.bottom = 0;
            setItemSelected(checkbox.length);

            files &&
                files.forEach(item => {
                    batchList.current.push({
                        hash: item['Hash'],
                        name: item['Name'],
                        type: item['Type'],
                        size: item['Size'],
                        path: breadcrumbName,
                    });
                });

            setBatch(batchList.current);
        } else {
            unSelect();
        }
    };
    const select = (e, hash, name, type, size, path) => {
        let checkboxHub = document.getElementsByName('checkboxHub');
        if (!e.target.checked) {
            checkboxHub[0].checked = '';
            batchList.current = batchList.current.filter(ele => {
                return hash !== ele.hash || name !== ele.name;
            });
        } else {
            batchList.current.push({
                hash: hash,
                name: name,
                type: type,
                path: path,
                size: size,
            });
        }
        setBatch(batchList.current);

        let fileControl = document.getElementById('fileControl');
        fileControl.style.bottom = 0;
        let count = 0;
        let checkbox = document.getElementsByName('checkbox');
        checkbox.forEach(item => {
            if (item.checked) {
                count++;
            }
        });
        setItemSelected(count);
        if (count === 0) {
            fileControl.style.bottom = '-5rem';
        }
    };

    const unSelect = useCallback(() => {
        batchList.current = [];
        setBatch([]);
        let checkbox = document.getElementsByName('checkbox');
        checkbox.forEach(item => {
            item.checked = '';
        });
        let checkboxHub = document.getElementsByName('checkboxHub');
        if (checkboxHub[0]) {
            checkboxHub[0].checked = '';
        }
        let fileControl = document.getElementById('fileControl');
        if (fileControl) {
            fileControl.style.bottom = '-5rem';
        }
    }, []);

    const sliceDate = page => {
        setFiles(filesAll.slice((page - 1) * 10, (page - 1) * 10 + 10));
    };

    const pageChange = useCallback(value => {
        setCurrent(value);
        sliceDate(value);
    }, []);

    const getFilesByHash = async hash => {
        setCurrent(1);
        unSelect();
        let { files } = await getFiles(hash);
        await getFolerSize(files);
        filesAll = files;
        setTotal(files.length);
        sliceDate(1);
    };

    const addPath = async (hash, name, type, size) => {
        if (type === 1) {
            let pathName = [...breadcrumbName, name];
            setBreadcrumbName(pathName);
            nameArray = pathName;
            setFiles(null);
            getFilesByHash(hash);
        }
        if (type === 2) {
            Emitter.emit('openPreviewModal', { hash: hash, name: name, size: size });
        }
        if (type === -1) {
            let pathName = ['root', name];
            setBreadcrumbName(pathName);
            nameArray = pathName;
            setFiles(null);
            getFilesByHash(hash);
        }
    };

    const minusPath = async name => {
        let index = breadcrumbName.indexOf(name) + 1;
        let breadName = breadcrumbName.slice(0, index);
        let pathName = [...breadName];
        setBreadcrumbName(pathName);
        nameArray = pathName;
        setFiles(null);
        let { hash } = await getHashByPath(nameArray);
        getFilesByHash(hash);
    };

    const updateFiles = async () => {
        didCancel = false;
        let { files } = await getRootFiles();
        await getFolerSize(files);
        if (!didCancel) {
            unSelect();
            nameArray.shift();
            nameArray.unshift('root');
            setBreadcrumbName(nameArray);

            if (nameArray.length > 1) {
                let { hash } = await getHashByPath(nameArray);
                getFilesByHash(hash);
            } else {
                filesAll = files;
                sliceDate(1);
                setCurrent(1);
                setTotal(files.length);
            }
        }
    };

    const checkIsEncrypted = name => {
        const arr = name.split('.');
        const str = arr.slice(-1)[0] || '';
        if (str === 'bte') {
            return true;
        }
        return false;
    };

    const search = async () => {
        let hash = inputRef.current.value;
        let { Type, Message } = await searchFiles(hash);

        if (Type === 'error') {
            Emitter.emit('showMessageAlert', { message: Message, status: 'error' });
            return;
        }

        addPath(hash, hash, -1);
    };

    const changeActiveKey = activeKey => {
        setActiveKey(activeKey);
    };

    const changeActiveFileKey = activeKey => {
        setActiveFileKey(activeKey);
    };

    const showFileBlackListModalFn = () => {
        setShowFileBlackListModal(true);
    };

    const operations = () => {
        // if (activeKey === '2') {
        return (
            <button className="common-btn theme-white-btn" onClick={showFileBlackListModalFn}>
                {t('file_black_list')}
            </button>
        );
        // }
        // return null
    };

    useEffect(() => {
        const set = async function () {
            setTimeout(() => {
                updateFiles();
            }, 1000);
        };
        Emitter.on('updateFiles', set);
        return () => {
            Emitter.removeListener('updateFiles');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        updateFiles();
        return () => {
            didCancel = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                activeKey={activeKey}
                onChange={changeActiveKey}
                className="mb-4 common-card theme-bg theme-text-main file-tab-content"
                tabBarExtraContent={operations()}>
                <Tabs.TabPane tab={t('s3_api')} key="1" className="w-full">
                    <S3ApiTable color={color} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={t('native_api')} key="2">
                    <Tabs
                        defaultActiveKey="1"
                        activeKey={activeFileKey}
                        onChange={changeActiveFileKey}
                        className="mb-4 common-card theme-bg theme-text-main radio-style-tabs p-0">
                        <Tabs.TabPane tab={t('added_files')} key="1">
                            <div className="mb-4 flex rounded-2xl">
                                <input
                                    type="text"
                                    placeholder={intl.formatMessage({ id: 'search_here' }) + '...'}
                                    className={'common-input h-12 rounded-l-2xl theme-border-color theme-bg'}
                                    ref={inputRef}
                                />
                                <button
                                    className="ml-2 common-btn w-120-px h-12 rounded-r-2xl theme-white-btn"
                                    type="button"
                                    onClick={search}>
                                    {t('search_go')}
                                </button>
                            </div>
                            {/* <div className={'relative flex flex-col common-card theme-bg theme-text-main'}> */}
                            <div className={'relative flex flex-col'}>
                                <div className="mb-4 flex flex-wrap items-center">
                                    <div className="relative mr-4 flex-1 overflow-overlay">
                                        <div className=" flex whitespace-nowrap">
                                            <Breadcrumb>
                                                {breadcrumbName.length > 0 &&
                                                    breadcrumbName.map((item, index) => {
                                                        return (
                                                            <Breadcrumb.Item key={index}>
                                                                <a
                                                                    className="font-semibold"
                                                                    onClick={() => {
                                                                        minusPath(breadcrumbName[index]);
                                                                    }}>
                                                                    {item}
                                                                </a>
                                                            </Breadcrumb.Item>
                                                        );
                                                    })}
                                            </Breadcrumb>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <ImportFilesEncryptDropdown color={color} path={breadcrumbName} />
                                        <ImportFilesDropdown color={color} path={breadcrumbName} />
                                    </div>
                                </div>
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full bg-transparent border-collapse">
                                        <thead className="theme-table-head-bg">
                                            <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
                                                <th
                                                    className="common-table-head-th"
                                                    style={{ width: '50px' }}>
                                                    <input
                                                        type="checkbox"
                                                        name="checkboxHub"
                                                        className="bg-blue form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                                        onClick={selectAll}
                                                    />
                                                </th>
                                                <th
                                                    className="common-table-head-th"
                                                    style={{ minWidth: '100px' }}>
                                                    {t('file_name')}
                                                </th>
                                                <th className="common-table-head-th">{t('size')}</th>
                                                <th
                                                    className="common-table-head-th"
                                                    style={{ minWidth: '150px' }}>
                                                    {t('file_cid')}
                                                </th>
                                                <th className="common-table-head-th">{t('file_create')}</th>
                                                <th className="common-table-head-th">
                                                    {t('file_isencrypted')}
                                                </th>
                                                <th className="common-table-head-th"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {files &&
                                                files.map((item, index) => {
                                                    return (
                                                        <tr
                                                            key={index}
                                                            className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">
                                                            <td className="common-table-body-td">
                                                                <input
                                                                    type="checkbox"
                                                                    name="checkbox"
                                                                    className="bg-blue form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                                                    onClick={e => {
                                                                        select(
                                                                            e,
                                                                            item['Hash'],
                                                                            item['Name'],
                                                                            item['Type'],
                                                                            item['Size'],
                                                                            breadcrumbName
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td
                                                                className="common-table-body-td"
                                                                style={{
                                                                    minWidth: '220px',
                                                                    maxWidth: '300px',
                                                                }}>
                                                                <div className="flex">
                                                                    <a
                                                                        className="flex items-center"
                                                                        onClick={() => {
                                                                            addPath(
                                                                                item['Hash'],
                                                                                item['Name'],
                                                                                item['Type'],
                                                                                item['Size']
                                                                            );
                                                                        }}>
                                                                        {item['Type'] === 1 && (
                                                                            <img
                                                                                src={
                                                                                    require('assets/img/folder.png')
                                                                                        .default
                                                                                }
                                                                                className="h-10 w-10 bg-white rounded-full border"
                                                                                alt="..."
                                                                            />
                                                                        )}
                                                                        {item['Type'] === 2 && (
                                                                            <img
                                                                                src={
                                                                                    require('assets/img/file.png')
                                                                                        .default
                                                                                }
                                                                                className="h-10 w-10 bg-white rounded-full border"
                                                                                alt="..."
                                                                            />
                                                                        )}
                                                                        <div className="flex w-full flex-col justify-center">
                                                                            {item['Name'].length > 14 ? (
                                                                                <Tooltip
                                                                                    className="cursor-pointer flex "
                                                                                    placement="top"
                                                                                    title={item['Name']}>
                                                                                    <span className="ml-3 font-bold">
                                                                                        <Truncate start={5}>
                                                                                            {item['Name']}
                                                                                        </Truncate>
                                                                                    </span>
                                                                                </Tooltip>
                                                                            ) : (
                                                                                <span className="ml-3 font-bold">
                                                                                    {item['Name']}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                            <td className="common-table-body-td">
                                                                {switchStorageUnit2(item['Size'])}
                                                            </td>
                                                            <td className="common-table-body-td">
                                                                {item['Hash'] || '--'}
                                                            </td>
                                                            <td className="common-table-body-td">
                                                                {item.Created
                                                                    ? moment(item.Created).format(
                                                                          'YYYY-MM-DD HH:mm:ss'
                                                                      )
                                                                    : '--'}
                                                            </td>
                                                            <td className="common-table-body-td text-center">
                                                                {checkIsEncrypted(item['Name']) ? (
                                                                    <span>
                                                                        <img
                                                                            alt=""
                                                                            src={
                                                                                require(`../../assets/img/encrypt-icon_${color}.svg`)
                                                                                    .default
                                                                            }
                                                                            className="far"
                                                                        />
                                                                    </span>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </td>

                                                            <td className="common-table-body-td">
                                                                <FileTableDropdown
                                                                    color={color}
                                                                    hash={item['Hash']}
                                                                    name={item['Name']}
                                                                    size={item['Size']}
                                                                    path={breadcrumbName}
                                                                    type={item['Type']}
                                                                    cid={item.cid}
                                                                    isEncrypetd={checkIsEncrypted(
                                                                        item['Name']
                                                                    )}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                    {!files && (
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
                                <FileControl
                                    itemSelected={itemSelected}
                                    unSelect={unSelect}
                                    color={color}
                                    data={batch}
                                />
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={t('auto_renew_files')} key="2" className="w-full">
                            <AutoRenewFileTable color={color} activeFileKey={activeFileKey} />
                        </Tabs.TabPane>
                    </Tabs>
                </Tabs.TabPane>
            </Tabs>
            <FileBlackListModal
                color={color}
                showModal={showFileBlackListModal}
                closeModal={() => setShowFileBlackListModal(false)}
            />
        </>
    );
}

LocalFilesTable.defaultProps = {
    color: 'light',
};

LocalFilesTable.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};
