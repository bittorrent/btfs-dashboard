import React, {useState, useEffect} from "react";
import CardConfigItem from "./CardConfigItem";
import Emitter from "utils/eventBus";
import {cloneDeep} from 'lodash';
const initConfigList = [
    {
        title:'enable_storage_host',
        checked: true,
        key:'config1',
        children:[
            {
                title:'enable_report_online',
                isChild: true,
                checked: true,
                key:'config1_1',
                isDisable: true,
            },
            {
                title:'enable_report_status_contract',
                isChild: true,
                checked: true,
                key:'config1_2',
                isDisable: true,
            },
        ]
    },
    {
        title:'enable_storage_client',
        checked: true,
        key:'config2',
    },
]
export default function CardConfigList () {
    const [configList, setConfigList] = useState(cloneDeep(initConfigList));
    const handleChange = ({checked,parentIndex,childIndex}) => {
        console.log('handleChange',checked,parentIndex,childIndex)
        setConfigList((oldConfigList)=>{
            const cloneConfigList = cloneDeep(oldConfigList);
            if(!isNaN(childIndex)){
                cloneConfigList[parentIndex]['children'][childIndex]['checked'] = checked;
            }else{
                cloneConfigList[parentIndex]['checked'] = checked;
            }
            if(parentIndex===0&&isNaN(childIndex)){
                console.log("进入子集")
                cloneConfigList[parentIndex]['children'].forEach(item=>{
                    if(checked){
                        item['checked'] = true;
                        item['isDisable'] = true;
                    }else{
                        item['isDisable'] = false;
                    }
                })
            }
            console.log('handleChange',cloneConfigList);
            return cloneConfigList;
        });
    };
    const handleResetConfig = () => {
        setConfigList((oldConfigList)=>{
            const cloneConfigList = cloneDeep(initConfigList);
            console.log("oldConfigList",oldConfigList);
            console.log("handleResetConfig",cloneConfigList);
            return  cloneConfigList;
        });
    }
    useEffect(() => {
            Emitter.on("handleConfigChange", handleChange);
            Emitter.on("handleResetConfig", handleResetConfig);
            return () => {
                Emitter.removeListener('handleConfigChange');
                Emitter.removeListener('handleResetConfig');
            }
    }, []);
    return (
        configList.map((configItem,configIndex) => {
            return(
                <div key={configItem.key}>
                <CardConfigItem configItem={configItem} parentIndex={configIndex}/>
                {
                    configItem.children && configItem.children.map((childItem,childIndex)=>{
                        return(
                            <div key={childItem.key}>
                                <CardConfigItem configItem={childItem} parentIndex={configIndex} childIndex={childIndex}/>
                            </div>
                        )
                       
                    })
                }
                
                </div>
            )
        })
    )
  }
