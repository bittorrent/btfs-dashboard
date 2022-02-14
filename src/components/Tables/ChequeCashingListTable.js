/*eslint-disable*/
import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import {Pagination} from 'antd';
import ClipboardCopy from "components/Utils/ClipboardCopy";
import {getChequeCashingList} from "services/chequeService.js";
import {Truncate, t} from "utils/text.js"
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";
import {switchBalanceUnit} from "utils/BTFSUtil.js";

let didCancel = false;

export default function ChequeCashingListTable({color, enableCash}) {

    const [cheques, setCheques] = useState(null);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);

    const select = (e, id, amount) => {
        enableCash(e.target.checked, id, amount);
    };

    const unSelect = () => {
        enableCash(false, null, null, true);
        let checkbox = document.getElementsByName('checkbox');
        checkbox.forEach((item) => {
            item.checked = "";
        })
    };

    const pageChange = useCallback((page) => {
        updateTable(page);
    }, []);

    const updateTable = async (page) => {
        didCancel = false;
        let {cheques, total} = await getChequeCashingList((page - 1) * 10, 10);
        if (!didCancel) {
            setCheques(cheques);
            setTotal(total);
            setCurrent(page);
            unSelect();
        }
    };

    useEffect(() => {
        const set = async function () {
            setTimeout(() => {
                updateTable(1);
            }, 1000);
        };
        Emitter.on("updateCashingList", set);
        return () => {
            Emitter.removeListener('updateCashingList');
        }
    }, []);

    useEffect(() => {
        updateTable(1);
        return () => {
            didCancel = true;
        };
    }, []);

    return (

        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " + themeStyle.bg[color] + ' ' + themeStyle.text[color]}>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr className="text-xs uppercase whitespace-nowrap">
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}
                                style={{width: '50px'}}>
                            </th>
                            <th className={"px-6 border border-solid py-3  border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('host_id')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('blockchain')}
                            </th>
                            <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                {t('chequebook')}
                            </th>
                            <th className={"cursor-pointer px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                <div className='flex items-center'>
                                    <div>{t('uncashed')} (WBTT)</div>
                                </div>
                            </th>
                            <th className={"cursor-pointer px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                                <div className='flex items-center'>
                                    <div>{t('cashed')} (WBTT)</div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {cheques && cheques.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <input
                                            type="checkbox" name="checkbox"
                                            className={"bg-gray form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150 "}
                                            onClick={(e) => {
                                                select(e, item['PeerID'], (item['Payout'] - item['CashedAmount']))
                                            }}
                                        />
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className='flex'>
                                            <a href={'https://scan-test.btfs.io/#/node/' + item['PeerID']} target='_blank'>
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
                                            <a href={'https://testnet.bttcscan.com/#/address/' + item['Vault']} target='_blank'>
                                                <Truncate>{item['Vault']}</Truncate>
                                            </a>
                                            <ClipboardCopy value={item['Vault']}/>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {switchBalanceUnit((item['Payout'] - item['CashedAmount']))}
                                    </td>
                                    <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {switchBalanceUnit(item['CashedAmount'])}
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

ChequeCashingListTable.defaultProps = {
    color: "light",
};

ChequeCashingListTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
