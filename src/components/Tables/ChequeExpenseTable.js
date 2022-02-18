/*eslint-disable*/
import React, {useEffect, useState, useCallback} from "react";
import PropTypes from "prop-types";
import {Pagination} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getChequeExpenseList} from "services/chequeService.js";
import {Truncate, t} from "utils/text.js"
import themeStyle from "utils/themeStyle.js";
import {switchBalanceUnit} from "utils/BTFSUtil.js";

let didCancel = false;
let chequesAll = [];

export default function ChequeExpenseTable({color}) {

    const [cheques, setCheques] = useState([]);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);

    const sliceDate = (page) => {
        setCheques(chequesAll.slice((page - 1) * 10, (page - 1) * 10 + 10));
    };

    const pageChange = useCallback((value) => {
        setCurrent(value);
        sliceDate(value);
    }, []);

    const updateTable = async () => {
        didCancel = false;
        let {cheques, total} = await getChequeExpenseList();
        if (!didCancel) {
            chequesAll = cheques;
            setTotal(total);
            sliceDate(1);
            setCurrent(1);
        }
    };

    useEffect(async () => {
        updateTable();
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <>
            <div
                className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " + themeStyle.bg[color]}>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr className="text-xs uppercase whitespace-nowrap">
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
                                {t('total_sent')} (WBTT)
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            cheques && cheques.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            <div className='flex'>
                                                <a href={'https://scan.btfs.io/#/node/' + item['PeerID']}
                                                   target='_blank'>
                                                    <Truncate>{item['PeerID']}</Truncate>
                                                </a>
                                                <ClipboardCopy value={item['PeerID']}/>
                                            </div>
                                        </td>
                                        <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            BTTC
                                        </td>
                                        <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            <div className='flex'>
                                                <a href={'https://bttcscan.com/address/' + item['Vault']}
                                                   target='_blank'>
                                                    <Truncate>{item['Vault']}</Truncate>
                                                </a>
                                                <ClipboardCopy value={item['Vault']}/>
                                            </div>
                                        </td>
                                        <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {switchBalanceUnit(item['Payout'])}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                    {
                        !cheques && <div className='w-full flex justify-center p-4'>
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
                        <Pagination className={'float-right p-4 ' + color} simple showTotal={true} current={current} total={total}
                                    hideOnSinglePage={true}
                                    onChange={pageChange}/>
                    </div>
                </div>
            </div>
        </>
    );
}

ChequeExpenseTable.defaultProps = {
    color: "light",
};

ChequeExpenseTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
