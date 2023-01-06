import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import ChequeExpenseTable from 'components/Tables/ChequeExpenseTable.js';
import ChequeDetailTable from 'components/Tables/ChequeDetailTable.js';
import { t } from 'utils/text.js';

export default function CardChequeExpenseList({ color }) {
  const [current, setCurrent] = useState('expenseList');

  const handleClick = useCallback(e => {
    console.log('click ', e.key);
    setCurrent(e.key);
  }, []);

  return (
    <div className="flex flex-col break-words common-card theme-bg theme-text-main">
      <div className="mb-5 flex justify-between items-center">
        <div className="flex-1">
          <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            className="theme-border-color"
            style={{ background: 'transparent' }}>
            <Menu.Item key="expenseList" className="-ml-4">
              <h5 className={'font-bold theme-text-main'}>{t('expense_list')}</h5>
            </Menu.Item>
            <Menu.Item key="chequeDetail">
              <h5 className={'font-bold theme-text-main'}>{t('cheque_detail')}</h5>
            </Menu.Item>
          </Menu>
        </div>
        {/* {current === 'expenseList' && (
          <div className="pt-4 pl-4 flex items-center h-50-px">
            <div className="flex-grow flex-1">
              <h3 className={'font-semibold ' + themeStyle.text[color]}>{t('expense_list_tip')}</h3>
            </div>
          </div>
        )} */}
      </div>
      <div className="block w-full overflow-x-auto rounded-b-2xl">
        {current === 'expenseList' && <ChequeExpenseTable color={color} />}
        {current === 'chequeDetail' && <ChequeDetailTable color={color} type="expense" />}
      </div>
    </div>
  );
}

CardChequeExpenseList.defaultProps = {
  color: 'light',
};

CardChequeExpenseList.propTypes = {
  color: PropTypes.oneOf(['light', 'dark']),
};
