import moment from 'moment';
import Cookies from 'js-cookie';
import { PRECISION } from 'utils/constants.js';
// const crypto = require('crypto');

const CryptoJS = require('crypto-js');

export const PiB = 1024.0 * 1024.0 * 1024.0 * 1024.0 * 1024.0;
export const TiB = 1024.0 * 1024.0 * 1024.0 * 1024.0;
export const GiB = 1024.0 * 1024.0 * 1024.0;
export const MiB = 1024.0 * 1024.0;
export const KiB = 1024.0;

export const M = 1000000;
export const B = 1000000000;

export function formatNumber(number, n) {
    if (!number) return number;
    if (n === 0) {
        return Math.trunc(number);
    }
    let num = Math.trunc(number * 10 ** n);
    return num / 10 ** n;
}

export function switchStorageUnit2(storage) {
    if (storage === null) return '--';
    let num = 0;
    if (storage / PiB > 1) {
        num = formatNumber(storage / PiB, 2);
        return num + ' PiB';
    }
    if (storage / TiB > 1) {
        num = formatNumber(storage / TiB, 2);
        return num + ' TiB';
    }

    if (storage / GiB > 1) {
        num = formatNumber(storage / GiB, 2);
        return num + ' GiB';
    }

    if (storage / MiB > 1) {
        num = formatNumber(storage / MiB, 2);
        return num + ' MiB';
    }

    if (storage / KiB > 1) {
        num = formatNumber(storage / KiB, 2);
        return num + ' KiB';
    }

    return storage + ' Byte';
}

export function switchStorageUnit(storage) {
    return storage / PiB;
}

export function compareStr(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        return val1.localeCompare(val2);
    };
}

export function compareInt(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        return val1 - val2;
    };
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
    });
}

// format a balance number which is between 0 and 1
function formatDecimalBalance(balance) {
    const balanceStr = String(balance);
    try {
        if (balanceStr.indexOf('e') !== -1) {
            let [precision, exp = '-1'] = balanceStr.split('e');
            let rateDecimal = Math.trunc(precision * 10);
            exp = exp.slice(1);
            return `0.${'0'.repeat(parseInt(exp - 1))}${rateDecimal}`;
        } else {
            const [integer, decimal] = balanceStr.split('.');
            let lastZeroIndex = 0;
            for (let i = 0; i < decimal?.length; i++) {
                if (decimal[i] !== '0') {
                    lastZeroIndex = i;
                    break;
                }
            }
            const rate = lastZeroIndex;
            const significantDecimal = decimal.slice(lastZeroIndex);
            const rateDecimal = parseFloat('0.' + significantDecimal) * 100;
            return `${integer}.${'0'.repeat(rate)}${Math.trunc(rateDecimal)}`;
        }
    } catch (e) {
        console.log(e);
        return '0';
    }
}

export function switchBalanceUnit2(balance, precision = PRECISION) {
    let num = 0;
    precision = parseFloat(precision);
    balance = balance / precision;
    // handle big number
    if (balance / B > 1) {
        num = balance / B
        return num + ' B ';
    }
    if (balance / M > 1) {
        num = balance / M;
        return num + ' M ';
    }

    // handle small number
    if (balance === 0) {
        return '0';
    }

    // if (balance < 1) {
    //     return (balance);
    // }

    return balance + ' ';
}

export function switchBalanceUnit(balance, precision = PRECISION) {
    let num = 0;
    precision = parseFloat(precision);
    balance = balance / precision;
    // handle big number
    if (balance / B > 1) {
        num = formatNumber(balance / B, 2);
        return num + ' B ';
    }
    if (balance / M > 1) {
        num = formatNumber(balance / M, 2);
        return num + ' M ';
    }

    // handle small number
    if (balance === 0) {
        return '0';
    }

    if (balance < 1) {
        return formatDecimalBalance(balance);
    }

    return formatNumber(balance, 2) + ' ';
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
            return '--';
        }
    } catch (e) {
        console.log(e);
        return '--';
    }
}

// export function toThousands(num) {
//     if (num === null) return '--';
//     return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
// }

export function toThousands(num) {
    if (num === null || num === '-') return '-';
    const numStr = (num || 0).toString();
    const decimalIndex = numStr.indexOf('.');
    let integerPart = numStr;
    let decimalPart = '';

    if (decimalIndex !== -1) {
        integerPart = numStr.substring(0, decimalIndex);
        decimalPart = numStr.substring(decimalIndex);
    }
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedInteger + decimalPart;
}

