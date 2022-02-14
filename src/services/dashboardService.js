/*eslint-disable*/
import Client10 from "APIClient/APIClient10.js";
import BigNumber from 'bignumber.js';
import {switchStorageUnit2, switchBalanceUnit, precision} from "utils/BTFSUtil.js";

export const getNodeBasicStats = async () => {
    let data1 = Client10.getHostInfo();
    let data2 = Client10.getHostScore();
    let data3 = Client10.getPeers();
    let data4 = Client10.getHostVersion();

    return Promise.all([data1, data2, data3, data4]).then((result) => {
        return {
            ID: result[0]['ID'] ? result[0]['ID'] : '--',
            uptime: result[1]['host_stats'] ? (result[1]['host_stats']['uptime'] * 100).toFixed(0) : '--',
            peers: result[2]['Peers'] ? result[2]['Peers'].length : '--',
            version: result[3]['Version'] ? result[3]['Version'] : '--',
        }
    })
};

export const getHostScore = async () => {
    try {
        let {host_stats} = await Client10.getHostScore();
        let data = host_stats ? host_stats : {};
        return {
            leftData: {
                score: data['score'],
                lastUpdated: data['last_updated'],
            },
            rightData: {
                uptimeScore: data['uptime_score'],
                ageScore: data['age_score'],
                versionScore: data['version_score'],
                downloadScore: data['download_speed_score'],
                uploadScore: data['upload_speed_score'],
                uptimeWeight: data['uptime_weight'],
                ageWeight: data['age_weight'],
                versionWeight: data['version_weight'],
                uploadWeight: data['upload_speed_weight'],
                downloadWeight: data['download_speed_weight'],
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const getHostHistory = async (flag) => {
    try {
        let from = null;
        let to = null;

        if (flag === '7d') {
            to = Date.parse(new Date()) / 1000;
            from = to - 6 * 24 * 60 * 60;
        }
        if (flag === '30d') {
            to = Date.parse(new Date()) / 1000;
            from = to - 29 * 24 * 60 * 60;
        }
        if (flag === '60d') {
            to = Date.parse(new Date()) / 1000;
            from = to - 59 * 24 * 60 * 60;
        }
        let data = await Client10.getHostScoreHistory(from, to);
        let x = [];
        let y = [];
        data.forEach((item) => {
            let date = new Date(item.timestamp * 1000);
            x.push((date.getMonth() + 1) + '/' + date.getDate());
            y.push(item['stat']['score']);
        });
        return {
            labels: x,
            data: y,
        }
    } catch (e) {
        console.log(e);
        return {
            labels: [],
            data: [],
        }
    }
};

export const getNodeRevenueStats = async () => {
    let data1 = Client10.getChequeValue();
    return Promise.all([data1]).then((result) => {
        return {
            chequeEarning: switchBalanceUnit(result[0]['totalReceived']),
            uncashedPercent: result[0]['totalReceived'] ? new BigNumber((result[0]['totalReceived'] - result[0]['settlement_received_cashed'])).dividedBy(result[0]['totalReceived']).multipliedBy(100).toFixed(0) : 0,
            cashedPercent: result[0]['totalReceived'] ? new BigNumber((result[0]['settlement_received_cashed'])).dividedBy(result[0]['totalReceived']).multipliedBy(100).toFixed(0) : 0,
            chequeExpense: switchBalanceUnit(result[0]['totalSent']),
        }
    })
};


export const getNodeWalletStats = async () => {
    const web3Provider = window.ethereum;
    if (web3Provider) {
        // let web3js = new window.Web3(web3Provider);
        //  let accounts = await web3js.eth.getAccounts();
    }

    let data1 = await Client10.getChainInfo();
    let BTTCAddress = data1['node_addr'];
    let chequeAddress = data1['vault_addr'];
    let chequeBookBalance = Client10.getChequeBookBalance();
    let BTTCAddressBTT = Client10.getChequeBTTBalance(BTTCAddress);
    let BTTCAddressWBTT = Client10.getChequeWBTTBalance(BTTCAddress);

    return Promise.all([chequeBookBalance, BTTCAddressBTT, BTTCAddressWBTT]).then((result) => {
        return {
            BTTCAddress: BTTCAddress,
            chequeAddress: chequeAddress,
            chequeBookBalance: switchBalanceUnit(result[0]['balance']),
            BTTCAddressBTT: switchBalanceUnit(result[1]['balance']),
            BTTCAddressWBTT: switchBalanceUnit(result[2]['balance']),
            _chequeBookBalance: new BigNumber(result[0]['balance']).dividedBy(precision).toNumber(),
            _BTTCAddressWBTT: new BigNumber(result[2]['balance']).dividedBy(precision).toNumber(),
        }
    })
};


export const getNodeStorageStats = async () => {
    try {
        let data1 = Client10.getHostPrice();
        let data2 = Client10.getFilesStorage();
        let data3 = Client10.getChequeTotalIncomeNumbers();
        let data4 = Client10.getChequeStats();
        return Promise.all([data1, data2, data3, data4]).then((result) => {
            return {
                capacity: switchStorageUnit2(result[1]['StorageMax']),
                storageUsed: switchStorageUnit2(result[1]['RepoSize']),
                percentage: new BigNumber(result[1]['RepoSize']).dividedBy(result[1]['StorageMax']).multipliedBy(100).toFixed(2),
                hostPrice: (result[0]['price'] * 30 / precision).toFixed(2),
                contracts: result[2]['count'],
                uncashed: switchBalanceUnit(result[3]['total_received_uncashed']),
                uncashedChange: switchBalanceUnit(result[3]['total_received_daily_uncashed']),
            }
        })
    } catch (e) {
        console.log(e)
    }
};


export const getNetworkFlow = async () => {
    let data = await Client10.getNetworkFlow();
    return {
        receive: (data['RateIn'] / (8 * 1024)).toFixed(2),
        send: (data['RateOut'] / (8 * 1024)).toFixed(2),
    }
};

export const getFilesStorage = async () => {
    let data = await Client10.getFilesStorage();
    return {
        capacity: switchStorageUnit2(data['StorageMax']),
        storageUsed: switchStorageUnit2(data['RepoSize']),
        percentage: new BigNumber(data['RepoSize']).dividedBy(data['StorageMax']).multipliedBy(100).toFixed(2),
    }
};

export const withdraw = async (amount) => {
    let temp = new Number(new BigNumber(amount).multipliedBy(precision).toString()).toLocaleString();
    let amount_str = temp.replace(/,/g, "");
    let data = await Client10.withdraw(amount_str);
    return data
};

export const deposit = async (amount) => {
    let temp = new Number(new BigNumber(amount).multipliedBy(precision).toString()).toLocaleString();
    let amount_str = temp.replace(/,/g, "");
    let data = await Client10.deposit(amount_str);
    return data
};

