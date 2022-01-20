import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Pagination} from 'antd';
import {getChequeReceivedDetailList, getChequeSentDetailList} from "services/chequeService.js";
import ClipboardCopy from "../Utils/ClipboardCopy";
import themeStyle from "utils/themeStyle.js";
import {Truncate, t} from "utils/text.js"
import {switchBalanceUnit} from "utils/BTFSUtil.js";

let didCancel = false;

export default function ChequeDetailTable({color, type}) {

    const [uncashedOrder, setUncashedOrder] = useState('default');
    const [cashedOrder, setCashedOrder] = useState('default');
    const [cheques, setCheques] = useState(null);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);

    const sorting = async (tag, order) => {
        if (tag === 'uncashed') {
            setCashedOrder('default');
            setUncashedOrder(order);
        }
        if (tag === 'cashed') {
            setUncashedOrder('default');
            setCashedOrder(order);
        }
    };

    const pageChange = useCallback((page) => {
        updateTable(page);
    }, []);

    const updateTable = async (page) => {
        didCancel = false;
        let data;
        if (type === 'earning') {
            data = await getChequeReceivedDetailList((page - 1) * 10, 10);
        }
        if (type === 'expense') {
            data = await getChequeSentDetailList((page - 1) * 10, 10);
        }

        console.log(data);

        let {cheques, total} = data;

        if (!didCancel) {
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
                                {type === 'earning' && t('chequebook')}
                                {type === 'expense' && t('recipient')}
                            </th>
                            <th className={"cursor-pointer px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}
                                onClick={() => {
                                    sorting('uncashed', uncashedOrder === 'ascending' ? 'descending' : 'ascending')
                                }}
                            >
                                <div className='flex items-center'>
                                    <div>{t('amount')} (WBTT)</div>
                                    <div className='flex flex-col ml-4'>
                                        <i className={"fas fa-sort-up line-height-7px " + ((uncashedOrder === 'ascending') ? 'text-blue' : '')}></i>
                                        <i className={"fas fa-sort-down line-height-7px " + ((uncashedOrder === 'descending') ? 'text-blue' : '')}></i>
                                    </div>
                                </div>
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {type === 'earning' && t('receive')}
                                {type === 'expense' && t('send')}
                                &nbsp;{t('date')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        {cheques && cheques.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={'https://scan-test.btfs.io/#/node/' + item['PeerId']} target='_blank'>
                                                <Truncate>{item['PeerId']}</Truncate>
                                            </a>
                                            <ClipboardCopy value={item['PeerId']}/>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        BTTC
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={'https://testscan.bt.io/#/address/' + item['Vault']} target='_blank'>
                                                <Truncate>{item['Vault']}</Truncate>
                                            </a>
                                            <ClipboardCopy value={item['Vault']}/>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {switchBalanceUnit(item['Amount'])}
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {new Date(item['Time']*1000).toLocaleString()}
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
                        <Pagination className='float-right p-4' simple current={current} total={total}
                                    hideOnSinglePage={true}
                                    onChange={pageChange}/>
                    </div>
                </div>
            </div>
        </>
    );
}

ChequeDetailTable.defaultProps = {
    color: "light",
};

ChequeDetailTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
