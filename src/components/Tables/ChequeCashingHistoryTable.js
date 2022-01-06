import React, {useState} from "react";
import PropTypes from "prop-types";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function ChequeCashingHistoryTable({color}) {

    const [uncashedOrder, setUncashedOrder] = useState('default');
    const [cashedOrder, setCashedOrder] = useState('default');

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

    return (

        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full shadow-lg rounded " + themeStyle.bg[color]}>

                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr className="text-xs uppercase whitespace-nowrap">
                        <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}
                            style={{width: '50px'}}>
                           #
                        </th>

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
                            {t('date')}
                        </th>

                        <th className={"px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left " + themeStyle.th[color]}>
                            {t('status')}
                        </th>

                    </tr>
                    </thead>
                    <tbody>


                    </tbody>
                </table>

                <div className='w-full flex justify-center p-4'>
                    {t('coming_soon')}
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
