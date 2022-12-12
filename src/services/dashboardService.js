/*eslint-disable*/
import Client10 from "APIClient/APIClient10.js";
import BigNumber from 'bignumber.js';
import {switchStorageUnit2, switchBalanceUnit, toThousands, getTimes} from "utils/BTFSUtil.js";
import {PRECISION, PRECISION_RATE, FEE, NEW_SCORE_VERSION, INIT_MULTI_CURRENCY_DATA, MULTIPLE_CURRENY_LIST} from "utils/constants.js";

export const getNodeBasicStats = async () => {
    let data1 = Client10.getHostInfo();
    let data2 = Client10.getHostScore(NEW_SCORE_VERSION);
    let data3 = Client10.getPeers();
    let data4 = Client10.getHostVersion();
    let data5 = Client10.getNetworkStatus();

    return Promise.all([data1, data2, data3, data4, data5]).then((result) => {

        let status = null;
        let message = null;
        if (result[4]['code_bttc'] === 2 && result[4]['code_status'] === 2) {
            status = 1;
            message = 'online';
        }
        if (result[4]['code_bttc'] === 3) {
            status = 2;
            message = ['network_unstable_bttc', 'check_network_request'];
        }
        if (result[4]['code_status'] === 3) {
            status = 2;
            message = ['network_unstable_btfs', 'check_network_request'];
        }
        if (result[4]['code_bttc'] === 3 && result[4]['code_status'] === 3) {
            status = 3;
            message = ['network_unstable_bttc', 'network_unstable_btfs', 'check_network_request'];
        }

        return {
            ID: result[0]['ID'] ? result[0]['ID'] : '--',
            uptime: result[1]['host_stats'] ? (result[1]['host_stats']['uptime'] * 100).toFixed(0) : '--',
            peers: result[2]['Peers'] ? result[2]['Peers'].length : '--',
            version: result[3]['Version'] ? result[3]['Version'] : '--',
            status: status,
            message: message,
        }
    })
};
export const getHostAllScore = async () => {
    const data2 = getHostScore(NEW_SCORE_VERSION);
    return Promise.all([data2]).then((result) => {
        return result;
    })
}

