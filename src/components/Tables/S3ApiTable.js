/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useContext } from 'react';
import { Select, } from 'antd';
import { mainContext } from 'reducer';
import PropTypes from 'prop-types';
import S3BucketDropdown from 'components/Dropdowns/S3BucketDropdown.js';
import { useHistory } from 'react-router-dom';
import { getS3AccessKeyList } from 'services/s3Service';
import moment from 'moment';
import { t } from 'utils/text.js';
import Emitter from 'utils/eventBus';
import * as AWS from "@aws-sdk/client-s3";
const { ListBucketsCommand, S3Client } = AWS;
let globalS3 = null;


const AWS_CLI_LINK = 'https://aws.amazon.com/cn/cli/';
const { Option } = Select;


export default function S3ApiTable({ color }) {
    const { state } = useContext(mainContext);
    const { s3ApiUrl } = state;
    const [globalS3Obj, setGlobalS3Obj] = useState(null);
    const history = useHistory();
    const [bucketList, setBucketList] = useState(null);
    const [accessKeyList, setAccessKeyList] = useState([]);
    const [curAccessData, setAccessData] = useState(null);

    const handleNewBucket = () => {
        Emitter.emit('openS3NewBucketModal', { globalS3, callbackFn: reFetchBucketList })
    }

    const fetchBucketList = async (params) => {
        try {
            globalS3 = null;
            globalS3 = new S3Client({
                endpoint: s3ApiUrl,
                region: "us-east-1",
                accessKeyId: params.key,
                secretAccessKey: params.secret,
                credentials: {
                    accessKeyId: params.key,
                    secretAccessKey: params.secret,
                },
                s3ForcePathStyle: true,
            });
            setGlobalS3Obj(() => {
                return globalS3;
            })

            await reFetchBucketList();

        } catch (e) {
            console.log("error", e)
        }

    }

    useEffect(() => {
        const set = async function () {
            reFetchBucketList();
        };
        Emitter.on('updateS3Buckets', set);
        return () => {
            Emitter.removeListener('updateS3Buckets');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curAccessData]);

    const reFetchBucketList = async () => {
        try {
            const input = {};
            const command = new ListBucketsCommand(input);
            let ACLList = null;
            command.middlewareStack.add(
                (next, context) => async (args) => {
                    const result = await next(args);
                    // result.response contains data returned from next middleware.
                    ACLList = result.response.headers['x-amz-acl']?.split(", ");
                    return result;
                },
                {
                    name: "printResponseHeader",
                }
            );
            const response = await globalS3.send(command);
            if (response && response.Buckets) {
                const bucketList = response.Buckets;
                bucketList.forEach((item, index) => {
                    item.ACL = ACLList[index];
                })
                setBucketList(() => [...bucketList])
            }
        } catch (e) {
            console.log("error", e)
        }

    }

    const fetchData = async () => {
        const data = await getS3AccessKeyList();
        console.log("getS3AccessKeyList", data);
        if (data && data.length) {
            setAccessKeyList(data);
            setAccessData(data[0]);
            fetchBucketList(data[0]);
        } else {
            setBucketList(() => [])
        }
    }
    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = value => {
        console.log("value", value, accessKeyList);
        const item = accessKeyList.find(item => item.key === value);
        setAccessData(() => { return { ...item } });
        fetchBucketList(item);
    }

    const handleBucketRedirect = (item) => {
        history.push(`/admin/files?bucketDetail=1&bucketName=${item.Name}&accessKeyId=${curAccessData.key}&secretAccessKey=${curAccessData.secret}`);
    }

    const handleAccessManager = () => {
        history.push(`/admin/settings?s3Detail=1`);
    }


    return (
        <div className="relative flex flex-col">
            <div className="flex w-full items-center s3-des-content mb-4">
                <img className="mr-1" alt="" style={{ height: '12px' }} src={require('../../assets/img/s3/s3-tips.svg').default} />
                <span>{t('s3_api_des_1')}</span>
                <a className="flex items-center theme-link" target="_blank" rel="noreferrer" href={AWS_CLI_LINK}><span>&nbsp;{t('s3_api_des_2')}&nbsp;</span></a>
                <span>{t('s3_api_des_3')}</span>
            </div>
            <div className="mb-4 flex  items-center justify-between flex-wrap">
                <div className="flex items-center flex-wrap">
                    {/* <img className="mr-1" alt="" style={{ height: '15px' }} src={require('../../assets/img/s3/s3-key.svg').default} /> */}

                    {accessKeyList && accessKeyList.length > 0 &&
                        <>
                            <i class="fa-solid fa-key mr-1"></i>
                            <div className="mr-2">{t('s3_access_key')}</div>
                            <Select
                                className={'mr-2 theme-border-color ' + color}
                                defaultValue={accessKeyList[0].key}
                                style={{ width: 300 }}
                                onChange={handleChange}
                            // dropdownStyle={{ background: themeStyle.bg[color] }}
                            >
                                {accessKeyList.map(item => {
                                    return (
                                        <Option key={item.key} value={item.key}>
                                            {item.secret}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </>

                    }

                    <button className="common-btn theme-common-btn" onClick={handleAccessManager}>
                        {t('s3_access_keys_manager')}
                    </button>
                </div>

                {accessKeyList && accessKeyList.length > 0 && (
                    <button className="common-btn theme-common-btn" onClick={handleNewBucket}>
                        {t('s3_new_bucket')}
                    </button>
                )}

            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full bg-transparent border-collapse">
                    <thead className="theme-table-head-bg">
                        <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
                            <th className="common-table-head-th">
                                {t('s3_bucket_name')}
                            </th>
                            <th className="common-table-head-th">{t('s3_acl')}</th>
                            <th className="common-table-head-th">{t('s3_modified')}</th>
                            <th className="common-table-head-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bucketList &&
                            bucketList.map((item, index) => {
                                return (

                                    <tr
                                        key={index}
                                        className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">
                                        <td onClick={() => { handleBucketRedirect(item) }} className="common-table-body-td">
                                            <a className="flex items-center">
                                                <i className={'w-5 mr-2 text-sm iconfont BTFS_icon_Peers '}></i>
                                                {item['Name']}
                                            </a>

                                        </td>
                                        <td className="common-table-body-td">{item['ACL']}</td>
                                        <td className="common-table-body-td">{item.CreationDate ? moment(item.CreationDate).format('YYYY-MM-DD HH:mm:ss') : '--'}</td>
                                        <td className="common-table-body-td">
                                            <S3BucketDropdown
                                                color={color}
                                                item={item}
                                                globalS3={globalS3Obj}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {!bucketList && (
                    <div className="w-full flex justify-center pt-4">
                        <img
                            alt="loading"
                            src={require('../../assets/img/loading.svg').default}
                            style={{ width: '50px', height: '50px' }}
                        />
                    </div>
                )}
                {(!bucketList || bucketList.length < 1) && <div className="w-full flex justify-center p-4">{t('no_data')}</div>}
            </div>

        </div>
    );
}

S3ApiTable.defaultProps = {
    color: 'light',
};

S3ApiTable.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};