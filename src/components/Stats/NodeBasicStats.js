import React, {useState, useEffect} from "react";
import {unstable_batchedUpdates} from 'react-dom'
import {useIntl} from "react-intl";
import {Tooltip} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getNodeBasicStats} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import {t, Truncate} from "utils/text.js";
import {btfsScanLinkCheck} from "utils/checks.js";
import {CHAIN_NAME} from "utils/constants.js";

export default function NodeBasicStats({color}) {

    const intl = useIntl();
    const [ID, setID] = useState('--');
    const [uptime, setUptime] = useState('--');
    const [peers, setPeers] = useState('--');
    const [version, setVersion] = useState('--');
    const [chain, setChain] = useState('--');
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('online');

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {ID, uptime, peers, version, status, message} = await getNodeBasicStats();
            if (!didCancel) {
                unstable_batchedUpdates(() => {
                    setID(ID);
                    setUptime(uptime);
                    setPeers(peers);
                    setVersion(version);
                    setChain(CHAIN_NAME[localStorage.getItem('CHAIN_ID')]);
                    setStatus(status);
                    setMessage(message);
                })
            }
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);


    return (
        <>
            <div className="relative pb-4">
                <div className="mx-auto w-full">
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-6/12 xl:w-3/12 md:pr-2 md:mb-2 xl:mb-0">
                            <div
                                className={"relative break-words rounded  " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="flex items-center p-4 h-125-px">
                                    <div className="relative w-3/4 h-75-px flex flex-col justify-between">
                                        <h5 className={"uppercase font-bold mb-4 " + themeStyle.title[color]}>
                                            {t('host_id')}
                                            <ClipboardCopy value={ID}/>
                                        </h5>
                                        <div className="font-semibold">
                                            <a href={btfsScanLinkCheck() + '/#/node/' + ID} target='_blank'
                                               rel='noreferrer'>
                                                <Truncate>
                                                    {ID}
                                                </Truncate>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="relative w-1/4 flex justify-center">
                                        <div
                                            className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-500">
                                            <i className="fas fa-fingerprint"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 xl:w-3/12 md:pl-2 xl:pr-2 md:mb-2 xl:mb-0">
                            <div
                                className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="flex items-center p-4 h-125-px">
                                    <div className="relative w-3/4 h-75-px flex flex-col justify-between">
                                        <h5 className={"uppercase font-bold mb-4 " + themeStyle.title[color]}>
                                            {t('host_version')}
                                        </h5>
                                        <div className="font-semibold">
                                            {version} - {chain}
                                        </div>
                                    </div>
                                    <div className="relative w-1/4 flex justify-center">
                                        <div
                                            className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-orange-500">
                                            <i className="fas fa-code-branch"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 xl:w-3/12 xl:pl-2 md:pr-2">
                            <div
                                className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="flex items-center p-4 h-125-px">
                                    <div className="relative w-3/4 h-75-px flex flex-col justify-between">
                                        <h5 className={"uppercase font-bold mb-4 " + themeStyle.title[color]}>
                                            {t('status')}
                                        </h5>
                                        {
                                            status === 1 && <div className="font-semibold text-green-500 cursor-default">
                                                <i className="fas fa-circle mr-2"></i>
                                                <span>{t('online')} - {peers} {t('connected')}</span>
                                            </div>
                                        }
                                        {
                                            status === 2 &&
                                            <div className="font-semibold text-orange-500 cursor-default">
                                                <Tooltip placement="bottom" title={<span>{intl.formatMessage({id: message[0]})} <br/> {intl.formatMessage({id: message[1]})}</span>}>
                                                    <i className="fas fa-circle mr-2"></i>
                                                    <span>{t('network_unstable')}</span>
                                                </Tooltip>
                                            </div>
                                        }
                                        {
                                            status === 3 &&
                                            <div className="font-semibold text-orange-500 cursor-default">
                                                <Tooltip placement="bottom"
                                                         title={<span>{intl.formatMessage({id: message[0]})}  <br/>  {intl.formatMessage({id: message[1]})}  <br/>  {intl.formatMessage({id: message[2]})}</span>}>
                                                    <i className="fas fa-circle mr-2"></i>
                                                    <span>{t('network_unstable')}</span>
                                                </Tooltip>
                                            </div>
                                        }
                                    </div>
                                    <div className="relative w-1/4 flex justify-center">
                                        <div
                                            className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-lightBlue-500">
                                            <i className="fas fa-signal"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 xl:w-3/12 xl:pl-2 md:pl-2">
                            <div
                                className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                <div className="flex items-center p-4 h-125-px">
                                    <div className="relative w-3/4 h-75-px flex flex-col justify-between">
                                        <h5 className={"uppercase font-bold mb-4 " + themeStyle.title[color]}>
                                            {t('uptime')}
                                        </h5>
                                        <div className="font-semibold">
                                            {uptime} %
                                        </div>
                                    </div>
                                    <div className="relative w-1/4 flex justify-center">
                                        <div
                                            className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500">
                                            <i className="fab fa-ubuntu"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
