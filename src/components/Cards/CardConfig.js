import React, { useState, useEffect, useRef, memo } from 'react';
import { Switch, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ButtonRoundRect from 'components/Buttons/ButtonRoundRect';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

import { getHostConfigData, resetHostConfigData, editHostConfig } from 'services/otherService.js';
function CardConfig({ color }) {
  const [configList, setConfigList] = useState([]);
  const [rpcAddress, setRpcAddress] = useState('');
  const rpcAddressRef = useRef(null);
  const handleResetDefault = () => {
    Emitter.emit('openConfigConfirmModal', {});
  };
  const handleChange = ({ checked, parentIndex, childIndex }) => {
    const needUpdateData = [];
    setConfigList(oldConfigList => {
      const cloneConfigList = JSON.parse(JSON.stringify(oldConfigList));
      if (!isNaN(childIndex)) {
        cloneConfigList[parentIndex]['children'][childIndex]['checked'] = checked;
        needUpdateData.push(cloneConfigList[parentIndex]['children'][childIndex]);
      } else {
        cloneConfigList[parentIndex]['checked'] = checked;
        needUpdateData.push(cloneConfigList[parentIndex]);
      }
      if (parentIndex === 0 && isNaN(childIndex)) {
        cloneConfigList[parentIndex]['children'].forEach(item => {
          if (checked) {
            if (!item['checked']) {
              item['checked'] = true;
              needUpdateData.push(item);
            }
            item['isDisable'] = true;
          } else {
            item['isDisable'] = false;
          }
        });
      }
      handleUpdateConfig(needUpdateData);
      return cloneConfigList;
    });
  };
  const handleUpdateConfig = async needUpdateData => {
    for (let i = 0; i < needUpdateData.length; i++) {
      const { key, checked } = needUpdateData[i];
      editHostConfig(`Experimental.${key}`, checked, true);
    }
  };

  useEffect(() => {
    fetchData();
    Emitter.on('handleConfigChange', handleChange);
    Emitter.on('handleResetConfig', handleResetConfig);
    return () => {
      Emitter.removeListener('handleConfigChange');
      Emitter.removeListener('handleResetConfig');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchData = async () => {
    const data = await getHostConfigData();
    let configList = [];
    let rpcAddress = '';
    if (data && data.Experimental) {
      const { Experimental, ChainInfo } = data;
      if (Experimental) {
        configList = handleExperimentalData(Experimental);
      }
      if (ChainInfo) {
        rpcAddress = ChainInfo.Endpoint;
      }
    }
    setConfigList(() => {
      return configList;
    });
    setRpcAddress(rpcAddress);
  };
  const handleExperimentalData = experimental => {
    if (!experimental) return [];
    const { StorageHostEnabled, ReportOnline, ReportStatusContract } = experimental;
    const configList = [
      {
        title: 'enable_storage_host',
        checked: StorageHostEnabled,
        key: 'StorageHostEnabled',
        tips: 'enable_storage_host_tips',
        children: [
          {
            title: 'enable_report_online',
            tips: 'enable_report_online_tips',
            isChild: true,
            checked: ReportOnline,
            key: 'ReportOnline',
            isDisable: StorageHostEnabled ? true : false,
          },
          {
            title: 'enable_report_status_contract',
            tips: 'enable_report_status_contract_tips',
            isChild: true,
            checked: ReportStatusContract,
            key: 'ReportStatusContract',
            isDisable: StorageHostEnabled ? true : false,
          },
        ],
      },
    ];
    return configList;
  };
  const handleResetConfig = async () => {
    const data = await resetHostConfigData();
    let experimentalData = {};
    if (data) {
      experimentalData = {
        ReportOnline: data['Experimental.ReportOnline'],
        ReportStatusContract: data['Experimental.ReportStatusContract'],
        StorageHostEnabled: data['Experimental.StorageHostEnabled'],
      };
    }
    const configList = handleExperimentalData(experimentalData);
    const rpcAddress = data['ChainInfo.Endpoint'];
    setRpcAddress(rpcAddress);
    setConfigList(() => {
      return configList;
    });
  };
  const changeRpcAddress = async e => {
    editHostConfig('ChainInfo.Endpoint', rpcAddressRef.current.value, false);
  };
  const CardConfigItem = ({ configItem, parentIndex, childIndex }) => {
    const onChange = checked => {
      Emitter.emit('handleConfigChange', { checked, parentIndex, childIndex });
    };
    return (
      <div className="flex justify-between items-center py-1">
        <div>
          {t(configItem.title)}
          <Tooltip placement="right" title={<p>{t(configItem.tips)}</p>}>
            <InfoCircleOutlined className="inline-flex items-center ml-1 text-xs" />
          </Tooltip>
        </div>
        <div className="mr-6">
          <Switch
            size="small"
            disabled={configItem.isDisable}
            checked={configItem.checked}
            onChange={onChange}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="mb-4 common-card theme-bg theme-text-main">
      <div className="mb-2 justify-between setting-header">
        <div className="flex items-center">
          <h5 className="font-bold uppercase theme-text-main">{t('advance_config')}</h5>
          <Tooltip placement="top" title={<p>{t('advance_config_tips')}</p>}>
            <InfoCircleOutlined className="inline-flex items-center ml-1 text-xs" />
          </Tooltip>
        </div>
        <div>
          <ButtonRoundRect text={t('reset_default')} onClick={handleResetDefault} />
          <Link
            to={{
              search: '?fileDetail=1',
            }}>
            <ButtonRoundRect className="ml-2" text={t('view_config_file')} />
          </Link>
        </div>
      </div>
      <div>
        {configList.map((configItem, configIndex) => {
          return (
            <div key={configItem.key} className="pl-4 mb-2">
              <CardConfigItem configItem={configItem} parentIndex={configIndex} />
              {configItem.children &&
                configItem.children.map((childItem, childIndex) => {
                  return (
                    <div key={childItem.key}>
                      <CardConfigItem
                        configItem={childItem}
                        parentIndex={configIndex}
                        childIndex={childIndex}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
        <div className="">
          <div className="py-1">
            <label className="block uppercase text-xs font-bold mb-2" htmlFor="grid-password">
              {t('rpc_address')}
            </label>
          </div>
          <div className="flex justify-between">
            <input
              type="text"
              className="common-input theme-bg theme-border-color"
              defaultValue={rpcAddress}
              ref={rpcAddressRef}
            />
            <button className="ml-2 common-btn theme-common-btn" type="button" onClick={changeRpcAddress}>
              {t('rpc_set_btn_name')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(CardConfig);
