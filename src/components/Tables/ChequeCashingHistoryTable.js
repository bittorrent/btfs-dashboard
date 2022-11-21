/*eslint-disable*/
import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Pagination} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getChequeCashingHistoryList} from "services/chequeService.js";
import {Truncate, t} from "utils/text.js"
import themeStyle from "utils/themeStyle.js";
import {switchBalanceUnit} from "utils/BTFSUtil.js";
import {btfsScanLinkCheck, bttcScanLinkCheck} from "utils/checks.js";

let didCancel = false;

export default function ChequeCashingHistoryTable({color}) {

    const [cheques, setCheques] = useState(null);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);

    const pageChange = useCallback((page) => {
        updateTable(page);
    }, []);

    const updateTable = async (page) => {
        didCancel = false;
        let {cheques, total} = await getChequeCashingHistoryList((page - 1) * 10, 10);
        if (!didCancel) {
            // TO DO
            cheques.forEach(item=>{
                item.icon = 'trx';
                item.unit = 'TRX';
            })
            setCheques(cheques);
            setTotal(total);
            setCurrent(page);
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
            <div
                className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " + themeStyle.bg[color] + ' ' + themeStyle.text[color]}>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr className="text-xs uppercase whitespace-nowrap">
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('tx_hash')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('host_id')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('blockchain')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('chequebook')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('currency_type')}
                            </th>
                            <th className={"cursor-pointer px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                <div className='flex items-center'>
                                    {/* <div>{t('amount')} (WBTT)</div> */}
                                    <div>{t('amount')}</div>
                                </div>
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('date')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('status')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        {cheques && cheques.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={bttcScanLinkCheck() + '/tx/' + item['tx_hash']}
                                               target='_blank'>
                                                <Truncate>{item['tx_hash']}</Truncate>
                                            </a>
                                            <ClipboardCopy value={item['tx_hash']}/>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={btfsScanLinkCheck() + '/#/node/' + item['peer_id']}
                                               target='_blank'>
                                                <Truncate>{item['peer_id']}</Truncate>
                                            </a>
                                            <ClipboardCopy value={item['peer_id']}/>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        BTTC
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={bttcScanLinkCheck() + '/address/' + item['vault']}
                                               target='_blank'>
                                                <Truncate>{item['vault']}</Truncate>
                                            </a>
                                            <ClipboardCopy value={item['vault']}/>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 flex items-center">
                                        <img
                                            src={
                                                require(`assets/img/${item.icon}.svg`).default
                                            }
                                            alt=""
                                            className="mr-2"
                                            />
                                        {item.unit}
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {switchBalanceUnit(item['amount'])}
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {new Date(item['cash_time']*1000).toLocaleString()}
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {item['status']}
                                    </td>
                                </tr>
                            )
                        })}

                        </tbody>
                    </table>
                    {
                        !cheques && <div className='w-full flex justify-center pt-4'>
                            <img alt='loading' src={require('../../assets/img/loading.svg').default}
                                 style={{width: '50px', height: '50px'}}/>
                        </div>
                    }
                    {
                        (cheques && total === 0) && <div className='w-full flex justify-center p-4'>
                            {t('no_data')}
                        </div>
                    }
                </div>
                <div className='flex justify-between items-center'>
                    <div className='p-4'>Total: {total}</div>
                    <div>
                        <Pagination className={'float-right p-4 ' + color} simple current={current} total={total}
                                    hideOnSinglePage={true}
                                    onChange={pageChange}/>
                    </div>
                </div>

            </div>
        </>
    );
}

ChequeCashingHistoryTable.defaultProps = {
    color: "light",
};

ChequeCashingHistoryTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
