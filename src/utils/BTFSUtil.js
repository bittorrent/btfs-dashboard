export const PiB = 1024.0 * 1024.0 * 1024.0 * 1024.0 * 1024.0;
export const TiB = 1024.0 * 1024.0 * 1024.0 * 1024.0;
export const GiB = 1024.0 * 1024.0 * 1024.0;
export const MiB = 1024.0 * 1024.0;
export const KiB = 1024.0;

export const M = 1000000;
export const B = 1000000000;

export const precision = 1000000000000000000;

export const fee = 15;  // BTT, not with precision

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

export function switchBalanceUnit(balance) {
    let num = 0;
    balance = balance / precision;
    if (balance / B > 1) {
        num = (balance / B).toFixed(4);
        return num + ' B '
    }
    if (balance / M > 1) {
        num = (balance / M).toFixed(4);
        return num + ' M '
    }

    return balance.toFixed(4) + ' ';
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