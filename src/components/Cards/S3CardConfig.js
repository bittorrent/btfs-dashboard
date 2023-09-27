import React, { memo, useEffect, useContext } from 'react';
import { mainContext } from 'reducer';
import { Link } from 'react-router-dom';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { t } from 'utils/text.js';
import { getHostConfigData, } from 'services/otherService.js';
import { getUrl } from 'utils/BTFSUtil';

function S3CardConfig({ color }) {
  const { dispatch, state } = useContext(mainContext);
  const { s3ApiUrl } = state;
  const  nodeUrl = localStorage.getItem('NODE_URL')

  const fetchData = async () => {
    const data = await getHostConfigData();
    let s3ApiUrl = '';
    let addressConfig = null;

    if (data && data.Experimental) {
      const { S3CompatibleAPI, Addresses } = data;
      s3ApiUrl = S3CompatibleAPI?.Address;
      addressConfig = Addresses;
      if (addressConfig) {
        addressConfig.Gateway = getUrl(addressConfig.Gateway, true);
      }
    }

    dispatch({
      type: 'SET_S3_API_URL',
      s3ApiUrl: getUrl(s3ApiUrl),
    });
    dispatch({
      type: 'SET_ADDRESS_CONFIG',
      addressConfig: addressConfig,
    });
  };


  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeUrl]);


  return (
    <div className="mb-4 common-card theme-bg theme-text-main">
      <div className="mb-2 justify-between setting-header">
        <div className="flex items-center">
          <h5 className="font-bold uppercase theme-text-main">{t('s3_api_config')}</h5>
        </div>
      </div>
      <div>
        <div className="">
          <div className="py-1">
            <label className="block text-xs font-bold mb-2" htmlFor="grid-password">
              {t('s3_api_end_point')}
            </label>
          </div>
          <div className="flex justify-between">
            <div className="px-3.5 w-full h-9 border rounded-lg flex items-center text-sm leading-none transition-all theme-border-color theme-bg theme-text-sub-info">
              <div className='w-full h-full flex justify-between items-center'>
                <span className='mr-2'>{s3ApiUrl}</span>
                <span>
                  <ClipboardCopy value={s3ApiUrl} ></ClipboardCopy>
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <label className="block text-xs font-bold" htmlFor="grid-password">
              {t('s3_access_keys')}
            </label>
            <Link to={{ pathname: '/admin/settings', search: '?s3Detail=1' }}>
              <button className="ml-2 common-btn theme-common-btn" type="button"> {t('s3_manager')}</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(S3CardConfig);
