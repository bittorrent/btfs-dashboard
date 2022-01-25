import BigNumber from 'bignumber.js';
import Client10 from "APIClient/APIClient10.js";
import {switchBalanceUnit, compareInt, precision} from "utils/BTFSUtil.js";

export const getChequeEarningStats = async () => {
    let data = await Client10.getChequeStats();
    return {
        chequeReceivedCount: data['total_received_count'],
        uncashedCount: data['total_received_count'] - data['total_received_cashed_count'],
        cashedCount: data['total_received_cashed_count'],
        chequeReceivedValue: switchBalanceUnit(data['total_received']),
        uncashedValue: switchBalanceUnit(data['total_received_uncashed']),
        cashedValue: switchBalanceUnit(data['total_received'] - data['total_received_uncashed']),
        cashedCountPercent:  data['total_received_count'] ? new BigNumber(data['total_received_cashed_count']).dividedBy(data['total_received_count']).multipliedBy(100).toFixed(0) : 100,
        cashedValuePercent: data['total_received'] ? new BigNumber((data['total_received'] - data['total_received_uncashed'])).dividedBy(data['total_received']).multipliedBy(100).toFixed(0): 100
    }
};

export const getChequeExpenseStats = async () => {
    let data = await Client10.getChequeStats();
    return {
        chequeSentCount: data['total_issued_count'],
        chequeSentValue: switchBalanceUnit(data['total_issued']),
        uncashedValue: switchBalanceUnit(data['total_issued'] - data['total_issued_cashed']),
        cashedValue: switchBalanceUnit(data['total_issued_cashed']),
        cashedValuePercent: data['total_issued'] ? new BigNumber(data['total_issued_cashed']).dividedBy(data['total_issued']).multipliedBy(100).toFixed(0) : 100
    }
};

export const getChequeCashingList = async (offset, limit) => {
    let data = await Client10.getChequeCashingList(offset, limit);
    return {
        cheques: data['Cheques'] ? data['Cheques'] : [],
        total: data['Len']
    }
};

export const getChequeCashingHistoryList = async (offset, limit) => {
    let data = await Client10.getChequeCashingHistoryList(offset, limit);
    return {
        cheques: data['records'] ? data['records'] : [],
        total: data['total']
    }
};

export const getChequeReceivedDetailList = async (offset, limit) => {
    let data = await Client10.getChequeReceivedDetailList(offset, limit);
    return {
        cheques: data['records'] ? data['records'] : [],
        total: data['total']
    }
};

export const getChequeExpenseList = async () => {
    let data = await Client10.getChequeExpenseList();
    return {
        cheques: data['Cheques'] ? data['Cheques'] : [],
        total: data['Len']
    }
};

export const getChequeSentDetailList = async (offset, limit) => {
    let data = await Client10.getChequeSentDetailList(offset, limit);
    return {
        cheques: data['records'] ? data['records'] : [],
        total: data['total']
    }
};

export const cash = async (cashList, onCashProgress, setErr, setMessage) => {
    try {
        let totalAmount = 0;
        let cashedAmount = 0;
        let hashList = [];
        cashList.forEach((item) => {
            totalAmount = totalAmount + item.amount;
        });

        if (!totalAmount) {
            setErr(true);
            return false;
        }

        for (let i = 0; i < cashList.length; i++) {
            let {TxHash, Type, Message} = await Client10.cash(cashList[i].id);
            if (Type === 'error') {
                setMessage(Message);
            }
            if (TxHash) {
                hashList.push(TxHash);
                cashedAmount = cashedAmount + cashList[i].amount;
            }
            onCashProgress(cashedAmount, totalAmount);
        }

        if (hashList.length === cashList.length) {
            console.log('done');
            return true;
        } else {
            setErr(true);
        }

    } catch (e) {
        console.log(e);
        setErr(true);
        return false;
    }
};

export const getChequeEarningHistory = async () => {
    try {
        let data = await Client10.getChequeEarningHistory();
        let x = [];
        let y1 = [];
        let y2 = [];
        data.sort(compareInt('date'));
        data.forEach((item) => {
            let date = new Date(item['date'] * 1000);
            x.push((date.getMonth() + 1) + '/' + date.getDate());
            y1.push((item['total_received']/precision).toFixed(4));
            y2.push(item['total_received_count']);
        });
        return {
            labels: x,
            data: [y1, y2],
        }
    } catch (e) {
        console.log(e);
        return {
            labels: [],
            data: [],
        }
    }
};

export const getChequeExpenseHistory = async () => {
    try {
        let data = await Client10.getChequeExpenseHistory();
        let x = [];
        let y1 = [];
        let y2 = [];
        data.sort(compareInt('date'));
        data.forEach((item) => {
            let date = new Date(item['date'] * 1000);
            x.push((date.getMonth() + 1) + '/' + date.getDate());
            y1.push((item['total_issued']/precision).toFixed(4));
            y2.push(item['total_issued_count']);
        });
        return {
            labels: x,
            data: [y1, y2],
        }
    } catch (e) {
        console.log(e);
        return {
            labels: [],
            data: [],
        }
    }
};