export const getHostScore = async (version) => {
    try {
        const promise = new Promise((resolve) => {
            Client10.getHostScore(version).then(
              (data) => {resolve(data)},
              () => {resolve({})}
            );
          });
          return Promise.all([promise]).then((res)=>{
            let {host_stats} = res[0];
            let data = host_stats ? host_stats : {};
            return {
                leftData: {
                    lastUpdated: data['last_updated'],
                    level: data["level"]
                },
                rightData: {
                    uptimeLevel: data['uptime_level'] || 0,
                    ageLevel: data['age_level'] || 0,
                    versionLevel: data['version_level'] || 0,
                    activeLevel: data['active_level'] || 0,
                }
            }

          })
        
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
    let data3 = Client10.getHeartBeatsStats();
    const data4 = Client10.getChequeAllStats();
    const data5 = Client10.getExchangeRate(INIT_MULTI_CURRENCY_DATA[1].rateUnit);
    const data6 = Client10.getExchangeRate(INIT_MULTI_CURRENCY_DATA[2].rateUnit);
    const data7 = Client10.getExchangeRate(INIT_MULTI_CURRENCY_DATA[3].rateUnit);
    const data8 = Client10.getHostPriceAll();
    return Promise.all([data1, data3, data4, data5, data6, data7, data8]).then(
      (result) => {
        const priceList = result[6];
        const usddExchangeRate = result[3];
        const trxExchangeRate = result[4];
        const usdtExchangeRate = result[5];
        console.log("data3", result);
        const gasFee = +result[1]["total_gas_spend"]
          ? +result[1]["total_gas_spend"]
          : 0;
        const chequeExpense = +result[0]["totalSent"];
        const hasTotalExpense = gasFee || chequeExpense;
        const currencyRateList = [];
        currencyRateList.push(
          1,
          result[5]?.data?.rate,
          result[6]?.data?.rate,
          result[7]?.data?.rate
        );
        const checksExpenseDetialsData = [];
        const chequeEarningDetailData = [];
        INIT_MULTI_CURRENCY_DATA.forEach((item, index) => {
          let exchangeRate = 1;
          if(item.key === 'USDD') {
            exchangeRate = usddExchangeRate?.data?.rate ?? 1;
          } else if(item.key === 'TRX') {
            exchangeRate = trxExchangeRate?.data?.rate ?? 1;
          } else if(item.key === 'USDT') {
            exchangeRate = usdtExchangeRate?.data?.rate ?? 1;
          }
          const expenseItem = { ...item }
          const earningItem = { ...item }
          const priceItem = priceList?.[item.key] || {}
          const totolData = result[2]?.[item.key] || {}
          expenseItem.value = switchBalanceUnit(
            +totolData.total_issued || 0,
            priceItem?.rate * PRECISION_RATE
          )
          expenseItem.bttValue = switchBalanceUnit(
            (+totolData.total_issued || 0) *
              (currencyRateList[index] ? 1 / currencyRateList[index] : 1),
            priceItem?.rate * exchangeRate * PRECISION_RATE
          )
          earningItem.value = switchBalanceUnit(
            +totolData.total_received || 0,
            priceItem?.rate * PRECISION_RATE
          )
          earningItem.bttValue = switchBalanceUnit(
            (+totolData.total_received || 0) *
              (currencyRateList[index] ? 1 / currencyRateList[index] : 1),
            priceItem?.rate * exchangeRate * PRECISION_RATE
          )
          checksExpenseDetialsData.push(expenseItem)
          chequeEarningDetailData.push(earningItem)
        })
  
        return {
          chequeEarning: switchBalanceUnit(result[0]["totalReceived"]),
          uncashedPercent: result[0]["totalReceived"]
            ? new BigNumber(
                result[0]["totalReceived"] -
                  result[0]["settlement_received_cashed"]
              )
                .dividedBy(result[0]["totalReceived"])
                .multipliedBy(100)
                .toFixed(0)
            : 0,
          cashedPercent: result[0]["totalReceived"]
            ? new BigNumber(result[0]["settlement_received_cashed"])
                .dividedBy(result[0]["totalReceived"])
                .multipliedBy(100)
                .toFixed(0)
            : 0,
          chequeExpense: switchBalanceUnit(chequeExpense),
          totalExpense: switchBalanceUnit(gasFee + chequeExpense),
          gasFee: switchBalanceUnit(gasFee),
          gasFeePercent: hasTotalExpense
            ? new BigNumber(gasFee)
                .dividedBy(gasFee + chequeExpense)
                .multipliedBy(100)
                .toFixed(0)
            : 0,
          chequeExpensePercent: hasTotalExpense
            ? new BigNumber(chequeExpense)
                .dividedBy(gasFee + chequeExpense)
                .multipliedBy(100)
                .toFixed(0)
            : 0,
          checksExpenseDetialsData,
          chequeEarningDetailData,
        };
      }
    );
  };

// export const getNodeRevenueStats = async () => {
//     let data = await Client10.getChainInfo();
//     let BTTCAddress = data['node_addr'];
//     let data1 = Client10.getChequeValue();
//     let data2 = Client10.getAirDrop(BTTCAddress);
//     return Promise.all([data1, data2]).then((result) => {
//         const airdrop = +result[1].data['total_amount']
//         const chequeEarning = +result[0]['totalReceived']
//         const hasTotalEarnings = airdrop || chequeEarning

//         return {
//             chequeEarning: switchBalanceUnit(result[0]['totalReceived']),
//             uncashedPercent: result[0]['totalReceived'] ? new BigNumber((result[0]['totalReceived'] - result[0]['settlement_received_cashed'])).dividedBy(result[0]['totalReceived']).multipliedBy(100).toFixed(0) : 0,
//             cashedPercent: result[0]['totalReceived'] ? new BigNumber((result[0]['settlement_received_cashed'])).dividedBy(result[0]['totalReceived']).multipliedBy(100).toFixed(0) : 0,
//             chequeExpense: switchBalanceUnit(result[0]['totalSent']),
//             airdrop: switchBalanceUnit(airdrop),
//             totalEarnings: switchBalanceUnit(chequeEarning + airdrop),
//             chequePercent: hasTotalEarnings ? new BigNumber(chequeEarning).dividedBy((chequeEarning + airdrop)).multipliedBy(100).toFixed(0) : 0,
//             airDropPercent: hasTotalEarnings ? new BigNumber(airdrop).dividedBy((chequeEarning + airdrop)).multipliedBy(100).toFixed(0) : 0
//         }
//     })
// };

export const getNodeWalletStats = async () => {
    let data1 = await Client10.getChainInfo();
    let BTTCAddress = data1['node_addr'];
    let chequeAddress = data1['vault_addr'];
    let chequeBookBalance = Client10.getChequeBookBalance();
    let BTTCAddressBTT = Client10.getChequeBTTBalance(BTTCAddress);
    let BTTCAddressWBTT = Client10.getChequeWBTTBalance(BTTCAddress);
    let BTFS10Balance = Client10.getBTFS10Balance();
    let host = Client10.getHostInfo();
    const getAllBalanceData = Client10.getChequeAllBalance(BTTCAddress);
    const getChequeBookAllBalanceData = Client10.getChequeBookAllBalance();
    const getPriceList = Client10.getHostPriceAll();
    return Promise.all([
      chequeBookBalance,
      BTTCAddressBTT,
      BTTCAddressWBTT,
      BTFS10Balance,
      host,
      getAllBalanceData,
      getChequeBookAllBalanceData,
      getPriceList,
    ]).then((result) => {
      const priceList = result[7];
      let maxBTT = new BigNumber(result[1]['balance'])
        .dividedBy(PRECISION)
        .toNumber()
      let maxWBTT = new BigNumber(result[2]['balance'])
        .dividedBy(PRECISION)
        .toNumber()
      let maxChequeBookWBTT = new BigNumber(result[0]['balance'])
        .dividedBy(PRECISION)
        .toNumber()
      let base = new BigNumber(maxBTT).minus(FEE).toNumber()
      let balance10 = result[3]['BtfsWalletBalance']
        ? new BigNumber(result[3]['BtfsWalletBalance'])
            .dividedBy(1000000)
            .toNumber()
        : 0
      let tronAddress = result[4]['TronAddress']
      const allBalanceData = result[5]
      const chequeBookAllBalanceData = result[6]
      const allCurrencyBalanceList = []
      MULTIPLE_CURRENY_LIST.forEach((item) => {
        const newItem = { ...item }
        newItem.addressValue = 0
        newItem.maxAddressCount = 0
        newItem.bookBalanceValue = 0
        newItem.maxBookBalanceCount = 0
        if (allBalanceData?.[item.key]) {
          newItem.addressValue = switchBalanceUnit(allBalanceData?.[item.key], priceList?.[item.key]?.rate)
          newItem.maxAddressCount = new BigNumber(allBalanceData?.[item.key])
            .dividedBy(PRECISION)
            .toNumber()
        }
        if (chequeBookAllBalanceData?.[item.key]) {
          newItem.bookBalanceValue = switchBalanceUnit(
            chequeBookAllBalanceData?.[item.key],
            priceList?.[item.key]?.rate
          )
          newItem.maxBookBalanceCount = new BigNumber(
            chequeBookAllBalanceData?.[item.key]
          )
            .dividedBy(PRECISION)
            .toNumber()
        }
        allCurrencyBalanceList.push({ ...newItem })
      })

      return {
        BTTCAddress: BTTCAddress,
        chequeAddress: chequeAddress,
        chequeBookBalance: switchBalanceUnit(result[0]['balance']),
        BTTCAddressBTT: switchBalanceUnit(result[1]['balance']),
        BTTCAddressWBTT: switchBalanceUnit(result[2]['balance']),
        maxAvailableBTT: base > 0 ? base : 0,
        maxAvailableWBTT: base > 0 ? maxWBTT : 0,
        maxAvailableChequeBookWBTT: base > 0 ? maxChequeBookWBTT : 0,
        balance10: balance10,
        tronAddress: tronAddress,
        allCurrencyBalanceList,
      }
    })
};


export const getNodeStorageStats = async () => {
    try {
        let data1 = Client10.getHostPrice();
        let data2 = Client10.getFilesStorage();
        let data3 = Client10.getContractsNumber();
        let data4 = Client10.getChequeStats();
        return Promise.all([data1, data2, data3, data4]).then((result) => {
            return {
                capacity: switchStorageUnit2(result[1]['StorageMax']),
                storageUsed: switchStorageUnit2(result[1]['RepoSize']),
                percentage: new BigNumber(result[1]['RepoSize']).dividedBy(result[1]['StorageMax']).multipliedBy(100).toFixed(2),
                hostPrice: (result[0]['price'] * 30 / PRECISION).toFixed(2),
                contracts: result[2]['active_contract_num'],
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

const formAmount = (amount) => {
    let amount_str = new BigNumber(amount).multipliedBy(PRECISION).toFixed();
    return amount_str;
};

export const withdraw = async (amount, currencyType) => {
    let amount_str = formAmount(amount);
    let data = await Client10.withdraw(amount_str, currencyType);
    return data
};

export const deposit = async (amount, currencyType) => {
    let amount_str = formAmount(amount);
    let data = await Client10.deposit(amount_str, currencyType);
    return data
};

export const BTTTransfer = async (to, amount) => {
    let amount_str = formAmount(amount);
    console.log(amount_str);
    let data = await Client10.BTTTransfer(to, amount_str);
    return data
};

export const WBTTTransfer = async (to, amount) => {
    let amount_str = formAmount(amount);
    let data = await Client10.WBTTTransfer(to, amount_str);
    return data
};

export const currencyTransfer = async (to, amount, currencyType) => {
    let amount_str = formAmount(amount);
    let data = await Client10.currencyTransfer(to, amount_str, currencyType);
    return data
};

export const BTT2WBTT = async (amount) => {
    let amount_str = formAmount(amount);
    let data = await Client10.BTT2WBTT(amount_str);
    return data
};

export const WBTT2BTT = async (amount) => {
    let amount_str = formAmount(amount);
    let data = await Client10.WBTT2BTT(amount_str);
    return data
};

export const withdraw10 = async (amount, pwd) => {
    let temp = new Number(new BigNumber(amount).multipliedBy(1000000).toString()).toString();
    let amount_str = temp.replace(/,/g, "");
    let data = await Client10.withdraw10(amount_str, pwd);
    return data
};

export const getHeartBeatsStats = async () => {
    try {
        let {status_contract, total_count, total_gas_spend} = await Client10.getHeartBeatsStats();

        return {
            status_contract,
            total_count,
            total_gas_spend: total_gas_spend ? new BigNumber(total_gas_spend).dividedBy(PRECISION).toNumber(): 0
        };
    } catch (e) {
        console.log(e)
        return {
            status_contract: "--",
            total_count: '--',
            total_gas_spend: ''
        }
    }
};

export const getHeartBeatsStatsV2 = async () => {
    try {
        const [result1, result2] = await Promise.all([
            Client10.getHeartBeatsStatsV2(),
            Client10.getHeartBeatsLastInfo()
        ])

        return {
            ...result1,
            ...result2,
        };
    } catch (e) {
        console.error(e)
        return {}
    }
};

export const getHeartBeatsReportlist = async (from) => {
    try {
        let {records, total, peer_id} = await Client10.getHeartBeatsReportlist(from);

        records.forEach(item => {
            let date = new Date(item.report_time)
            item.gas_spend = new BigNumber(item.gas_spend).dividedBy(PRECISION).toNumber()
            item.report_time = getTimes(date)
        });

        return {
            records,
            total,
            peer_id
        };
    } catch (e) {
        console.log(e)
        return {
            records: [],
            total: 0,
            peer_id: ''
        };
    }
};

export const getHeartBeatsReportlistV2 = async (from) => {
    try {
        let {records, total, peer_id, bttc_addr} = await Client10.getHeartBeatsReportlistV2(from);

        records.forEach(item => {
            let date = new Date(item.report_time)
            item.report_time = getTimes(date)
        });

        return {
            records,
            total,
            peer_id,
            bttc_addr
        };
    } catch (e) {
        console.error(e)
        return {
            records: [],
            total: 0,
            peer_id: '',
            bttc_addr: ''
        };
    }
};

export const getHostVersion = async ()=>{
    const data = Client10.getHostVersion();
    return  data['Version'] ? data['Version'] : '';
}

