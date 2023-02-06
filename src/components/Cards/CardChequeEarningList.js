import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import ChequeCashingListTable from 'components/Tables/ChequeCashingListTable.js';
import ChequeCashingHistoryTable from 'components/Tables/ChequeCashingHistoryTable.js';
import ChequeDetailTable from 'components/Tables/ChequeDetailTable.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

export default function CardChequeEarningList({ color }) {
    const cashList = useRef([]);
    const [current, setCurrent] = useState('cashList');
    const [cashStatus, setCashStatus] = useState(false);

    const handleClick = useCallback(e => {
        console.log('click ', e.key);
        setCurrent(e.key);
    }, []);

    const enableCash = useCallback((flag, id, amount, cancel, selectItemData) => {
        if (flag) {
            if (amount > 0) {
                cashList.current.push({
                    id: id,
                    amount: amount,
                    selectItemData,
                    currencyType: selectItemData.key,
                });
                setCashStatus(flag);
            }
        } else {
            cashList.current = cashList.current.filter(ele => {
                return id !== ele.id;
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
            Emitter.emit('openCashConfirmModal', { data: cashList.current });
        }
    };

    return (
        <div className="flex flex-col break-words common-card theme-bg theme-text-main pt-4">
            <div className="mb-5 flex justify-between items-center">
                <div className="flex-1">
                    <Menu
                        onClick={handleClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        className="theme-border-color"
                        style={{ background: 'transparent' }}>
                        <Menu.Item key="cashList" className="-ml-4">
                            <div>{t('cheque_cashing_list')}</div>
                        </Menu.Item>
                        <Menu.Item key="cashHistory">
                            <div>{t('cheque_cashing_history')}</div>
                        </Menu.Item>
                        <Menu.Item key="chequeDetail">
                            <div>{t('cheque_detail')}</div>
                        </Menu.Item>
                    </Menu>
                </div>

                {current === 'cashList' && (
                    <div className="ml-4 flex items-center">
                        {/* <div className="flex-grow flex-1">
              <h3 className={'font-semibold ' + themeStyle.text[color]}>{t('cashing_list_tip')}</h3>
            </div> */}
                        <button
                            className={'common-btn'}
                            style={
                                cashStatus
                                    ? { backgroundColor: '#EFA71D', color: '#fff', width: 120 }
                                    : { backgroundColor: '#e5e6eb', color: '#a1a7c4', cursor: 'not-allowed', width: 120 }
                            }
                            type="button"
                            onClick={() => {
                                _cash();
                            }}>
                            <span className="mr-1">
                                <i className="fa-solid fa-coins"></i>
                            </span>
                            <span>{t('cash')}</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="block w-full overflow-x-auto rounded-b-2xl">
                {current === 'cashList' && <ChequeCashingListTable enableCash={enableCash} color={color} />}
                {current === 'cashHistory' && <ChequeCashingHistoryTable color={color} />}
                {current === 'chequeDetail' && <ChequeDetailTable color={color} type="earning" />}
            </div>
        </div>
    );
}

CardChequeEarningList.defaultProps = {
    color: 'light',
};

CardChequeEarningList.propTypes = {
    color: PropTypes.oneOf(['light', 'dark']),
};
