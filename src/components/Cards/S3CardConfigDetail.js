import React, { useState, useEffect } from 'react';
import { Breadcrumb, Switch } from 'antd';
import { t } from 'utils/text.js';
import { Link } from 'react-router-dom';

import S3AccessKeyDropdown from 'components/Dropdowns/S3AccessKeyDropdown.js';
import S3NewAccessKeyModal from 'components/Modals/S3NewAccessKeyModal.js';
import S3DeleteAccessKeyModal from 'components/Modals/S3DeleteAccessKeyModal.js';
import S3ResetAccessKeyModal from 'components/Modals/S3ResetAccessKeyModal.js';
import Emitter from 'utils/eventBus';
import { getS3AccessKeyList, disableS3AccessKey, enableS3AccessKey } from 'services/s3Service';
import moment from 'moment';


export default function S3CardConfigDetail({ color }) {
  const [accessKeyList, setAccessKeyList] = useState(null);

  const fetchData = async () => {
    const data = await getS3AccessKeyList();
    if (data && data.length) {

      let list = data.map(item => {
        item.created_at_time = moment(item.created_at, "YYYY-MM-DD HH:mm:ss");
        return item;
      })

      list.sort(function (a, b) {
        return b.created_at_time - a.created_at_time;
      });

      setAccessKeyList(list);
    } else {
      setAccessKeyList([]);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleItemChange = async (item) => {
    let res = null;
    if (item.enable) {
      res = await disableS3AccessKey(item.key);
    } else {
      res = await enableS3AccessKey(item.key);
    }
    console.log("enableS3AccessKey", res);
    await fetchData();
    let successMsg = item.enable ? 's3_access_key_disable_success' : 's3_access_key_enable_success';
    Emitter.emit('showMessageAlert', { message: successMsg, status: 'success', type: 'frontEnd' });
  }



  return (
    <div className="common-card theme-bg theme-text-main">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={{ search: '?s3Detail=0' }}>
            <span>{t('setting_breadcrumb')}</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t('s3_access_keys')}</Breadcrumb.Item>
      </Breadcrumb>
      <div className={'relative flex flex-col theme-bg theme-text-main'}>
        <div className="mb-4 flex flex-wrap items-center">
          <div className="relative mr-4 flex-1 overflow-overlay">

          </div>
          <div className="flex">
            <button
              className="common-btn theme-common-btn"
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                Emitter.emit('openS3NewKeyModal', { callbackFn: fetchData })

              }}>
              <i className="fas fa-plus mr-2"></i>
              {t('s3_new_key')}
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full bg-transparent border-collapse">
            <thead className="theme-table-head-bg">
              <tr className="common-table-head-tr theme-border-color theme-text-sub-info">
                <th className="common-table-head-th" style={{ width: '20%' }}>
                  {t('s3_key')}
                </th>
                <th className="common-table-head-th" style={{ width: '50%' }}>{t('s3_secret')}</th>
                <th className="common-table-head-th" style={{ width: '20%' }}>{t('s3_created_at')}</th>
                <th className="common-table-head-th" style={{ width: '10%' }}>{t('s3_enable')}</th>
                <th className="common-table-head-th" style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {accessKeyList &&
                accessKeyList.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="common-table-body-tr theme-border-color theme-text-main theme-table-row-hover">

                      <td className="common-table-body-td monospaced-font">{item.key}</td>
                      <td className="common-table-body-td monospaced-font">{item.secret}</td>
                      <td className="common-table-body-td">{item.created_at ? moment(item.created_at).format('YYYY-MM-DD HH:mm:ss') : '--'}</td>
                      <td className="common-table-body-td"><Switch size="small" checked={item.enable} onChange={() => handleItemChange(item)} /></td>
                      <td className="common-table-body-td"> <S3AccessKeyDropdown color={color} item={item} updateListFn={fetchData} /></td>

                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!accessKeyList && (
            <div className="w-full flex justify-center pt-4">
              <img
                alt="loading"
                src={require('../../assets/img/loading.svg').default}
                style={{ width: '50px', height: '50px' }}
              />
            </div>
          )}
          {accessKeyList && accessKeyList.length < 1 && <div className="w-full flex justify-center p-4">{t('no_data')}</div>}
        </div>

      </div>

      <S3NewAccessKeyModal />
      <S3DeleteAccessKeyModal />
      <S3ResetAccessKeyModal />

    </div>
  );
}
