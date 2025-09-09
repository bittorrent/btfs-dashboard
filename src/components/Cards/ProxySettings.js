import React, { useState, useEffect } from 'react';
import { Switch ,} from 'antd';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
import ProxyConfirmModal from 'components/Modals/ProxyComfirmModal';
import ChangePriceModal from 'components/Modals/ChangePriceModal';
import { getProxyPrice } from 'services/proxyService';
import { getHostConfigData } from 'services/otherService.js';

export default function CardSettings({ color }) {
    // const isProxyMode = localStorage.getItem('IS_PROXY_MODE');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [isProxyMode, setIsProxyMode] = useState(false);
    const [curProxyPrice, setCurProxyPrice] = useState(125);


    useEffect(() => {
        getCurProxyPrice()
        getProxyConfig()

    }, []);

    const getProxyConfig = async()=>  {
        let data = await getHostConfigData()
        if (data && data.Experimental) {
            // setIsProxyMode(data.Experimental.EnableProxyMode)
            setChecked(data.Experimental.EnableProxyMode)
        }
    }

    const getCurProxyPrice = async () => {
        let res = await getProxyPrice();
        if(res.price){
            setCurProxyPrice(res.price)
        }
    };

    const onChange = checked => {
        setLoading(true)
        Emitter.emit('openProxyConfirmModal', { checked });
    };

    const handleChangePrice = ()=>{
        Emitter.emit('openChangePriceModal');
    }

    const setSwitchLoading = (loading)=>{
        setLoading(loading)
    }

    // const setSwitchChecked = (checked)=>{
    //     setChecked(checked)
    // }

    return (
        <div>
            {/* api end point */}
            <div className="mb-4 common-card theme-bg theme-text-main">
                <div className="flex justify-between items-center">
                    <h5 className="font-bold theme-text-main" htmlFor="grid-password">
                        {t('enable_proxy_mode')}
                    </h5>
                    <Switch
                        // disabled={configItem.isDisable}
                        checked={checked}
                        onChange={onChange}
                        loading={loading}
                    />
                </div>
            </div>

            {/* storage path */}
            <div className="mb-4 common-card theme-bg theme-text-main">
                <div className="mb-2 setting-header">
                    <h5 className="font-bold theme-text-main">{t('proxy_service_price')}</h5>
                </div>
                <div className="flex items-center">
                    <span className="mr-2">{curProxyPrice}</span>
                    <span className="mr-2">BTT(GB/{t('unit_day')})</span>
                    <i className={'w-5 mr-2 text-sm iconfont BTFS_icon_Settings cursor-pointer ' } onClick={handleChangePrice} ></i>
                </div>
            </div>

            <ChangePriceModal color={color}  fetchCurProxyPrice={getCurProxyPrice}/>
            <ProxyConfirmModal  color={color} setSwitchLoading={setSwitchLoading}  setSwitchChecked={getProxyConfig} />
        </div>
    );
}
