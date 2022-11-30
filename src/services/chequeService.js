import BigNumber from 'bignumber.js';
import Client10 from "APIClient/APIClient10.js";
import {switchBalanceUnit, compareInt} from "utils/BTFSUtil.js";
import {PRECISION, MULTIPLE_CURRENY_LIST, CURRENCY_CONFIG} from "utils/constants";

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
export const getChequeEarningAllStats = async () => {
    let allData = await Client10.getChequeAllStats();
    const earningValueAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENY_LIST));
    const earningCountAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENY_LIST));
    let currencyAllStatsData = [];
    let allTotalCount = 0;
    let allValueCount = 0;
    const keysList = Object.keys(allData);
    let WBTTData = {};
    keysList.forEach(key=>{
        const data = allData[key];
        const childData = {
            key,
            chequeReceivedCount: data['total_received_count'],
            uncashedCount: data['total_received_count'] - data['total_received_cashed_count'],
            cashedCount: data['total_received_cashed_count'],
            chequeReceivedValue: switchBalanceUnit(data['total_received']),
            uncashedValue: switchBalanceUnit(data['total_received_uncashed']),
            cashedValue: switchBalanceUnit(data['total_received'] - data['total_received_uncashed']),
            cashedCountPercent:  data['total_received_count'] ? new BigNumber(data['total_received_cashed_count']).dividedBy(data['total_received_count']).multipliedBy(100).toFixed(0) : 100,
            cashedValuePercent: data['total_received'] ? new BigNumber((data['total_received'] - data['total_received_uncashed'])).dividedBy(data['total_received']).multipliedBy(100).toFixed(0): 100
        }
        allValueCount += Number(childData.chequeReceivedValue);
        allTotalCount += Number(childData.chequeReceivedCount);
        
        currencyAllStatsData.push(childData)
        if(key === "WBTT"){
            WBTTData = childData;
        }
    })
    if(allTotalCount === 0){
        allTotalCount = 1;
    }
    if(allValueCount === 0){
        allValueCount = 1;
    }
    currencyAllStatsData.forEach(childData=>{
        const index = earningValueAllStatsData.findIndex((item)=>item.key === childData.key);
        if(index>-1){
            earningValueAllStatsData[index].cashed = childData.cashedCount;
            earningValueAllStatsData[index].unCashed = childData.uncashedCount;
            earningValueAllStatsData[index].cashedValuePercent = ((earningValueAllStatsData[index].cashed/(childData.chequeReceivedCount))*100).toFixed();
            earningValueAllStatsData[index].width = `${((earningValueAllStatsData[index].cashed/(allTotalCount))*100).toFixed()}%`;

            earningCountAllStatsData[index].cashed = childData.cashedValue;
            earningCountAllStatsData[index].unCashed = childData.uncashedValue;
            earningCountAllStatsData[index].cashedValuePercent = ((childData.cashedValue/(childData.chequeReceivedValue ))*100).toFixed();
            earningCountAllStatsData[index].width = `${((earningCountAllStatsData[index].cashed/(allValueCount))*100).toFixed()}%`;
        }
        
    })
    console.log("earningValueAllStatsData",earningValueAllStatsData)
    console.log("earningCountAllStatsData",earningCountAllStatsData)
    return {
        earningValueAllStatsData,
        earningCountAllStatsData,
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
    let allData = await Client10.getChequeAllStats();
    const expenseValueAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENY_LIST));
    const expenseCountAllStatsData = JSON.parse(JSON.stringify(MULTIPLE_CURRENY_LIST));
    let currencyAllStatsData = [];
    let allTotalCount = 0;
    let allValueCount = 0;
    const keysList = Object.keys(allData);
    let WBTTData = {};
    keysList.forEach(key=>{
        const data = allData[key];
        const childData = {
            key,
            chequeSentCount: data['total_issued_count'],
            chequeSentValue: switchBalanceUnit(data['total_issued']),
            uncashedValue: switchBalanceUnit(data['total_issued'] - data['total_issued_cashed']),
            cashedValue: switchBalanceUnit(data['total_issued_cashed']),
            cashedValuePercent: data['total_issued'] ? new BigNumber(data['total_issued_cashed']).dividedBy(data['total_issued']).multipliedBy(100).toFixed(0) : 100
        }
        allValueCount += childData.chequeSentValue;
        allTotalCount += childData.chequeSentCount;
        
        currencyAllStatsData.push(childData)
        if(key === "WBTT"){
            WBTTData = childData;
        }
    })
    if(allTotalCount === 0){
        allTotalCount = 1;
    }
    if(allValueCount === 0){
        allValueCount = 1;
    }
    currencyAllStatsData.forEach(childData=>{
        const index = expenseValueAllStatsData.findIndex((item)=>item.key === childData.key);
        
        if(index>-1){
            expenseValueAllStatsData[index].cashed = childData.cashedValue;
            expenseValueAllStatsData[index].unCashed = childData.uncashedValue;
            expenseValueAllStatsData[index].cashedValuePercent = ((childData.cashedValue/(childData.chequeSentValue ))*100).toFixed();
            expenseValueAllStatsData[index].width = `${((expenseValueAllStatsData[index].cashed/(allValueCount))*100).toFixed()}%`;

            expenseCountAllStatsData[index].cashed = childData.chequeSentCount;
            expenseCountAllStatsData[index].width = `${((expenseCountAllStatsData[index].cashed/(allTotalCount))*100).toFixed()}%`;
        }
        
    })
    return {
        WBTTData,
        expenseValueAllStatsData,
        expenseCountAllStatsData,

    }
};

