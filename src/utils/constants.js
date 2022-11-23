export const PRECISION = 1000000000000000000;

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
    wbtt: {
        icon: "wbtt",
        unit:"WBTT",

    },
    usdd: {
        icon: "usdd",
        unit:"USDD",
    },
    trx: {
        icon: "trx",
        unit:"TRX",
    },
    usdt: {
        icon: "usdt",
        unit:"USDT_t",
    }
}

export const INIT_CHART_LINE_DATASETS = [
    {
        label: 'WBTT',
        borderColor: '#000000',
        backgroundColor: '#000000',
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
    {
        label: 'TRX',
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
    {
        label: 'USDD',
        borderColor: "#006E57",
        backgroundColor: "#006E57",
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
    {
        label: 'USDT',
        borderColor: "#0AB194",
        backgroundColor:"#0AB194",
        data: [],
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0,
    },
]
