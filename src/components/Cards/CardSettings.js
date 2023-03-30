import React, { useState, useRef, useEffect, useContext } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { mainContext } from 'reducer';
import Emitter from 'utils/eventBus';
import { nodeStatusCheck, getPrivateKey, getRepo, setApiUrl } from 'services/otherService.js';
import { t } from 'utils/text.js';
import { urlCheck } from 'utils/checks.js';
import PathConfirmModal from 'components/Modals/PathConfirmModal.js';
import CardConfig from './CardConfig';
import ConfigConfirmModal from 'components/Modals/ConfigConfirmModal';
import ClipboardCopy from 'components/Utils/ClipboardCopy';
import { getParameterByName } from 'utils/BTFSUtil.js';

export default function CardSettings({ color }) {
  const apiUrl = getParameterByName('api', window.location.href);
  let NODE_URL = localStorage.getItem('NODE_URL')
    ? localStorage.getItem('NODE_URL')
    : 'http://localhost:5001';
  if (apiUrl && urlCheck(apiUrl) && NODE_URL !== apiUrl) {
    setApiUrl(apiUrl);
    NODE_URL = apiUrl;
  }
  const inputRef = useRef(null);
  const { dispatch } = useContext(mainContext);
  const pathRef = useRef(null);
  const [path, setPath] = useState('');
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (apiUrl) {
      nodeStatusCheck(apiUrl);
    }
    inputRef.current.value = NODE_URL;
    getPath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getCopyUrl = nodeUrl => {
    const curUrl = document.location.href;
    const splitUrlList = curUrl.split('?');
    const copyUrl = `${splitUrlList[0]}?api=${nodeUrl}`;
    return copyUrl;
  };
  const [copyUrl, setCopyUrl] = useState(getCopyUrl(NODE_URL));
  const reveal = async () => {
    let { privateKey } = await getPrivateKey();
    if (privateKey) {
      Emitter.emit('openMessageModal', { message: privateKey });
    } else {
      Emitter.emit('showMessageAlert', { message: 'api_not_set', status: 'error', type: 'frontEnd' });
    }
  };

  const getPath = async () => {
    let { path, size } = await getRepo();
    setPath(path);
    setVolume(size);
  };
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
  const save = async () => {
    const node_url = getNodeUrl();
    if (!node_url) return;
    const copyUrl = getCopyUrl(node_url);
    setCopyUrl(copyUrl);
    let result = await nodeStatusCheck(node_url);
    if (result) {
      window.nodeStatus = true;
      dispatch({
        type: 'SET_NODE_STATUS',
        nodeStatus: true,
      });
      getPath();
      Emitter.emit('showMessageAlert', { message: 'setting_success', status: 'success', type: 'frontEnd' });
    } else {
      setPath('');
      Emitter.emit('showMessageAlert', { message: 'setting_error', status: 'error', type: 'frontEnd' });
    }
  };

  const changePath = async e => {
    console.log('pathRef.current.value', pathRef.current.value);
    Emitter.emit('openPathConfirmModal', { type: 'init', path: pathRef.current.value, volume: volume });
  };

  const handleChange = () => {
    // const node_url = getNodeUrl();
    // if (!node_url) return;
    // const copyUrl = getCopyUrl(node_url);
    // setCopyUrl(copyUrl);
  };

  return (
    <div>
      {/* api end point */}
      <div className="mb-4 common-card theme-bg theme-text-main">
        <div className="mb-2 setting-header">
          <h5 className="font-bold theme-text-main" htmlFor="grid-password">
            API {t('endpoint')}
          </h5>
          <div className="input-group-append">
            <ClipboardCopy value={copyUrl} btnText={t('copy_url')}></ClipboardCopy>
          </div>
          <Tooltip overlayInnerStyle={{ width: '180px' }} placement="top" title={<p>{t('copy_url_tips')}</p>}>
            {/* <i className="far fa-question-circle ml-1 text-xs"></i> */}
            <QuestionCircleOutlined className="inline-flex items-center ml-1 text-xs" />
          </Tooltip>
        </div>
        <div className="flex">
          <input
            type="text"
            className="mr-2 common-input theme-bg theme-border-color"
            defaultValue="http://localhost:5001"
            ref={inputRef}
            onChange={handleChange}
          />
          <button className="ml-2 common-btn theme-common-btn" type="button" onClick={save}>
            {t('submit')}
          </button>
        </div>
      </div>

      {/* advanced settings */}
      <CardConfig color={color} />

      {/* storage path */}
      <div className="mb-4 common-card theme-bg theme-text-main">
        <div className="mb-2 setting-header">
          <h5 className="font-bold theme-text-main">{t('storage_path')}</h5>
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="common-input theme-bg theme-border-color"
            defaultValue={path}
            ref={pathRef}
          />
          <button className="ml-2 common-btn theme-common-btn" type="button" onClick={changePath}>
            {t('change')}
          </button>
        </div>
      </div>

      {/* security */}
      <div className="common-card theme-bg theme-text-main">
        <div className="mb-2 setting-header">
          <h5 className="font-bold theme-text-main">{t('security')}</h5>
        </div>
        <div className="flex justify-between">
          <div className="px-3.5 w-full h-9 border rounded-lg flex items-center text-sm leading-none transition-all theme-border-color theme-bg theme-text-sub-info">
            <span className='mr-2'>
              <i className="fa-solid fa-lock"></i>
            </span>
            <span>{t('private_key')}</span>
          </div>
          <button className="ml-2 common-btn theme-danger-btn" type="button" onClick={reveal} style={{minWidth: 'auto'}}>
            {t('reveal_key')}
          </button>
        </div>
      </div>

      <PathConfirmModal />
      <ConfigConfirmModal />
    </div>
  );
}
