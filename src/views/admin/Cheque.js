import React, { useState, useCallback, useContext } from 'react';
import { Menu } from 'antd';
import { mainContext } from 'reducer';
import ChequeEarning from './ChequeEarning.js';
import ChequeExpense from './ChequeExpense.js';
import CashConfirmModal from 'components/Modals/CashConfirmModal.js';
import { t } from 'utils/text.js';

export default function Cheque() {
    const [current, setCurrent] = useState('chequeEarning');
    const { state } = useContext(mainContext);
    const { theme } = state;

    const handleClick = useCallback(e => {
        setCurrent(e.key);
    }, []);

    return (
        <>
            <div className="mb-2">
                <Menu
                    onClick={handleClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    style={{ background: 'transparent' }}
                    className="theme-border-color">
                    <Menu.Item key="chequeEarning" className='px-4'>
                        <h5 className={'mb-2'}>{t('cheque_earnings')}</h5>
                    </Menu.Item>
                    <Menu.Item key="chequeExpense" className='px-4'>
                        <h5 className={'mb-2'}>{t('cheque_expense')}</h5>
                    </Menu.Item>
                </Menu>
            </div>
            {current === 'chequeEarning' && <ChequeEarning color={theme} />}
            {current === 'chequeExpense' && <ChequeExpense color={theme} />}
            <CashConfirmModal color={theme} />
        </>
    );
}
