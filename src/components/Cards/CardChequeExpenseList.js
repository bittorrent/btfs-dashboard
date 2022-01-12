import React, {useState, useCallback, useRef} from "react";
import PropTypes from "prop-types";
import {Menu} from 'antd';
import ChequeExpenseTable from "components/Tables/ChequeExpenseTable.js"
import ChequeDetailTable from "components/Tables/ChequeDetailTable.js";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function CardChequeExpenseList({color}) {

    const [current, setCurrent] = useState('expenseList');

    const handleClick = useCallback(e => {
        console.log('click ', e.key);
        setCurrent(e.key);
    }, []);

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
                                    <Menu.Item key="expenseList">
                                        <h5 className={"uppercase font-bold " + themeStyle.title[color]}>
                                            {t('expense_list')}
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
                        current === 'expenseList' && <div className='pt-4 pl-4 flex items-center h-50-px'>
                            <div className='flex-grow flex-1'>
                                <h3 className={"font-semibold " + themeStyle.text[color]}>
                                    Sent amount will be accumulated by Vaults.
                                </h3>
                            </div>
                        </div>
                    }

                </div>

                <div className="block w-full overflow-x-auto">
                    {
                        current === 'expenseList' && <ChequeExpenseTable color={color}/>
                    }
                    {
                        current === 'chequeDetail' && <ChequeDetailTable color={color} type='expense'/>
                    }
                </div>
            </div>
        </>
    );
}

CardChequeExpenseList.defaultProps = {
    color: "light",
};

CardChequeExpenseList.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
