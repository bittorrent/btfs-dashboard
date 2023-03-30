import BigNumber from 'bignumber.js';
import Client10 from "APIClient/APIClient10.js";
import { switchBalanceUnit, compareInt } from "utils/BTFSUtil.js";
import { PRECISION, MULTIPLE_CURRENCY_LIST, CURRENCY_CONFIG, INIT_MULTI_CURRENCY_DATA } from "utils/constants";

export const getChequeEarningStats = async () => {
    let data = await Client10.getChequeStats();
    return {
        chequeReceivedCount: data['total_received_count'],
        uncashedCount: data['total_received_count'] - data['total_received_cashed_count'],
        cashedCount: data['total_received_cashed_count'],
        chequeReceivedValue: switchBalanceUnit(data['total_received']),
        uncashedValue: switchBalanceUnit(data['total_received_uncashed']),
        cashedValue: switchBalanceUnit(data['total_received'] - data['total_received_uncashed']),
        cashedCountPercent: data['total_received_count'] ? new BigNumber(data['total_received_cashed_count']).dividedBy(data['total_received_count']).multipliedBy(100).toFixed(0) : 100,
        cashedValuePercent: data['total_received'] ? new BigNumber((data['total_received'] - data['total_received_uncashed'])).dividedBy(data['total_received']).multipliedBy(100).toFixed(0) : 100
    }
};

/** get all coins' exchange rates to BTT */
export const getAllExchangeRate = async () => {
    const promiseUSDDRate = Client10.getExchangeRate(
        INIT_MULTI_CURRENCY_DATA[1].rateUnit
    ),
        promiseTRXRate = Client10.getExchangeRate(
            INIT_MULTI_CURRENCY_DATA[2].rateUnit
        ),
        promiseUSDTRate = Client10.getExchangeRate(
            INIT_MULTI_CURRENCY_DATA[3].rateUnit
        )

    const [USDDRate, TRXRate, USDTRate] = await Promise.all([promiseUSDDRate, promiseTRXRate, promiseUSDTRate]);
    const currencyRates = {};
    currencyRates.WBTT = 1;
    currencyRates.USDD = USDDRate?.data?.rate;
    currencyRates.TRX = TRXRate?.data?.rate;
    currencyRates.USDT = USDTRate?.data?.rate;
    return currencyRates;
}

export const getChequeEarningAllStats = async () => {
    const promiseChequeAllStats = Client10.getChequeAllStats(),
        promiseHostPriceAll = Client10.getHostPriceAll(),
        promiseExchangeRates = getAllExchangeRate();
    const [allData, priceList, exchangeRates] = await Promise.all([
        promiseChequeAllStats,
        promiseHostPriceAll,
        promiseExchangeRates
    ])

    const earningValueAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENCY_LIST));
    const earningCountAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENCY_LIST));
    let currencyAllStatsData = [];
    const keysList = Object.keys(allData);

    const WBTTData = {
        chequeReceivedCount: 0,
        uncashedCount: 0,
        cashedCount: 0,
        chequeReceivedValue: 0,
        uncashedValue: 0,
        cashedValue: 0,
        cashedCountPercent: 0,
        cashedValuePercent: 0,
    };
    keysList.forEach(key => {
        const data = allData[key];
        const price = priceList[key];
        const exchangeRate = exchangeRates[key];

        if (!data || !price || !exchangeRate) return;

        const childData = {
            key,
            chequeReceivedCount: data['total_received_count'],
            uncashedCount: data['total_received_count'] - data['total_received_cashed_count'],
            cashedCount: data['total_received_cashed_count'],
            chequeReceivedValue: data['total_received'],
            uncashedValue: data['total_received_uncashed'],
            cashedValue: data['total_received'] - data['total_received_uncashed'],
            price,
            exchangeRate,
        }

        childData.exchangeChequeReceivedValue = childData.chequeReceivedValue / childData.price.rate / childData.exchangeRate;
        childData.exchangeUncashedValue = childData.uncashedValue / childData.price.rate / childData.exchangeRate;
        childData.exchangecashedValue = childData.cashedValue / childData.price.rate / childData.exchangeRate;

        currencyAllStatsData.push(childData)

        // summary
        WBTTData.chequeReceivedCount += childData.chequeReceivedCount;
        WBTTData.uncashedCount += childData.uncashedCount;
        WBTTData.cashedCount += childData.cashedCount;
        WBTTData.chequeReceivedValue += childData.exchangeChequeReceivedValue;
        WBTTData.uncashedValue += childData.exchangeUncashedValue;
        WBTTData.cashedValue += childData.exchangecashedValue;
    })
    WBTTData.cashedCountPercent = WBTTData.chequeReceivedCount
        ? ((WBTTData.cashedCount / WBTTData.chequeReceivedCount) * 100).toFixed()
        : 100
    WBTTData.cashedValuePercent = WBTTData.chequeReceivedValue
        ? ((WBTTData.cashedValue / WBTTData.chequeReceivedValue) * 100).toFixed()
        : 100

    currencyAllStatsData.forEach(childData => {
        const index = earningValueAllStatsData.findIndex((item) => item.key === childData.key);
        if (index > -1) {
            earningCountAllStatsData[index].cashed = childData.cashedCount;
            earningCountAllStatsData[index].unCashed = childData.uncashedCount;
            earningCountAllStatsData[index].cashedValuePercent = ((childData.cashedCount / (childData.chequeReceivedCount || 1)) * 100).toFixed();
            earningCountAllStatsData[index].width = `${((childData.chequeReceivedCount / (WBTTData.chequeReceivedCount || 1)) * 100).toFixed()}%`;

            earningValueAllStatsData[index].cashed = childData.cashedValue;
            earningValueAllStatsData[index].unCashed = childData.uncashedValue;
            earningValueAllStatsData[index].cashedValuePercent = ((childData.cashedValue / (childData.chequeReceivedValue || 1)) * 100).toFixed();
            earningValueAllStatsData[index].width = `${((childData.exchangeChequeReceivedValue / (WBTTData.chequeReceivedValue || 1)) * 100).toFixed()}%`;
            earningValueAllStatsData[index].price = childData.price;
            earningValueAllStatsData[index].exchangeChequeReceivedValue = childData.exchangeChequeReceivedValue;
            earningValueAllStatsData[index].exchangeUncashedValue = childData.exchangeUncashedValue;
            earningValueAllStatsData[index].exchangecashedValue = childData.exchangecashedValue;
        }
    })
    console.log("earningCountAllStatsData", earningCountAllStatsData)
    console.log("earningValueAllStatsData", earningValueAllStatsData)
    console.log("wbttData", WBTTData)
    return {
        earningCountAllStatsData,
        earningValueAllStatsData,
        WBTTData
    }
};

