import React, {useState, useCallback, useRef} from "react";
import PropTypes from "prop-types";
import {useIntl} from 'react-intl';
import {Tooltip, Menu} from 'antd';
import ChequeCashingListTable from "components/Tables/ChequeCashingListTable.js"
import ChequeCashingHistoryTable from "components/Tables/ChequeCashingHistoryTable.js"
import ChequeDetailTable from "components/Tables/ChequeDetailTable.js";
import themeStyle from "utils/themeStyle.js";
import Emitter from "utils/eventBus";
import {t} from "utils/text.js";

export default function CardChequeEarningList({color}) {
    const intl = useIntl();
    const cashList = useRef([]);
    const [current, setCurrent] = useState('cashList');
    const [cashStatus, setCashStatus] = useState(false);

    const handleClick = useCallback(e => {
        console.log('click ', e.key);
        setCurrent(e.key);
    }, []);

    const enableCash = useCallback((flag, id, amount, cancel) => {
        if (flag) {
            if (amount > 0) {
                cashList.current.push({
                    id: id,
                    amount: amount
                });
                setCashStatus(flag);
            }
        } else {
            cashList.current = cashList.current.filter((ele) => {
                return id !== ele.id
            });
            if (cashList.current.length) {
                setCashStatus(true);
            } else {
                setCashStatus(false);
            }
        }
        if (cancel) {
            cashList.current = [];
            setCashStatus(false);
        }
    }, []);

    const _cash = () => {
        if (cashList.current.length > 0) {
            Emitter.emit('openConfirmModal', {data: cashList.current});
        }
    };

    return (

        <>
            <div
                className={
                    "relative flex flex-col min-w-0 break-words w-full shadow-lg rounded mt-4 " +
                    themeStyle.bg[color] + ' ' + themeStyle.text[color]
                }
            >
                <div className="rounded-t mb-0 px-2 py-4 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <div className="mr-4">
                                <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"
                                      style={{'background': 'transparent'}}>
                                    <Menu.Item key="cashList">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('cheque_cashing_list')}
                                        </h5>
                                    </Menu.Item>
                                    <Menu.Item key="cashHistory">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('cheque_cashing_history')}
                                        </h5>
                                    </Menu.Item>
                                    <Menu.Item key="chequeDetail">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('cheque_detail')}
                                        </h5>
                                    </Menu.Item>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {
                        current === 'cashList' && <div className='pt-4 pl-4 flex items-center h-50-px'>
                            <div className='flex-grow flex-1'>
                                <h3 className={"font-semibold " + themeStyle.text[color]}>
                                    {t('cashing_list_tip')}
                                </h3>
                            </div>
                            <button
                                className={"mr-4 border text-xs font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 " + (cashStatus ? ' bg-indigo-500 text-white active:bg-indigo-600 active:text-white' : themeStyle.bg[color])}
                                type="button"
                                style={{width: '120px'}}
                                onClick={() => {
                                    _cash()
                                }}
                            >
                                {t('cash')}
                            </button>
                        </div>
                    }

                </div>

                <div className="block w-full overflow-x-auto">
                    {
                        current === 'cashList' && <ChequeCashingListTable enableCash={enableCash} color={color}/>
                    }
                    {
                        current === 'cashHistory' && <ChequeCashingHistoryTable color={color}/>
                    }
                    {
                        current === 'chequeDetail' && <ChequeDetailTable color={color} type='earning'/>
                    }
                </div>
            </div>
        </>
    );
}

CardChequeEarningList.defaultProps = {
    color: "light",
};

CardChequeEarningList.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