export const getChequeCashingList = async (offset, limit) => {
    const data1 =  Client10.getChequeCashingAllList(offset, limit);
    const data2 =  Client10.getSupportTokens();
    return Promise.all([data1, data2]).then((result) => {
        const tokenList = result[1]; 
        let cheques =  result[0]['Cheques'] ? result[0]['Cheques'] : [];
        cheques = formatCurrencyTokenData(cheques,tokenList,'Token');
        
        return {
            cheques: cheques,
            total: result[0]['Len']
        }
    })
   
};

// export const getChequeCashingList = async (offset, limit) => {
//     let data = await Client10.getChequeCashingAllList(offset, limit);
//     const cheques =  data['Cheques'] ? data['Cheques'] : [];
//     cheques.forEach(item=>{
//         item.icon = 'wbtt';
//         item.unit = 'WBTT';
//     })
    
//     return {
//         cheques: data['Cheques'] ? data['Cheques'] : [],
//         total: data['Len']
//     }
// };
export const getChequeCashingHistoryList = async (offset, limit) => {
    const data1 =  Client10.getChequeCashingHistoryList(offset, limit);
    const data2 =  Client10.getSupportTokens();
    return Promise.all([data1, data2]).then((result) => {
        const tokenList = result[1]; 
        let cheques =  result[0]['records'] ? result[0]['records'] : [];
        cheques = formatCurrencyTokenData(cheques,tokenList,'token');
        return {
            cheques: cheques,
            total: result[0]['total']
        }
    })
};
const formatCurrencyTokenData = (cheques,tokenList,tokenName) =>{
    cheques.forEach(item=>{
        const keyList = Object.keys(tokenList);
        let itemKey = "WBTT";
        keyList.forEach(key=>{
            if(tokenList[key] === item[tokenName].toLowerCase()){
                itemKey = key;
            }
        })
        item.key = itemKey;
        item.icon = CURRENCY_CONFIG[itemKey].icon;
        item.unit = CURRENCY_CONFIG[itemKey].unit;
    })
    return cheques;
}
export const getChequeReceivedDetailList = async (offset, limit) => {
    const data1 =  Client10.getChequeReceivedDetailList(offset, limit);
    const data2 =  Client10.getSupportTokens();
    return Promise.all([data1, data2]).then((result) => {
        const tokenList = result[1]; 
        let cheques =  result[0]['records'] ? result[0]['records'] : [];
        cheques = formatCurrencyTokenData(cheques,tokenList,'Token');

        return {
            cheques: cheques,
            total: result[0]['total']
        }
    })
};

export const getChequeExpenseList = async () => {
    const data1 =  Client10.getChequeExpenseList();
    const data2 =  Client10.getSupportTokens();
    return Promise.all([data1, data2]).then((result) => {
        const tokenList = result[1]; 
        let cheques =  result[0]['Cheques'] ? result[0]['Cheques'] : [];
        cheques = formatCurrencyTokenData(cheques,tokenList,'Token');
    
        return {
            cheques: cheques,
            total: result[0]['Len']
        }
    })
};

export const getChequeSentDetailList = async (offset, limit) => {
    const data1 =  Client10.getChequeSentDetailList(offset, limit);
    const data2 =  Client10.getSupportTokens();
    return Promise.all([data1, data2]).then((result) => {
        const tokenList = result[1]; 
        let cheques =  result[0]['records'] ? result[0]['records'] : [];
        cheques = formatCurrencyTokenData(cheques,tokenList,'Token');
    
        return {
            cheques: cheques,
            total: result[0]['total']
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
            let {TxHash, Type, Message} = await Client10.cash(cashList[i].id, cashList[i].currencyType);
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
        console.log("data-Client10.getChequeEarningHistory",data);
        let x = [];
        let y1 = [];
        let y2 = [];
        data.sort(compareInt('date'));
        data.forEach((item) => {
            let date = new Date(item['date'] * 1000);
            x.push((date.getMonth() + 1) + '/' + date.getDate());
            y1.push((item['total_received']/PRECISION).toFixed(4));
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
        let data = await Client10.getChequeEarningAllHistory();
        const keysList  =Object.keys(data);
        const earningCurrencyAllHistoryData = [];
        keysList.forEach((key)=>{
            const keyData = data[key];
            let x = [];
            let y1 = [];
            let y2 = [];
            keyData.sort(compareInt('date'));
            keyData.forEach((item) => {
                let date = new Date(item['date'] * 1000);
                x.push((date.getMonth() + 1) + '/' + date.getDate());
                y1.push((item['total_received']/PRECISION).toFixed(4));
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
        let data = await Client10.getChequeExpenseAllHistory();
        const keysList  =Object.keys(data);
        const expenseCurrencyAllHistoryData = [];
        keysList.forEach((key)=>{
            const keyData = data[key];
            let x = [];
            let y1 = [];
            let y2 = [];
            keyData.sort(compareInt('date'));
            keyData.forEach((item) => {
                let date = new Date(item['date'] * 1000);
                x.push((date.getMonth() + 1) + '/' + date.getDate());
                y1.push((item['total_issued']/PRECISION).toFixed(4));
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
            y1.push((item['total_issued']/PRECISION).toFixed(4));
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