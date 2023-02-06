/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Breadcrumb, Pagination } from 'antd';
import PropTypes from 'prop-types';
import FileTableDropdown from 'components/Dropdowns/FileTableDropdown.js';
import ImportFilesDropdown from 'components/Dropdowns/ImportFilesDropdown.js';
import FileControl from 'components/Footers/FileControl.js';
import { getRootFiles, getHashByPath, getFolerSize, getFiles, searchFiles } from 'services/filesService.js';
import { switchStorageUnit2 } from 'utils/BTFSUtil.js';
import { t } from 'utils/text.js';
import Emitter from 'utils/eventBus';

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

    const search = async () => {
        let hash = inputRef.current.value;
        let { Type, Message } = await searchFiles(hash);

        if (Type === 'error') {
            Emitter.emit('showMessageAlert', { message: Message, status: 'error' });
            return;
        }

        addPath(hash, hash, -1);
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
                    {t('browse')}
                </button>
            </div>
            <div className={'relative flex flex-col common-card theme-bg theme-text-main'}>
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
                        <ImportFilesDropdown color={color} path={breadcrumbName} />
                    </div>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full bg-transparent border-collapse">
                        <thead className="theme-table-head-bg">
                            <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
                                <th className="common-table-head-th" style={{ width: '50px' }}>
                                    <input
                                        type="checkbox"
                                        name="checkboxHub"
                                        className="bg-blue form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                        onClick={selectAll}
                                    />
                                </th>
                                <th className="common-table-head-th" style={{ width: '70%' }}>
                                    {t('file_name')}
                                </th>
                                <th className="common-table-head-th">{t('size')}</th>
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
                                                        select(e, item['Hash'], item['Name'], item['Type'], item['Size'], breadcrumbName);
                                                    }}
                                                />
                                            </td>
                                            <td className="common-table-body-td" style={{ minWidth: '350px' }}>
                                                <div className="flex">
                                                    <a
                                                        className="flex items-center"
                                                        onClick={() => {
                                                            addPath(item['Hash'], item['Name'], item['Type'], item['Size']);
                                                        }}>
                                                        {item['Type'] === 1 && (
                                                            <img
                                                                src={require('assets/img/folder.png').default}
                                                                className="h-12 w-12 bg-white rounded-full border"
                                                                alt="..."
                                                            />
                                                        )}
                                                        {item['Type'] === 2 && (
                                                            <img
                                                                src={require('assets/img/file.png').default}
                                                                className="h-12 w-12 bg-white rounded-full border"
                                                                alt="..."
                                                            />
                                                        )}
                                                        <div className="flex flex-col justify-center">
                                                            <span className="ml-3 font-bold">{item['Name']}</span>
                                                            <span className="ml-3 font-bold">{item['Hash']}</span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="common-table-body-td">{switchStorageUnit2(item['Size'])}</td>
                                            <td className="common-table-body-td">
                                                <FileTableDropdown
                                                    color={color}
                                                    hash={item['Hash']}
                                                    name={item['Name']}
                                                    size={item['Size']}
                                                    path={breadcrumbName}
                                                    type={item['Type']}
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
                    {files && total === 0 && <div className="w-full flex justify-center p-4">{t('no_data')}</div>}
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
                <FileControl itemSelected={itemSelected} unSelect={unSelect} color={color} data={batch} />
            </div>
        </>
    );
}

LocalFilesTable.defaultProps = {
    color: 'light',
};

LocalFilesTable.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};
