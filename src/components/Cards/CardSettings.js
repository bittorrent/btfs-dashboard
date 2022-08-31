/*eslint-disable*/
import React, {useState, useRef, useEffect, useContext} from "react";
import {Tooltip} from 'antd';
import {mainContext} from 'reducer';
import Emitter from "utils/eventBus";
import {nodeStatusCheck, getPrivateKey, getRepo, setApiUrl} from "services/otherService.js";
import {t} from "utils/text.js";
import themeStyle from "utils/themeStyle.js";
import {urlCheck} from "utils/checks.js";
import PathConfirmModal from "components/Modals/PathConfirmModal.js";
import CardConfigList from './CardConfigList';
import ConfigConfirmModal from 'components/Modals/ConfigConfirmModal';
import {Link} from "react-router-dom";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getParameterByName} from  "utils/BTFSUtil.js";

export default function CardSettings({color}) {
    const apiUrl = getParameterByName("api",location.href);
    let NODE_URL = localStorage.getItem('NODE_URL') ? localStorage.getItem('NODE_URL') : 'http://localhost:5001';
    if(apiUrl && urlCheck(apiUrl) && NODE_URL!==apiUrl){
        setApiUrl(apiUrl);
        NODE_URL = apiUrl;
    }
    const inputRef = useRef(null);
    const {dispatch} = useContext(mainContext);
    const pathRef = useRef(null);
    const [path, setPath] = useState('');
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        if(apiUrl){
          nodeStatusCheck(apiUrl);
        }
        inputRef.current.value = NODE_URL;
        getPath();
    }, []);
    const getCopyUrl = (nodeUrl) => {
        const curUrl = document.location.href;
        const splitUrlList = curUrl.split('?')
        const copyUrl = `${splitUrlList[0]}?api=${nodeUrl}`;
        return copyUrl;
    }
    const [copyUrl,setCopyUrl] = useState(getCopyUrl(NODE_URL));
    const reveal = async () => {
        let {privateKey} = await getPrivateKey();
        if (privateKey) {
            Emitter.emit("openMessageModal", {message: privateKey});
        } else {
            Emitter.emit('showMessageAlert', {message: 'api_not_set', status: 'error', type: 'frontEnd'});
        }
    };

    const getPath = async () => {
        let {path, size} = await getRepo();
        setPath(path);
        setVolume(size);
    };
    const getNodeUrl = () => {
        let node_url = inputRef.current.value.replace(/\s*/g, "");
        if (node_url.charAt(node_url.length - 1) === '/') {
            node_url = node_url.substr(0, node_url.length - 1);
        }
        if (!urlCheck(node_url)) {
            return null;
        }
        return node_url;
    }
    const save = async () => {
        const node_url = getNodeUrl();
        if(!node_url) return;
        let result = await nodeStatusCheck(node_url);
        if (result) {
            window.nodeStatus = true;
            dispatch({
                type: 'SET_NODE_STATUS',
                nodeStatus: true
            });
            getPath();
            Emitter.emit('showMessageAlert', {message: 'setting_success', status: 'success', type: 'frontEnd'});
        } else {
            setPath('');
            Emitter.emit('showMessageAlert', {message: 'setting_error', status: 'error', type: 'frontEnd'});
        }
    };

    const changePath = async (e) => {
        console.log('pathRef.current.value', pathRef.current.value)
        Emitter.emit('openPathConfirmModal', {type: 'init', path: pathRef.current.value, volume: volume});
        // let {Type, Message} = await changeRepo(pathRef.current.value.replace(/\s*/g, ""), volume);
        // if (Type === 'error') {
        //     Emitter.emit('showMessageAlert', {message: Message, status: 'error'});
        // } else {
        //     Emitter.emit('showMessageAlert', {message: 'change_success', status: 'success'});
        // }
    };

    const handleResetDefault = () => {
        Emitter.emit('openConfigConfirmModal', {});
    }
    const handleChange = () => {
        const node_url = getNodeUrl();
        if(!node_url) return;
        const copyUrl = getCopyUrl(node_url);
        setCopyUrl(copyUrl)
    }

    return (
        <>
            <div>
                <div className={"mb-4 shadow-lg rounded-lg border-0 " + themeStyle.bg[color] + themeStyle.text[color]}>
                    <div className="rounded-t mb-0 px-6 py-6 flex justify-between">
                        <h5 className={"font-bold uppercase " + themeStyle.title[color]}>
                            {t('system_config')}
                        </h5>
                        <button
                            className="bg-indigo-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1"
                            type="button"
                            onClick={save}
                        >
                            {t('submit')}
                        </button>
                    </div>
                    <div className="px-8 pb-6">
                        <div className="flex justify-between">
                            <label
                            className="block uppercase text-xs font-bold mb-2"
                            htmlFor="grid-password"
                            >
                                API {t('endpoint')}
                            </label>
                            
                            <div className="input-group-append">
                            <ClipboardCopy value={copyUrl} btnText={t('copy_url')}></ClipboardCopy>
                            <Tooltip overlayInnerStyle={{width: '180px'}}  placement="top"
                                title={<p>{t('copy_url_tips')}</p>}>
                                <i className="fas fa-info-circle ml-1 text-xs"></i>
                            </Tooltip>
                            </div>
                            
                        </div>
                        <input
                            type="text"
                            className={"border px-3 py-3 placeholder-blueGray-300 rounded text-sm shadow focus:outline-none focus:ring w-full " + themeStyle.bg[color]}
                            defaultValue="http://localhost:5001"
                            ref={inputRef}
                            onChange={handleChange}
                        />
                    </div>
                </div>


                <div
                    className={"mb-4 shadow-lg rounded-lg border-0 " + themeStyle.bg[color] + themeStyle.text[color]}>
                    <div className="rounded-t mb-0 px-6 py-6">
                        <h5 className={"font-bold uppercase " + themeStyle.title[color]}>
                            {t('storage_path')}
                        </h5>
                    </div>
                    <div className="px-8 pb-6 flex justify-between">
                        <input
                            type="text"
                            className={"border px-3 py-3 placeholder-blueGray-300 rounded text-sm shadow focus:outline-none focus:ring w-full " + themeStyle.bg[color]}
                            defaultValue={path}
                            ref={pathRef}
                        />
                        <button
                            className="bg-indigo-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ml-2"
                            type="button"
                            onClick={changePath}
                        >
                            {t('change')}
                        </button>
                    </div>
                </div>
                <div
                    className={"mb-4 shadow-lg rounded-lg border-0 " + themeStyle.bg[color] + themeStyle.text[color]}>
                    <div className="rounded-t mb-0 px-6 py-6 flex justify-between">
                        <div className="flex items-center">
                            <h5 className={"font-bold uppercase " + themeStyle.title[color]}>
                                {t('advance_config')}
                            </h5>
                            <Tooltip placement="top"
                                    title={<p>{t('advance_config_tips')}</p>}>
                                <i className="fas fa-info-circle ml-1 text-xs"></i>
                            </Tooltip>
                        </div>
                        <div>
                        <button
                            className="bg-indigo-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ml-2"
                            type="button"
                            onClick={handleResetDefault}
                        >
                            {t('reset_default')}
                        </button>
                        <Link to={{
                            search: "?fileDetail=1",
                            state: { fromDashboard: true }
                        }}>
                            <button
                                className="bg-indigo-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ml-2"
                                type="button"
                            >
                                {t('view_config_file')}
                            </button>
                        </Link>
                       
                        </div>
                    </div>
                    <div className="px-8 pb-6">
                        <CardConfigList color={color} />
                    </div>
                </div>


                <div className={"shadow-lg rounded-lg border-0 " + themeStyle.bg[color] + themeStyle.text[color]}>
                    <div className="rounded-t mb-0 px-6 py-6">
                        <h5 className={"font-bold uppercase " + themeStyle.title[color]}>
                            {t('security')}
                        </h5>
                    </div>
                    <div className="px-8 pb-6">
                        <button
                            className="bg-indigo-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1"
                            type="button"
                            onClick={reveal}
                        >
                            {t('reveal_key')}
                        </button>
                    </div>
                </div>

                <PathConfirmModal color={theme}/>
                <ConfigConfirmModal color={theme}/>
            </div>

        </>
    );
}
