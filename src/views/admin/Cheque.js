import React, {useState, useCallback, useContext} from "react";
import {Menu} from 'antd';
import {mainContext} from "reducer";
import ChequeEarning from "./ChequeEarning.js";
import ChequeExpense from "./ChequeExpense.js";
import ConfirmModal from "components/Modals/ConfirmModal.js"
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function Cheque() {

    const [current, setCurrent] = useState('chequeEarning');
    const {state} = useContext(mainContext);
    const {theme} = state;

    const handleClick = useCallback(e => {
        setCurrent(e.key);
    }, []);

    return (
        <>
            <div className='mb-2'>
                <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"
                      style={{'background': 'transparent'}}>
                    <Menu.Item key="chequeEarning">
                        <h5 className={" uppercase font-bold " + themeStyle.title[theme]}>
                            {t('cheque_earnings')}
                        </h5>
                    </Menu.Item>
                    <Menu.Item key="chequeExpense">
                        <h5 className={" uppercase font-bold "  + themeStyle.title[theme]}>
                            {t('cheque_expense')}
                        </h5>
                    </Menu.Item>
                </Menu>
            </div>
            {current === 'chequeEarning' && <ChequeEarning color={theme}/>}
            {current === 'chequeExpense' && <ChequeExpense color={theme}/>}
            <ConfirmModal color={theme}/>
        </>
    );
}