export const getChequeExpenseStats = async () => {
    let data = await Client10.getChequeAllStats();
    return {
        chequeSentCount: data['total_issued_count'],
        chequeSentValue: switchBalanceUnit(data['total_issued']),
        uncashedValue: switchBalanceUnit(data['total_issued'] - data['total_issued_cashed']),
        cashedValue: switchBalanceUnit(data['total_issued_cashed']),
        cashedValuePercent: data['total_issued'] ? new BigNumber(data['total_issued_cashed']).dividedBy(data['total_issued']).multipliedBy(100).toFixed(0) : 100
    }
};
export const getChequeExpenseAllStats = async () => {
    const promiseChequeAllStats = Client10.getChequeAllStats(),
        promiseHostPriceAll = Client10.getHostPriceAll(),
        promiseExchangeRates = getAllExchangeRate();
    const [allData, priceList, exchangeRates] = await Promise.all([
        promiseChequeAllStats,
        promiseHostPriceAll,
        promiseExchangeRates,
    ])
    const expenseValueAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENCY_LIST));
    const expenseCountAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENCY_LIST));
    let currencyAllStatsData = [];
    const keysList = Object.keys(allData);

    const WBTTData = {
        chequeSentCount: 0,
        chequeSentValue: 0,
        uncashedValue: 0,
        cashedValue: 0,
        cashedValuePercent: 0,
        chequeReceiveCount: 0,
        chequeReceiveValue: 0,
        receiveCashedValue: 0,
        receiveUncashValue: 0,
    }

    keysList.forEach(key => {
        const data = allData[key];
        const price = priceList[key];
        const exchangeRate = exchangeRates[key];

        if (!data || !price || !exchangeRate) return;

        const childData = {
            key,
            chequeSentCount: data['total_issued_count'],
            chequeSentValue: data['total_issued'],
            uncashedValue: data['total_issued'] - data['total_issued_cashed'],
            cashedValue: data['total_issued_cashed'],
            chequeReceiveCount: data['total_received_count'],
            chequeReceiveValue: data['total_received'],
            receiveCashedValue: data['total_received'] - data['total_received_uncashed'],
            receiveUncashValue: data['total_received_uncashed'],
            price,
            exchangeRate,
        }
        childData.exchangeSentValue = childData.chequeSentValue / childData.price.rate / childData.exchangeRate;
        childData.exchangeCashedValue = childData.cashedValue / childData.price.rate / childData.exchangeRate;
        childData.exchangeUncashedValue = childData.uncashedValue / childData.price.rate / childData.exchangeRate;

        childData.exchangeReceiveValue = childData.chequeReceiveValue / childData.price.rate / childData.exchangeRate;
        childData.exchangeReceiveCashedValue = childData.receiveCashedValue / childData.price.rate / childData.exchangeRate;
        childData.exchangeReceiveUncashedValue = childData.receiveUncashValue / childData.price.rate / childData.exchangeRate;

        currencyAllStatsData.push(childData)

        WBTTData.chequeSentCount += childData.chequeSentCount;
        WBTTData.chequeSentValue += childData.exchangeSentValue;
        WBTTData.cashedValue += childData.exchangeCashedValue;
        WBTTData.uncashedValue += childData.exchangeUncashedValue;

        WBTTData.chequeReceiveCount += childData.chequeReceiveCount;
        WBTTData.chequeReceiveValue += childData.exchangeReceiveValue;
        WBTTData.receiveCashedValue += childData.exchangeReceiveCashedValue;
        WBTTData.receiveUncashValue += childData.exchangeReceiveUncashedValue;
    })
    WBTTData.cashedValuePercent = WBTTData.chequeSentValue ? ((WBTTData.cashedValue / WBTTData.chequeSentValue) * 100).toFixed() : 100;
    WBTTData.receiveCashedValuePercent = WBTTData.chequeReceiveValue ? ((WBTTData.receiveCashedValue / WBTTData.chequeReceiveValue) * 100).toFixed() : 100;

    currencyAllStatsData.forEach(childData => {
        const index = expenseValueAllStatsData.findIndex((item) => item.key === childData.key);

        if (index > -1) {
            expenseCountAllStatsData[index].cashed = childData.chequeReceiveCount;
            expenseCountAllStatsData[index].width = `${((childData.chequeReceiveCount / (WBTTData.chequeReceiveCount || 1)) * 100).toFixed()}%`;

            expenseValueAllStatsData[index].cashed = childData.cashedValue;
            expenseValueAllStatsData[index].unCashed = childData.uncashedValue;
            expenseValueAllStatsData[index].cashedValuePercent = ((childData.cashedValue / (childData.chequeSentValue || 1)) * 100).toFixed();
            expenseValueAllStatsData[index].width = `${((childData.exchangeSentValue / (WBTTData.chequeSentValue || 1)) * 100).toFixed()}%`;
            expenseValueAllStatsData[index].price = childData.price;
            expenseValueAllStatsData[index].exchangeSentValue = childData.exchangeSentValue;
            expenseValueAllStatsData[index].exchangeCashedValue = childData.exchangeCashedValue;
            expenseValueAllStatsData[index].exchangeUncashedValue = childData.exchangeUncashedValue;
        }

    })

    console.log(WBTTData, expenseCountAllStatsData, expenseValueAllStatsData);
    return {
        WBTTData,
        expenseCountAllStatsData,
        expenseValueAllStatsData,

    }
};

