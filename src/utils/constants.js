// precision of btt
export const PRECISION = 1000000000000000000;

// addtional precision of v2.3.0
export const PRECISION_RATE = 1000000;

// precision of v1
export const PRECISION_OLD = 1000000;

export const FEE = 20 * 300; // BTT, not with precision

export const BTFSSCAN_MAIN = 'https://scan.btfs.io';

export const BTFSSCAN_TEST = 'https://scan-test.btfs.io';

export const BTTCSCAN_MAIN = 'https://bttcscan.com';

export const BTTCSCAN_TEST = 'https://testnet.bttcscan.com';

export const BTTCSCAN_ADDRESS = 'https://bttcscan.com/address/';

export const BTFSSCAN_PROVIDER = 'https://scan.btfs.io/provider';

export const FINDER_FILE_MAIN = 'https://gateway.btfs.io/btfs/';



export const CHAIN_NAME = {
  199: 'BTTC',
  1029: 'BTTC Donau Testnet',
};
export const OLD_SCORE_VERSION = 1;
export const NEW_SCORE_VERSION = 2;
export const CURRENCY_CONFIG = {
  WBTT: {
    icon: 'wbtt',
    unit: 'WBTT',
  },
  USDD: {
    icon: 'usdd',
    unit: 'USDD_t',
  },
  TRX: {
    icon: 'trx',
    unit: 'TRX',
  },
  USDT: {
    icon: 'usdt',
    unit: 'USDT_t',
  },
};
export const INIT_MULTI_CURRENCY_DATA = [
  {
    icon: 'wbtt',
    unit: 'WBTT',
    key: 'WBTT',
    rateUnit: 'BTT',
  },
  {
    icon: 'usdd',
    unit: 'USDD_t',
    key: 'USDD',
    rateUnit: 'USDD',
  },
  {
    icon: 'trx',
    unit: 'TRX',
    key: 'TRX',
    rateUnit: 'TRX',
  },
  {
    icon: 'usdt',
    unit: 'USDT_t',
    key: 'USDT',
    rateUnit: 'USDT',
  },
];

export const INIT_CHART_LINE_DATASETS = [
  {
    label: 'WBTT',
    icon: 'wbtt',
    borderColor: '#FF0000',
    backgroundColor: '#FF0000',
    data: [],
    fill: false,
    cubicInterpolationMode: 'monotone',
    tension: 0,
  },
  {
    label: 'TRX',
    icon: 'trx',
    borderColor: '#B73E31',
    backgroundColor: '#B73E31',
    data: [],
    fill: false,
    cubicInterpolationMode: 'monotone',
    tension: 0,
  },
  {
    label: 'USDD',
    icon: 'usdd',
    borderColor: '#216C58',
    backgroundColor: '#216C58',
    data: [],
    fill: false,
    cubicInterpolationMode: 'monotone',
    tension: 0,
  },
  {
    label: 'USDT',
    icon: 'usdt',
    borderColor: '#1BA27A',
    backgroundColor: '#1BA27A',
    data: [],
    fill: false,
    cubicInterpolationMode: 'monotone',
    tension: 0,
  },
];
export const MULTIPLE_CURRENCY_LIST = [
  {
    icon: 'wbtt',
    key: 'WBTT',
    unit: 'WBTT',
    progressColor: '#FFOOOO',
    cashed: 0,
    unCashed: 0,
    width: '0%',
    cashedValuePercent: 0,
  },
  {
    icon: 'trx',
    key: 'TRX',
    unit: 'TRX',
    progressColor: '#B73E31',
    cashed: 0,
    unCashed: 0,
    width: '0%',
    cashedValuePercent: 0,
  },
  {
    icon: 'usdd',
    key: 'USDD',
    unit: 'USDD_t',
    progressColor: '#216C58',
    cashed: 0,
    unCashed: 0,
    width: '0%',
    cashedValuePercent: 0,
  },
  {
    icon: 'usdt',
    key: 'USDT',
    unit: 'USDT_t',
    progressColor: '#1BA27A',
    cashed: 0,
    unCashed: 0,
    width: '0%',
    cashedValuePercent: 0,
  },
];

export const PROGRESS_COLORS = {
  TRAIL_COLOR: '#F99600',
  STROKE_COLOR: '#06A561',
};

export const MAIN_PAGE_MODE = 'MainMode';

export const SAMPLE_PAGE_MODE = 'SimpleMode';

export const MULTIPLE_CURRENCY_RATE = {
    WBTT:1000000000000000000 ,
    USDD:1000000000000000000,
    TST:1000000,
    TRX:1000000,
    USDT:1000000,
    USDD_t:1000000000000000000,
    USDT_t:1000000,
  };

  export const DECRYPT_FILE_TIME_OUT_LIST = [
    {
        label:'seconds_30',
        value: 30
    },
    {
        label:'minutes_1',
        value: 60
    },
    {
        label:'minutes_3',
        value: 180
    }, {
        label:'minutes_5',
        value: 300
    },
    {
        label:'minutes_10',
        value: 600
    },
  ]
