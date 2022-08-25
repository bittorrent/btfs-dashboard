import React from "react";
import {Switch} from 'antd';
import {t} from "utils/text.js";
import Emitter from "utils/eventBus";

export default function CardConfigItem({ configItem,parentIndex, childIndex }) {
    const onChange = (checked) => {
        Emitter.emit('handleConfigChange',{checked,parentIndex, childIndex});
    };

    return (
      <div className={configItem.isChild?'border-l border-solid pl-2  flex ml-2 justify-between items-center py-1':'flex justify-between items-center py-1'}>
        <div className="">{t(configItem.title)}</div>
        <div className="mr-6">
            <Switch size="small" disabled={configItem.isDisable} defaultChecked={configItem.checked} onChange={onChange} />
        </div>
      </div>
    )
  }