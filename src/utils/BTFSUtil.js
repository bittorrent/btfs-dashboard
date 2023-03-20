import {PRECISION} from 'utils/constants.js';

export const PiB = 1024.0 * 1024.0 * 1024.0 * 1024.0 * 1024.0;
export const TiB = 1024.0 * 1024.0 * 1024.0 * 1024.0;
export const GiB = 1024.0 * 1024.0 * 1024.0;
export const MiB = 1024.0 * 1024.0;
export const KiB = 1024.0;

export const M = 1000000;
export const B = 1000000000;

export function switchStorageUnit2(storage) {
    if (storage === null)
        return '--';
    let num = 0;
    if (storage / PiB > 1) {
        num = (storage / PiB).toFixed(2);
        return num + ' PiB'
    }
    if (storage / TiB > 1) {
        num = (storage / TiB).toFixed(2);
        return num + ' TiB'
    }

    if (storage / GiB > 1) {
        num = (storage / GiB).toFixed(2);
        return num + ' GiB'
    }

    if (storage / MiB > 1) {
        num = (storage / MiB).toFixed(2);
        return num + ' MiB'
    }

    if (storage / KiB > 1) {
        num = (storage / KiB).toFixed(2);
        return num + ' KiB'
    }

    return storage + ' Byte'
}

export function switchStorageUnit(storage) {
    return storage / PiB
}

export function compareStr(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        return val1.localeCompare(val2)
    }
}

export function compareInt(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        return val1 - val2;
    }
}

export function str2bytes(str) {
    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}

export async function fileArrayBuffer(file) {
    return new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result);
        };
        fr.readAsArrayBuffer(file);
    })
}

// format a balance number which is between 0 and 1
function formatDecimalBalance(balance) {
    const balanceStr = String(balance);
    try {
        if(balanceStr.indexOf('e') !== -1) {
            let [precision, exp = '-1'] = balanceStr.split('e');
            let rateDecimal = (precision * 10).toFixed(0);
            exp = exp.slice(1);
            return `0.${'0'.repeat(parseInt(exp - 1))}${rateDecimal}`
        } else {
            const [integer, decimal] = balanceStr.split('.');
            let lastZeroIndex = 0;
            for(let i = 0; i < decimal?.length; i++) {
                if(decimal[i] !== '0') {
                    lastZeroIndex = i;
                    break;
                }
            }
            const rate = lastZeroIndex;
            const significantDecimal = decimal.slice(lastZeroIndex);
            const rateDecimal = parseFloat('0.'+significantDecimal) * 100;
            return `${integer}.${'0'.repeat(rate)}${rateDecimal.toFixed(0) }`
        }
    } catch (e) {
        console.log(e);
        return '0';
    }
}

export function switchBalanceUnit(balance, precision = PRECISION) {
    let num = 0;
    precision = parseFloat(precision);
    balance = balance / precision;

    // handle big number
    if (balance / B > 1) {
        num = (balance / B).toFixed(2);
        return num + ' B '
    }
    if (balance / M > 1) {
        num = (balance / M).toFixed(2);
        return num + ' M '
    }

    // handle small number
    if(balance === 0) {
        return '0';
    }

    if (balance < 1) {
        return formatDecimalBalance(balance);
    }

    return balance.toFixed(2) + ' ';
}

export function ceilLatency(str) {
    try {
        let numArr;
        if (str.indexOf('.') > -1) {
            numArr = str.match(/\d+\.\d+/g);
        } else {
            numArr = str.match(/\d+/g);
        }
        if (numArr) {
            let numInt = Math.ceil(parseFloat(numArr.join('')));
            let unit = str.replace(/[^a-zA-Z]/g, '');
            return numInt + ' ' + unit;
        } else {
            return 'n/a'
        }
    } catch (e) {
        console.log(e);
        return 'n/a'
    }
}

export function toThousands(num) {
    if(num === null)
        return '--';
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

export function getTimes(date) {
    return appendZero(date.getUTCFullYear()) + '/' + appendZero((date.getUTCMonth() + 1)) + '/' + appendZero(date.getUTCDate()) + ' ' + appendZero(date.getUTCHours()) + ':' + appendZero(date.getUTCMinutes()) + ':' + appendZero(date.getUTCSeconds())
}

export function appendZero(num) {
    return num < 10 ? '0' + num : num
}
export function versionStringCompare (curVersion='', lastVersion='2.2.1'){
    const sources = curVersion.split('.');
    const dests = lastVersion.split('.');
    const maxL = Math.max(sources.length, dests.length);
    let result = 0;
    for (let i = 0; i < maxL; i++) {
        const preValue = sources.length>i ? sources[i]:0;
        const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
        const lastValue = dests.length>i ? dests[i]:0;
        const lastNum =  isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
        if (preNum < lastNum) {
            result = -1;
            break;
        } else if (preNum > lastNum) {
            result = 1;
            break;
        }
    }
    return result;
}
  export function getParameterByName(name, url = window.location.href) {
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function toNonExponential(num) {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}