export const getChequeCashingList = async (offset, limit) => {
    const data1 = Client10.getChequeCashingAllList(offset, limit);
    const data2 = Client10.getSupportTokens();
    const data3 = Client10.getHostPriceAll();
    return Promise.all([data1, data2, data3]).then(([chequeList, tokenList, priceList]) => {
        let cheques = chequeList['Cheques'] ? chequeList['Cheques'] : [];
        // cheques.forEach(item => {
        //     item.CashedAmount /= PRECISION_RATE;
        //     item.Payout /= PRECISION_RATE;
        // })
        cheques = formatCurrencyTokenDataWithPrices(cheques, tokenList, 'Token', priceList);
        return {
            cheques: cheques,
            total: chequeList['Len']
        }
    })

};

export const getChequeCashingHistoryList = async (offset, limit) => {
    const data1 = Client10.getChequeCashingHistoryList(offset, limit);
    const data2 = Client10.getSupportTokens();
    const data3 = Client10.getHostPriceAll();
    return Promise.all([data1, data2, data3]).then(([chequeList, tokenList, priceList]) => {
        let cheques = chequeList['records'] ? chequeList['records'] : [];
        // cheques.forEach(item => {
        //     item.amount /= PRECISION_RATE;
        // })
        cheques = formatCurrencyTokenDataWithPrices(cheques, tokenList, 'token', priceList);
        return {
            cheques: cheques,
            total: chequeList['total']
        }
    })
};

