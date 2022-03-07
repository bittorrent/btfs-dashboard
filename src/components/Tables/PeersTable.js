/*eslint-disable*/
import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Pagination} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getPeers} from "services/otherService.js";
import {Truncate, t} from "utils/text.js"
import themeStyle from "utils/themeStyle.js";
import {ceilLatency} from "utils/BTFSUtil.js";
import {btfsScanLinkCheck} from "utils/checks.js";

let didCancel = false;
let peersAll = [];

export default function PeersTable({color}) {

    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [peers, setPeers] = useState(null);

    const fetchData = async () => {
        didCancel = false;
        let {peers} = await getPeers();
        if (!didCancel) {
            peersAll = peers;
            setTotal(peers.length);
            sliceDate(1);
            setCurrent(1);
        }
    };

    const sliceDate = (page) => {
        setPeers(peersAll.slice((page - 1) * 10, (page - 1) * 10 + 10));
    };

    const pageChange = useCallback((value) => {
        setCurrent(value);
        sliceDate(value);
    }, []);

    const mapFlag = (name) => {
        try {
            return require("assets/flags/" + name + ".png").default;
        } catch (e) {
            return ""
        }
    };

    useEffect(() => {
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-2 max-w-full flex-grow flex-1">
                            <h3 className={"font-semibold " + themeStyle.title[color]}>
                                {t('peers')} : {total}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr className="text-xs uppercase whitespace-nowrap">
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('location')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('latency')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('peer')} ID
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('connection')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {peers && peers.map((items, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                        {items['CountryShort'] !== '-' &&
                                        <img src={mapFlag(items['CountryShort'])}
                                             className="inline mr-2 mb-1" width="35"/>}
                                        <span>{items['CountryShort'] !== '-' ? items['CountryShort'] : '--'}</span>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {ceilLatency(items['Latency'])}
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={btfsScanLinkCheck() + '/#/node/' + items['Peer']} target='_blank'>
                                                {items['Peer']}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {items['Addr']}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    {
                        !peers && <div className='w-full flex justify-center pt-4'>
                            <img alt='loading' src={require('../../assets/img/loading.svg').default}
                                 style={{width: '50px', height: '50px'}}/>
                        </div>
                    }
                </div>
                <div>
                    <Pagination className={'float-right p-4 ' + color} simple current={current} total={total}
                                hideOnSinglePage={true}
                                onChange={pageChange}/>
                </div>
            </div>
        </>
    );
}

PeersTable.defaultProps = {
    color: "light",
};

PeersTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
