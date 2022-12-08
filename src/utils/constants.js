export const PRECISION = 1000000000000000000;

export const PRECISION_RATE = 1000000;

export const FEE = 20;  // BTT, not with precision

export const BTFSSCAN_MAIN = 'https://scan.btfs.io';

export const BTFSSCAN_TEST = 'https://scan-test.btfs.io';

export const BTTCSCAN_MAIN = 'https://bttcscan.com';

export const BTTCSCAN_TEST = 'https://testnet.bttcscan.com';

export const CHAIN_NAME = {
    199: 'BTTC',
    1029: 'BTTC Donau Testnet'
};
export const OLD_SCORE_VERSION = 1;
export const NEW_SCORE_VERSION = 2;
export const CURRENCY_CONFIG = {
    WBTT: {
        icon: "wbtt",
        unit:"WBTT",
    },
    USDD: {
        icon: "usdd",
        unit:"USDD_t",
    },
    TRX: {
        icon: "trx",
        unit:"TRX",
    },
    USDT: {
        icon: "usdt",
        unit:"USDT_t",
    }
}
export const INIT_MULTI_CURRENCY_DATA = [
    {
        icon: "wbtt",
        unit:"WBTT",
        key:"WBTT",
        rateUnit:"BTT",
    },
    {
        icon: "usdd",
        unit:"USDD_t",
        key:"USDD",
        rateUnit:"USDD"
    },
    {
        icon: "trx",
        unit:"TRX",
        key:"TRX",
        rateUnit:"TRX"
    },
    {
        icon: "usdt",
        unit:"USDT_t",
        key:"USDT",
        rateUnit:"USDT"
    },
];

export const INIT_CHART_LINE_DATASETS = [
    {
        label: 'WBTT',
        icon: "wbtt",
        borderColor: '#72171C',
        backgroundColor: '#72171C',
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
    {
        label: 'TRX',
        icon: "trx",
        borderColor: "#CA2932",
        backgroundColor: "#CA2932",
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
    {
        label: 'USDD',
        icon: "usdd",
        borderColor: "#216C58",
        backgroundColor: "#216C58",
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
    {
        label: 'USDT',
        icon: "usdt",
        borderColor: "#1BA27A",
        backgroundColor:"#1BA27A",
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
]
export const MULTIPLE_CURRENY_LIST = [
    {
      icon: "wbtt",
      key:"WBTT",
      unit: "WBTT",
      progressColor: "#72171C",
      cashed: 0,
      unCashed: 0,
      width: "0%",
      cashedValuePercent: 0,
    },
    {
      icon: "trx",
      key:"TRX",
      unit: "TRX",
      progressColor: "#CA2932",
      cashed: 0,
      unCashed: 0,
      width: "0%",
      cashedValuePercent: 0,
    },
    {
      icon: "usdd",
      key:"USDD",
      unit: "USDD_t",
      progressColor: "#216C58",
      cashed: 0,
      unCashed: 0,
      width: "0%",
      cashedValuePercent: 0,
    },
    {
      icon: "usdt",
      key:"USDT",
      unit: "USDT_t",
      progressColor: "#1BA27A",
      cashed: 0,
      unCashed: 0,
      width: "0%",
      cashedValuePercent: 0,
    },
  ];