const formatCurrencyTokenDataWithPrices = (cheques, tokenList, tokenName, priceList) => {
    console.log(priceList)
    cheques.forEach(item => {
        const keyList = Object.keys(tokenList);
        let itemKey = "WBTT";
        let price = null;
        keyList.forEach(key => {
            if (tokenList[key] === item[tokenName].toLowerCase()) {
                itemKey = key;
                price = priceList[key];
            }
        })
        item.key = itemKey;
        item.icon = CURRENCY_CONFIG[itemKey].icon;
        item.unit = CURRENCY_CONFIG[itemKey].unit;
        item.price = price;
    })
    return cheques;
}
export const getChequeReceivedDetailList = async (offset, limit) => {
    const data1 = Client10.getChequeReceivedDetailList(offset, limit);
    const data2 = Client10.getSupportTokens();
    const data3 = Client10.getHostPriceAll();
    return Promise.all([data1, data2, data3]).then(([chequeList, tokenList, priceList]) => {
        let cheques = chequeList['records'] ? chequeList['records'] : [];
        // cheques.forEach(item => {
        //     item.Amount /= PRECISION_RATE;
        // })
        cheques = formatCurrencyTokenDataWithPrices(cheques, tokenList, 'Token', priceList);

        return {
            cheques: cheques,
            total: chequeList['total']
        }
    })
};

export const getChequeExpenseList = async () => {
    const data1 = Client10.getChequeAllExpenseList();
    const data2 = Client10.getSupportTokens();
    const data3 = Client10.getHostPriceAll();
    return Promise.all([data1, data2, data3]).then(([chequeList, tokenList, priceList]) => {
        let cheques = chequeList['Cheques'] ? chequeList['Cheques'] : [];
        // cheques.forEach(item => {
        //     item.CashedAmount /= PRECISION_RATE;
        //     item.Payout /= PRECISION_RATE;
        // })
        cheques = formatCurrencyTokenDataWithPrices(cheques, tokenList, 'Token', priceList);

        return {
            cheques: cheques,
            total: chequeList['Len']
        }
    })
};

export const getChequeSentDetailList = async (offset, limit) => {
    const data1 = Client10.getChequeSentDetailList(offset, limit);
    const data2 = Client10.getSupportTokens();
    const data3 = Client10.getHostPriceAll();
    return Promise.all([data1, data2, data3]).then(([chequeList, tokenList, priceList]) => {
        let cheques = chequeList['records'] ? chequeList['records'] : [];
        // cheques.forEach(item => {
        //     item.Amount /= PRECISION_RATE;
        // })
        cheques = formatCurrencyTokenDataWithPrices(cheques, tokenList, 'Token', priceList);

        return {
            cheques: cheques,
            total: chequeList['total']
        }
    })
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
            let { TxHash, Type, Message } = await Client10.cash(cashList[i].id, cashList[i].currencyType);
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
        console.log("data-Client10.getChequeEarningHistory", data);
        let x = [];
        let y1 = [];
        let y2 = [];
        data.sort(compareInt('date'));
        data.forEach((item) => {
            let date = new Date(item['date'] * 1000);
            x.push((date.getMonth() + 1) + '/' + date.getDate());
            y1.push((item['total_received'] / PRECISION).toFixed(4));
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
export const getChequeEarningAllHistory = async () => {
    try {
        const [data, priceList] = await Promise.all([Client10.getChequeEarningAllHistory(), Client10.getHostPriceAll()]);
        const keysList = Object.keys(data);
        const earningCurrencyAllHistoryData = [];
        keysList.forEach((key) => {
            const keyData = data[key];
            const price = priceList[key];
            const precision = parseFloat(price.rate);

            let x = [];
            let y1 = [];
            let y2 = [];
            keyData.sort(compareInt('date'));
            keyData.forEach((item) => {
                let date = new Date(item['date'] * 1000);
                x.push((date.getMonth() + 1) + '/' + date.getDate());
                y1.push(switchBalanceUnit(item['total_received'], precision));
                y2.push(item['total_received_count']);
            });
            earningCurrencyAllHistoryData.push({
                key: key,
                labels: x,
                data: [y1, y2],
            })
        })
        return earningCurrencyAllHistoryData;

    } catch (e) {
        console.log(e);
        return []
    }
};

export const getChequeExpenseAllHistory = async () => {
    try {
        const [data, priceList] = await Promise.all([Client10.getChequeExpenseAllHistory(), Client10.getHostPriceAll()]);
        const keysList = Object.keys(data);
        const expenseCurrencyAllHistoryData = [];
        keysList.forEach((key) => {
            const keyData = data[key];
            const price = priceList[key];
            const pricesion = price.rate;

            let x = [];
            let y1 = [];
            let y2 = [];
            keyData.sort(compareInt('date'));
            keyData.forEach((item) => {
                let date = new Date(item['date'] * 1000);
                x.push((date.getMonth() + 1) + '/' + date.getDate());
                y1.push(switchBalanceUnit(item['total_issued'], pricesion));
                y2.push(item['total_issued_count']);
            });
            expenseCurrencyAllHistoryData.push({
                key: key,
                labels: x,
                data: [y1, y2],
            })
        })
        return expenseCurrencyAllHistoryData;

    } catch (e) {
        console.log(e);
        return []
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
            y1.push((item['total_issued'] / PRECISION).toFixed(4));
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
