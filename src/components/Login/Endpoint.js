import React, { useContext,useState ,useRef,useEffect} from 'react';
import { mainContext } from 'reducer';
import { Dropdown, Menu } from 'antd';
import themeStyle from 'utils/themeStyle.js';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Emitter from 'utils/eventBus';

import { nodeStatusCheck, getPrivateKey, getRepo, setApiUrl } from 'services/otherService.js';
import { urlCheck } from 'utils/checks.js';

import { Tooltip } from 'antd';
import { Truncate } from 'utils/text.js';
import { t } from 'utils/text.js';
import ClipboardCopy from 'components/Utils/ClipboardCopy';




const Endpoint = ({ color }) => {
    // const { dispatch, state } = useContext(mainContext);
    // const { account } = state;
    const inputRef = useRef(null);
    const { dispatch, state } = useContext(mainContext);
    const [endpoint, setEndpoint] = useState('');
    const [loading, setLoading] = useState(false);


    const getEndpoint = ()=>{
        const NODE_URL = localStorage.getItem('NODE_URL');
        console.log(NODE_URL)
        if(NODE_URL){
            inputRef.current.value = NODE_URL;
        }
        // const isMainMode = await getPageMode();
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
        const node_url2 = getNodeUrl();
        Emitter.emit('handleEndpoint', node_url2);
        return
        const node_url = getNodeUrl();
        if (!node_url) return;
        let result = await nodeStatusCheck(node_url);
        if (result) {
          window.nodeStatus = true;
          dispatch({
            type: 'SET_NODE_STATUS',
            nodeStatus: true,
          });
        //   getPath();
        //   Emitter.emit('showMessageAlert', { message: 'setting_success', status: 'success', type: 'frontEnd' });
        //   Emitter.emit('getHostId')
          Emitter.emit('handleEndpoint', node_url);
        } else {
        //   setPath('');
        //   Emitter.emit('showMessageAlert', { message: 'setting_error', status: 'error', type: 'frontEnd' });
        }
        //   Emitter.emit('handleEndpoint', {});
        //   Emitter.emit('handleEndpoint', { checked, parentIndex, childIndex });
    };

    const handleChange = (e) => {
        setEndpoint(e.target.value);
    };

    useEffect(() => {
        getEndpoint()
    }, []);

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
                    ref={inputRef}
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
