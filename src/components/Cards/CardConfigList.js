import React, { useState, useEffect,useRef } from "react";
// import CardConfigItem from "./CardConfigItem";
import {Switch} from 'antd';
import Emitter from "utils/eventBus";
import { t } from "utils/text.js";
import themeStyle from "utils/themeStyle.js";
import {
  getHostConfigData,
  resetHostConfigData,
  editHostConfig,
} from "services/otherService.js";
export default function CardConfigList({ color }) {
  const [configList, setConfigList] = useState([]);
  const [rpcAddress, setRpcAddress] = useState('');
  const rpcAddressRef = useRef(null);
  const handleChange = ({ checked, parentIndex, childIndex }) => {
    const needUpdateData = [];
    setConfigList((oldConfigList) => {
      const cloneConfigList = JSON.parse(JSON.stringify(oldConfigList));
      if (!isNaN(childIndex)) {
        cloneConfigList[parentIndex]["children"][childIndex]["checked"] =
          checked;
        needUpdateData.push(
          cloneConfigList[parentIndex]["children"][childIndex]
        );
      } else {
        cloneConfigList[parentIndex]["checked"] = checked;
        needUpdateData.push(cloneConfigList[parentIndex]);
      }
      if (parentIndex === 0 && isNaN(childIndex)) {
        cloneConfigList[parentIndex]["children"].forEach((item) => {
          if (checked) {
            if (!item["checked"]) {
              item["checked"] = true;
              needUpdateData.push(item);
            }
            item["isDisable"] = true;
          } else {
            item["isDisable"] = false;
          }
        });
      }
      handleUpdateConfig(needUpdateData);
      return cloneConfigList;
    });
  };
  const handleUpdateConfig = async (needUpdateData) => {
    console.log("needUpdateData", needUpdateData);
    for (let i = 0; i < needUpdateData.length; i++) {
      const { key, checked } = needUpdateData[i];
      editHostConfig(`Experimental.${key}`,checked,true);
    }
  };
  const handleResetConfig = async () => {
    const data = await resetHostConfigData();
    let experimentalData = {};
    if (data) {
      experimentalData = {
        ReportOnline: data["Experimental.ReportOnline"],
        ReportStatusContract: data["Experimental.ReportStatusContract"],
        StorageHostEnabled: data["Experimental.StorageHostEnabled"],
      };
    }
    const configList = handleExperimentalData(experimentalData);
    const rpcAddress = data["ChainInfo.Endpoint"];
    setRpcAddress(rpcAddress);
    setConfigList(() => {
      return configList;
    });
  };
  const fetchData = async () => {
    const data = await getHostConfigData();
    let configList = [];
    let rpcAddress = ''
    configList = handleExperimentalData({});
    if (data && data.Experimental) {
      const { Experimental,ChainInfo}  = data;
      if (Experimental) {
        configList = handleExperimentalData(Experimental);
      }
      if(ChainInfo){
        rpcAddress = ChainInfo.Endpoint;
      }
    }
    setConfigList(() => {
      return configList;
    });
    setRpcAddress(rpcAddress)
  };
  const handleExperimentalData = (experimental) => {
    if (!experimental) return [];
    const {
      StorageHostEnabled,
      ReportOnline,
      ReportStatusContract,
    } = experimental;
    const configList = [
      {
        title: "enable_storage_host",
        checked: StorageHostEnabled,
        key: "StorageHostEnabled",
        children: [
          {
            title: "enable_report_online",
            isChild: true,
            checked: ReportOnline,
            key: "ReportOnline",
            isDisable: StorageHostEnabled ? true : false,
          },
          {
            title: "enable_report_status_contract",
            isChild: true,
            checked: ReportStatusContract,
            key: "ReportStatusContract",
            isDisable: StorageHostEnabled ? true : false,
          },
        ],
      }
    ];
    return configList;
  };
  useEffect(() => {
    fetchData();
    Emitter.on("handleConfigChange", handleChange);
    Emitter.on("handleResetConfig", handleResetConfig);
    return () => {
      Emitter.removeListener("handleConfigChange");
      Emitter.removeListener("handleResetConfig");
    };
  }, []);
  const changeRpcAddress = async(e) => {
    editHostConfig('ChainInfo.Endpoint', rpcAddressRef.current.value,false);
  };
  const CardConfigItem = function CardConfigItem({ configItem,parentIndex, childIndex }) {
    const onChange = (checked) => {
        Emitter.emit('handleConfigChange',{checked,parentIndex, childIndex});
    };
    return (
      <div className={'flex justify-between items-center py-1'}>
        <div className="">{t(configItem.title)}</div>
        <div className="mr-6">
            <Switch size="small" disabled={configItem.isDisable} checked={configItem.checked} onChange={onChange} />
        </div>
      </div>
    )
  }
  return (
    <>
      {configList.map((configItem, configIndex) => {
        return (
          <div key={configItem.key}>
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
      <div className="py-4">
        <div className="py-1">{t('rpc_address')}</div>
          {/* 'rpc_address':'RPC Address',
    'rpc_set_btn_name':'set', */}
        <div className="pb-6 flex justify-between">
          <input
            type="text"
            className={
              "border px-3 py-3 placeholder-blueGray-300 rounded text-sm shadow focus:outline-none focus:ring w-full " +
              themeStyle.bg[color]
            }
            defaultValue={rpcAddress}
            ref={rpcAddressRef}
          />
          <button
            className="bg-indigo-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ml-2"
            type="button"
            onClick={changeRpcAddress}
          >
            {t("rpc_set_btn_name")}
          </button>
        </div>
      </div>
    </>
  );
}
