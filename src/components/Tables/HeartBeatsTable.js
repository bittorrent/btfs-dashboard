/*eslint-disable*/
import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Pagination} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getHeartBeatsReportlist} from "services/dashboardService.js";
import {Truncate, t} from "utils/text.js"
import themeStyle from "utils/themeStyle.js";
import {ceilLatency} from "utils/BTFSUtil.js";
import {btfsScanLinkCheck} from "utils/checks.js";

let didCancel = false;
// let peersAll = [];

export default function HeartBeatsTable({color}) {

    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    const [list, setList] = useState(null);
    const [peerId, setPeerId] = useState('')

    const pageChange = useCallback((page) => {
        updateTable(page);
    }, []);

    const updateTable = async (page) => {
        didCancel = false;
        let {records, total, peer_id} = await getHeartBeatsReportlist((page - 1) * 10, 10);
        if (!didCancel) {
            setList(records);
            setTotal(total);
            setCurrent(page);
            setPeerId(peer_id)
        }
    };

    useEffect(() => {
        updateTable(1);
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " + themeStyle.bg[color] + themeStyle.text[color]}>
                <div className="rounded-t mb-0 p-4 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-2 max-w-full flex-grow flex-1">
                            <h3 className={"font-semibold " + themeStyle.title[color]}>
                                {t('transaction_list')}
                            </h3>
                            <span>
                                {t('gas_spend_des')}
                            </span>
                        </div>
                        {peerId && <a href={`https://scan.btfs.io/#/node/${peerId}`} target="_blank">
                            {t('heart_to_scan')}
                        </a>}
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr className="text-xs uppercase whitespace-nowrap">
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('heart_th_time')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('heart_th_txhash')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('heart_th_from')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('heart_th_contract')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('heart_th_nonce')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {list && list.map((items, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                        <span>{items['report_time']}</span>
                                    </td>
                                    {/* <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {ceilLatency(items['Latency'])}
                                    </td> */}
                                    {/* <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={btfsScanLinkCheck() + '/#/node/' + items['Peer']} target='_blank'>
                                                {items['Peer']}
                                            </a>
                                        </div>
                                    </td> */}
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <a href={'https://bttcscan.com/tx/' + items['tx_hash']} target='_blank'>
                                            <Truncate>{items['tx_hash']}</Truncate>
                                        </a>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <a href={'https://bttcscan.com/address/' + items['bttc_addr']} target='_blank'>
                                            <Truncate>{items['bttc_addr']}</Truncate>
                                        </a>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <a href={'https://bttcscan.com/address/' + items['status_contract']} target='_blank'>
                                            <Truncate>{items['status_contract']}</Truncate>
                                        </a>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {items['nonce']}(+{items['increase_nonce']})
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    {
                        !list && <div className='w-full flex justify-center pt-4'>
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

HeartBeatsTable.defaultProps = {
    color: "light",
};

HeartBeatsTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
