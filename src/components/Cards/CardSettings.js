/*eslint-disable*/
import React, {useRef, useEffect, useContext} from "react";
import {mainContext} from 'reducer';
import Emitter from "utils/eventBus";
import {setClient} from "services/filesService.js";
import {nodeStatusCheck, setApiUrl, getPrivateKey} from "services/otherService.js";
import {t} from "utils/text.js";
import themeStyle from "utils/themeStyle.js";
import {urlCheck} from "utils/checks.js";

export default function CardSettings({color}) {

    const NODE_URL = localStorage.getItem('NODE_URL') ? localStorage.getItem('NODE_URL') : 'http://localhost:5001';
    const inputRef = useRef(null);
    const {dispatch} = useContext(mainContext);

    useEffect(() => {
        inputRef.current.value = NODE_URL;
    }, []);

    const reveal = async () => {
        let {privateKey} = await getPrivateKey();
        if (privateKey) {
            Emitter.emit("openMessageModal", {message: privateKey});
        } else {
            Emitter.emit('showMessageAlert', {message: 'api_not_set', status: 'error', type: 'frontEnd'});
        }
    };

    const save = async () => {
        let node_url = inputRef.current.value.replace(/\s*/g, "");
        if (node_url.charAt(node_url.length - 1) === '/') {
            node_url = node_url.substr(0, node_url.length - 1);
        }
        if (!urlCheck(node_url)) {
            //   return;
        }
        let result = await nodeStatusCheck(node_url);
        if (result) {
            setApiUrl(node_url);
            setClient(node_url);
            window.nodeStatus = true;
            dispatch({
                type: 'SET_NODE_STATUS',
                nodeStatus: true
            });
            localStorage.setItem('NODE_URL', node_url);
            Emitter.emit('showMessageAlert', {message: 'setting_success', status: 'success', type: 'frontEnd'});
        } else {
            Emitter.emit('showMessageAlert', {message: 'setting_error', status: 'error', type: 'frontEnd'});
        }
    };

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
                        <label
                            className="block uppercase text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            API {t('endpoint')}
                        </label>
                        <input
                            type="text"
                            className={"border px-3 py-3 placeholder-blueGray-300 rounded text-sm shadow focus:outline-none focus:ring w-full " + themeStyle.bg[color]}
                            defaultValue="http://localhost:5001"
                            ref={inputRef}
                        />
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
            </div>
        </>
    );
}
