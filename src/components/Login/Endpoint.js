import React, {useRef,useEffect} from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Emitter from 'utils/eventBus';
import { urlCheck } from 'utils/checks.js';
import { Tooltip } from 'antd';
import { t } from 'utils/text.js';
import { getParameterByName } from 'utils/BTFSUtil.js';




const Endpoint = ({ color }) => {
    const inputRef = useRef(null);

    const getEndpoint = ()=>{
        const apiUrl = getParameterByName('api', window.location.href);
        let NODE_URL = localStorage.getItem('NODE_URL')
        ? localStorage.getItem('NODE_URL')
        : 'http://localhost:5001';
        if (apiUrl && urlCheck(apiUrl) && NODE_URL !== apiUrl) {
            NODE_URL = apiUrl;
        }
        if(NODE_URL){
            inputRef.current.value = NODE_URL;
        }
    }

      const getNodeUrl = () => {
        let node_url = inputRef.current.value.replace(/\s*/g, '');
        if (node_url.charAt(node_url.length - 1) === '/') {
          node_url = node_url.substr(0, node_url.length - 1);
        }
        if (!urlCheck(node_url)) {
          return null;
        }
        return node_url;
      };

    const save = async (e, wallet) => {
        e.preventDefault();
        e.stopPropagation();
        const node_url = getNodeUrl();
        if (!node_url) return;
        localStorage.setItem('NODE_URL', node_url);
        Emitter.emit('handleEndpoint', node_url);
    };

    // const handleChange = (e) => {
    //     setEndpoint(e.target.value);
    // };

    useEffect(() => {
        getEndpoint()
    }, []);

    return (
        <div className="flex flex-col max-w-450px  justify-center login-form-w  ">
            <div className=" min-h-400">
                <div className="login-title theme-text-main">{t('login')}</div>
                <div className="text-gray-900 text-sm font-bold mb-12 theme-text-sub-main">
                {t('login_endpoint_desc')}
                </div>
                <div className="mb-2 setting-header">
                <h5 className="font-bold theme-text-main" htmlFor="grid-password">
                  API {t('endpoint')}
                </h5>
                <Tooltip overlayInnerStyle={{ width: '340px' }} placement="top" title={<p>{t('copy_url_tips')}</p>}>
                  {/* <i className="far fa-question-circle ml-1 text-xs"></i> */}
                  <QuestionCircleOutlined className="inline-flex items-center ml-1 text-xs" />
                </Tooltip>
              </div>
                <input
                    type="text"
                    className="mr-2  common-input theme-bg theme-border-color theme-text-main login-form-w-334px"
                    defaultValue="http://localhost:5001"
                    ref={inputRef}
                    // onChange={handleChange}
                    placeholder="http://localhost:5001"
                />
                <button className="mt-5 common-btn theme-common-btn login-btn" type="button" onClick={save}>
                    {t('next')}
                </button>
            </div>
        </div>
    );
};

export default Endpoint;
