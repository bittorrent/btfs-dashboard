import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import { Breadcrumb } from 'antd';
import { t } from 'utils/text.js';
import { Link } from 'react-router-dom';
import themeStyle from 'utils/themeStyle.js';
import { getHostConfigData } from 'services/otherService.js';

export default function CardConfigFileDetail({ color }) {
  const jsonTheme = themeStyle.bg[color].includes('white') ? 'monokai' : 'ocean';
  const [nodeData, setNodeData] = useState({});
  const fetchData = async () => {
    const data = await getHostConfigData();
    setNodeData(() => {
      return data;
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="common-card theme-bg theme-text-main">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={{ search: '?fileDetail=0' }}>
            <span>{t('setting_breadcrumb')}</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t('setting_file_config_breadcrumb')}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-xs my-4 theme-text-sub-main">{t('setting_file_config_breadcrumb_des')}</div>
      <ReactJson
        src={nodeData}
        displayObjectSize={false}
        quotesOnKeys={false}
        displayArrayKey={false}
        displayDataTypes={false}
        theme={jsonTheme}
      />
    </div>
  );
}
