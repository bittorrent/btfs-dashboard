/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { mainContext } from 'reducer';
import { Breadcrumb } from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import S3BucketFileTableDropdown from 'components/Dropdowns/S3BucketFileTableDropdown.js';
import S3ImportFilesDropdown from 'components/Dropdowns/S3ImportFilesDropdown.js';
import FileControl from 'components/Footers/FileControl.js';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { switchStorageUnit2 } from 'utils/BTFSUtil.js';
import { t } from 'utils/text.js';
import { Link } from 'react-router-dom';
import Emitter from 'utils/eventBus';
import * as AWS from "@aws-sdk/client-s3";
const { S3Client, ListObjectsCommand } = AWS;


let didCancel = false;
let nameArray = [];
let globalS3 = null;
const s3PlaceholderKey = 's3-placeholder.txt';


export default function S3BucketsTable({ color, bucketName, accessKeyId, secretAccessKey }) {

    const history = useHistory();
    const { state } = useContext(mainContext);
    const { s3ApiUrl, addressConfig } = state;

    const [globalS3Obj, setGlobalS3Obj] = useState(null);
    const batchList = useRef([]);
    const [itemSelected, setItemSelected] = useState(0);
    const [breadcrumbName, setBreadcrumbName] = useState([]);
    const [files, setFiles] = useState(null);
    const [batch, setBatch] = useState([]);
    const [delimiter] = useState("/");
    const [prefix, setPrefix] = useState("");

    const listFilesInBucket = async ({ bucketName, prefix }) => {
        try {
            let CIDList = null;
            const command = new ListObjectsCommand({ Bucket: bucketName, Delimiter: delimiter, Prefix: prefix });
            command.middlewareStack.add(
                (next, context) => async (args) => {
                    const result = await next(args);
                    // result.response contains data returned from next middleware.
                    CIDList = result.response.headers['cid']?.split(", ");
                    return result;
                },
                {
                    name: "printResponseHeader",
                }
            );
            const res = await globalS3.send(command);
            const prefixLen = prefix.length;
            let { Contents = [], CommonPrefixes = [] } = res;
            CommonPrefixes.map(item => {
                const prefixList = item.Prefix.split('/');
                item.Name = prefixList[prefixList.length - 2];
                item.Type = 1;
                item.Key = item.Prefix;
                return item;
            })

            Contents.map((item, index) => {

                item.Name = item.Key.slice(prefixLen);
                item.Type = 2;
                item.CID = CIDList[index];
                item.CIDAbbrValue = item.CID.slice(0, 2) + '...' + item.CID.slice(-2);
                item.GatewayUrl = addressConfig.Gateway + '/btfs/' + CIDList[index];
                item.GatewayUrlAbbrValue = addressConfig.Gateway + '/btfs/' + item.CIDAbbrValue;
                return item;
            })

            Contents = Contents.filter(item => item.Name !== "");

            console.log("Contents", Contents, CommonPrefixes);
            setFiles(() => [...CommonPrefixes, ...Contents]);

        } catch (e) {
            console.log('error', e)
            goFile();
        }

    };

    useEffect(() => {
        if (s3ApiUrl) {
            globalS3 = null;
            globalS3 = new S3Client({
                endpoint: s3ApiUrl,
                region: "us-east-1",
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                },
                s3ForcePathStyle: true,
            });
            console.log("AWS", AWS);
            setGlobalS3Obj(() => globalS3);
            // listFilesInBucket({ bucketName });
        } else {
            globalS3 = null;
        }

    }, [accessKeyId, s3ApiUrl, secretAccessKey])

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
                    batchList.current.push(item);
                });

            setBatch(batchList.current);
        } else {
            unSelect();
        }
    };

    const select = (e, item) => {
        let checkboxHub = document.getElementsByName('checkboxHub');
        if (!e.target.checked) {
            checkboxHub[0].checked = '';
            batchList.current = batchList.current.filter(ele => {
                return item.hash !== ele.hash || item.name !== ele.name;
            });
        } else {
            batchList.current.push(item);
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

    const addPath = async (item) => {
        const type = item.Type;
        const name = item.Name;
        if (type === 1) {
            let pathName = [...breadcrumbName, name];
            setPrefix(item.Prefix);
            setBreadcrumbName(pathName);
            nameArray = pathName;
            setFiles(null);
            await listFilesInBucket({ bucketName, prefix: item.Prefix });
        }
        if (type === 2) {
            // Emitter.emit('openPreviewModal', { hash: hash, name: name, size: size });
        }
        if (type === -1) {
            // let pathName = ['root', name];
            // setBreadcrumbName(pathName);
            // nameArray = pathName;
            // setFiles(null);
            // getFilesByHash(hash);
        }
    };

    const minusPath = async name => {
        let index = breadcrumbName.indexOf(name) + 1;
        let breadName = breadcrumbName.slice(0, index);
        let pathName = [...breadName];
        let prefix = pathName.join("/").slice(4);
        if (prefix.length > 0) {
            prefix = prefix + "/";
        }
        setPrefix(prefix);
        setBreadcrumbName(pathName);
        nameArray = pathName;
        setFiles(null);
        await listFilesInBucket({ bucketName, prefix: prefix });
    };

    const updateFiles = async () => {
        didCancel = false;
        await listFilesInBucket({ bucketName, prefix: prefix });
        if (!didCancel) {
            unSelect();
            nameArray.shift();
            nameArray.unshift('root');
            setBreadcrumbName(nameArray);
        }
    };



    useEffect(() => {
        const set = async function () {
            setTimeout(() => {
                updateFiles();
            }, 1000);
        };
        Emitter.on('updateS3Files', set);
        return () => {
            Emitter.removeListener('updateS3Files');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefix, bucketName]);

    useEffect(() => {
        updateFiles();
        return () => {
            didCancel = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleNewFolder = async () => {
        Emitter.emit('openS3NewFolderModal', {
            bucketName, globalS3, prefix, s3PlaceholderKey
        })
    }

    const goFile = (item) => {
        history.push(`/admin/files`);
    }

    return (
        <>
            <div className={'relative flex flex-col common-card theme-bg theme-text-main'}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to={{ search: '?' }}>
                            <span>{t('file_breadcrumb')}</span>
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{bucketName}</Breadcrumb.Item>
                </Breadcrumb>
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
                    <div className="flex justify-end">
                        <button className="common-btn theme-common-btn mr-4" onClick={handleNewFolder}>
                            {t('s3_new_folder')}
                        </button>
                        <S3ImportFilesDropdown globalS3Obj={globalS3Obj} color={color} path={prefix} bucketName={bucketName} />
                        {/* <button className="common-btn theme-common-btn">
                            {t('s3_upload')}
                        </button> */}
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
                                <th className="common-table-head-th">
                                    {t('s3_name')}
                                </th>
                                <th className="common-table-head-th">{t('s3_cid')}</th>
                                <th className="common-table-head-th">{t('s3_gateway_url')}</th>
                                <th className="common-table-head-th">{t('size')}</th>
                                <th className="common-table-head-th">{t('s3_modified')}</th>
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
                                                        select(e, item);
                                                    }}
                                                />
                                            </td>
                                            <td className="common-table-body-td" style={{ minWidth: '200px', textWrap: 'wrap' }}>
                                                <div className="flex">
                                                    <a
                                                        className="flex items-center"
                                                        onClick={() => {
                                                            addPath(item);
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
                                            <td className="common-table-body-td">{item.CID ?
                                                <>
                                                    {item.CIDAbbrValue}
                                                    <ClipboardCopy value={item.CID} />
                                                </> : '--'}</td>
                                            <td className="common-table-body-td">{item.GatewayUrl ?
                                                <span className="h-full flex">
                                                    <a className="flex items-center theme-link" target="_blank" rel="noreferrer" href={item.GatewayUrl}><span>{item.GatewayUrlAbbrValue}</span></a>
                                                    <ClipboardCopy value={item.GatewayUrl} />
                                                </span> : '--'}</td>
                                            <td className="common-table-body-td">{item['Size'] ? switchStorageUnit2(item['Size']) : '--'}</td>
                                            <td className="common-table-body-td">{item.LastModified ? moment(item.LastModified).format('YYYY-MM-DD HH:mm:ss') : '--'}</td>
                                            <td className="common-table-body-td">
                                                <S3BucketFileTableDropdown
                                                    color={color}
                                                    globalS3={globalS3Obj}
                                                    bucketName={bucketName}
                                                    item={item}
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
                    {files && files.length < 1 && <div className="w-full flex justify-center p-4">{t('no_data')}</div>}
                </div>
                <FileControl itemSelected={itemSelected} type={"s3File"} unSelect={unSelect} color={color} data={batch} bucketName={bucketName} globalS3={globalS3Obj} prefix={prefix} />
            </div>

        </>
    );
}

S3BucketsTable.defaultProps = {
    color: 'light',
};

S3BucketsTable.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};
