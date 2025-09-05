import React, { useContext, useState } from 'react';
import { mainContext } from 'reducer';
import { Tabs } from 'antd';
import { t } from 'utils/text.js';
import ProxySettings from 'components/Cards/ProxySettings.js';
import ProxyUploadTable from 'components/Tables/ProxyUploadTable';
import UserBalanceTable from 'components/Tables/UserBalanceTable';


export default function Settings(props) {
    const { state } = useContext(mainContext);
    // const query = new URLSearchParams(props.location.search);
    const [activeKey, setActiveKey] = useState('1');

    const { theme } = state;
    const changeActiveKey = activeKey => {
        setActiveKey(activeKey);
    };
    return (
        <>
            <div className="">
                <ProxySettings color={theme} />
                <Tabs
                    defaultActiveKey="1"
                    activeKey={activeKey}
                    onChange={changeActiveKey}
                    className="mb-4 common-card theme-bg theme-text-main file-tab-content">
                    <Tabs.TabPane tab={t('proxy_upload')} key="1" className="w-full">
                        <ProxyUploadTable  color={theme} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={t('user_balance')} key="2">
                    {
                        <UserBalanceTable  color={theme} />
                    }
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    );
}
