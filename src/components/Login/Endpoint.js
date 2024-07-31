import React, { useContext } from 'react';
import { mainContext } from 'reducer';
import { Dropdown, Menu } from 'antd';
import themeStyle from 'utils/themeStyle.js';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Truncate } from 'utils/text.js';
import { t } from 'utils/text.js';
import ClipboardCopy from 'components/Utils/ClipboardCopy';

const Endpoint = ({ color }) => {
    // const { dispatch, state } = useContext(mainContext);
    // const { account } = state;

    const save = (e, wallet) => {
        // connect(wallet, dispatch);
    };

    const handleChange = () => {
        // disConnect(dispatch);
    };

    return (
        <div className="flex flex-col justify-center max-w-515px">
            <div className=" min-h-400">
                <div className="login-title">{t('login')}</div>
                <div className="text-gray-900 text-sm font-bold mb-12">
                {t('login_endpoint_desc')}
                </div>
                <div className="mb-2 setting-header">
                <h5 className="font-bold theme-text-main" htmlFor="grid-password">
                  API {t('endpoint')}
                </h5>
                <Tooltip overlayInnerStyle={{ width: '180px' }} placement="top" title={<p>{t('copy_url_tips')}</p>}>
                  {/* <i className="far fa-question-circle ml-1 text-xs"></i> */}
                  <QuestionCircleOutlined className="inline-flex items-center ml-1 text-xs" />
                </Tooltip>
              </div>
                <input
                    type="text"
                    className="mr-2 common-input theme-bg theme-border-color"
                    defaultValue="http://localhost:5001"
                    // ref={inputRef}
                    onChange={handleChange}
                />
                <button className="mt-5 common-btn theme-common-btn login-btn" type="button" onClick={save}>
                    {t('next')}
                </button>
            </div>
        </div>
    );
};

export default Endpoint;