export function getTimes(date) {
    return (
        appendZero(date.getUTCFullYear()) +
        '/' +
        appendZero(date.getUTCMonth() + 1) +
        '/' +
        appendZero(date.getUTCDate()) +
        ' ' +
        appendZero(date.getUTCHours()) +
        ':' +
        appendZero(date.getUTCMinutes()) +
        ':' +
        appendZero(date.getUTCSeconds())
    );
}

export function appendZero(num) {
    return num < 10 ? '0' + num : num;
}
export function versionStringCompare(curVersion = '', lastVersion = '2.2.1') {
    const sources = curVersion.split('.');
    const dests = lastVersion.split('.');
    const maxL = Math.max(sources.length, dests.length);
    let result = 0;
    for (let i = 0; i < maxL; i++) {
        const preValue = sources.length > i ? sources[i] : 0;
        const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
        const lastValue = dests.length > i ? dests[i] : 0;
        const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
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
    return formatNumber(num, Math.max(0, (m[1] || '').length - m[2]));
}

export function getUrl(url, isSlice) {
    if (!url) return url;
    const apiUrl = localStorage.getItem('NODE_URL')
        ? localStorage.getItem('NODE_URL')
        : 'http://localhost:5001';
    const urlFormat = new URL(apiUrl);
    const baseUrl = urlFormat.protocol + '//' + urlFormat.hostname;
    if (isSlice) {
        const list = url.split('/');
        let ip = list[2];
        const port = list[4];
        if (ip === '0.0.0.0') {
            ip = urlFormat.hostname;
        }
        return urlFormat.protocol + '//' + ip + ':' + port;
    } else {
        if (url.includes('0.0.0.0')) {
            return url.replace('0.0.0.0', baseUrl);
        } else {
            return urlFormat.protocol + '//' + url;
        }
    }
}

export function getIsValidFolder(value) {
    if (!value) return false;

    if (value.includes('/')) return false;

    const len = str2bytes(value);

    if (len > 1024) return false;

    return true;
}

export function sortListByDate(data, sortKey) {
    const list = data.map(item => {
        item[sortKey + '_time'] = moment(item[sortKey], 'YYYY-MM-DD HH:mm:ss');
        return item;
    })
    const res = list.sort(function (a, b) {
        return b[sortKey + '_time'] - a[sortKey + '_time'];
    });
    return res;
}

export function sortList(data, sortKey) {
    const res = data.sort(function (a, b) {
        // return a[sortKey] - b[sortKey];
        return b[sortKey] - a[sortKey];
    });
    return res;
}

// 0bea1a4ac0d6e0dde98b07e104695c42
function evpBytesToKey(password, keySize, ivSize) {
    const derived = CryptoJS.lib.WordArray.create();
    let digest = CryptoJS.lib.WordArray.create();

    while (derived.sigBytes < (keySize + ivSize) * 4) {
        const md5 = CryptoJS.algo.MD5.create();
        if (digest.sigBytes > 0) {
            md5.update(digest);
        }
        md5.update(password);
        digest = md5.finalize();

        derived.concat(digest);
    }

    derived.sigBytes = (keySize + ivSize) * 4;

    return {
        key: CryptoJS.lib.WordArray.create(derived.words.slice(0, keySize), keySize * 4),
        iv: CryptoJS.lib.WordArray.create(derived.words.slice(keySize, keySize + ivSize), ivSize * 4),
    };
}

export function aseEncode(data, password) {
    const { key, iv } = evpBytesToKey(CryptoJS.enc.Utf8.parse(password), 8, 4); // 256位密钥需要8个字，128位IV需要4个字

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

// export function aseEncode(data, password) {
//     const cipher = crypto.createCipher('aes-256-cbc', password);
//     let crypted = cipher.update(data, 'utf-8', 'hex');
//     crypted += cipher.final('hex');
//     return crypted;
// }

export function setCookies(key, value, expiresTime) {
    let seconds = expiresTime;
    let expires = new Date(new Date() * 1 + seconds * 1000);
    return Cookies.set(key, value, { expires: expires });
}



export function formatPreciseNumber(str) {
    if (str.includes('.')) {
        // 处理小数
        let [integer, decimal] = str.split('.');
        decimal = decimal.replace(/0+$/, ''); // 移除小数部分末尾的0
        return decimal ? `${integer}.${decimal}` : integer;
    }
    return str;
}
