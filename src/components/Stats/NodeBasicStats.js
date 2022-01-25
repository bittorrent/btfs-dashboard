import React, {useState, useEffect} from "react";
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getNodeBasicStats} from "services/dashboardService.js";
import themeStyle from "utils/themeStyle.js";
import {t, Truncate} from "utils/text.js";

export default function NodeBasicStats({color}) {
    const [ID, setID] = useState('--');
    const [uptime, setUptime] = useState('--');
    const [peers, setPeers] = useState('--');

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            let {ID, uptime, peers} = await getNodeBasicStats();
            if (!didCancel) {
                setID(ID);
                setUptime(uptime);
                setPeers(peers);
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
                            <div className="w-full md:w-4/12 md:pr-2">
                                    <div className={"relative break-words rounded  " + themeStyle.bg[color] + themeStyle.text[color]}>
                                        <div className="flex items-center p-4 h-125-px">
                                            <div className="relative w-3/4 h-75-px flex flex-col justify-between">
                                                <h5 className={"uppercase font-bold mb-4 " + themeStyle.title[color]}>
                                                    {t('host_id')}
                                                    <ClipboardCopy value={ID}/>
                                                </h5>
                                                <div className="font-semibold">
                                                    <a href={'https://scan-test.btfs.io/#/node/' + ID} target='_blank' rel='noreferrer'>
                                                        <Truncate>
                                                            {ID}
                                                        </Truncate>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="relative w-1/4 flex justify-center">
                                                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-500">
                                                    <i className="fas fa-fingerprint"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="w-full md:w-4/12 md:pl-2 md:pr-2">
                                    <div className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                                        <div className="flex items-center p-4 h-125-px">
                                            <div className="relative w-3/4 h-75-px flex flex-col justify-between">
                                                <h5 className={"uppercase font-bold mb-4 " + themeStyle.title[color]}>
                                                    {t('status')}
                                                </h5>
                                                <div className="font-semibold">
                                                    {t('online')} - {peers} {t('connected')}
                                                </div>
                                            </div>
                                            <div className="relative w-1/4 flex justify-center">
                                                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-lightBlue-500">
                                                    <i className="fas fa-signal"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="w-full md:w-4/12 md:pl-2">
                                    <div className={"relative break-words rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
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
                                                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500">
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
