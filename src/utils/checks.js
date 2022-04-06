import Emitter from "./eventBus";
import web3 from "web3";
import {BTFSSCAN_MAIN, BTFSSCAN_TEST, BTTCSCAN_MAIN, BTTCSCAN_TEST} from "utils/constants.js";

export const inputAddressCheck = (value) => {
    if (web3.utils.isAddress(value)) {
        return true;
    } else {
        return false
    }
};

export const inputNumberCheck = (value, max) => {
    if (value > 0 && value <= max) {
        return true;
    } else {
        return false
    }
};

export const urlCheck = (url) => {
    try {
        if (url.indexOf('http://') < 0 || !url.split(":")[2]) {
            Emitter.emit('showMessageAlert', {message: 'api_invalid', status: 'error', type: 'frontEnd'});
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log(e)
    }
};

export const btfsScanLinkCheck = () => {
    let chain_id = localStorage.getItem('CHAIN_ID');
    if (chain_id === '1029') {
        return BTFSSCAN_TEST
    }
    if (chain_id === '199') {
        return BTFSSCAN_MAIN
    }

    return BTFSSCAN_MAIN

};

export const bttcScanLinkCheck = () => {
    let chain_id = localStorage.getItem('CHAIN_ID');
    if (chain_id === '1029') {
        return BTTCSCAN_TEST
    }
    if (chain_id === '199') {
        return BTTCSCAN_MAIN
    }

    return BTTCSCAN_MAIN

};