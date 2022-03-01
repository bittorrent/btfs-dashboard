import Emitter from "./eventBus";
import web3 from "web3";
import {BTFSSCAN_MAIN, BTFSSCAN_TEST, BTTCSCAN_MAIN, BTTCSCAN_TEST} from "utils/constants.js";

export const tronLinkCheck = () => {
    const tronWeb = window.tronWeb;
    if (tronWeb) {
        const address = tronWeb.defaultAddress.base58;
        if (address) {
            return {isInstalled: true, isLogin: true, address: address}
        } else {
            Emitter.emit('showMessageAlert', {message: 'Need to Login TronLink', status: 'warning'});
            return {isInstalled: true, isLogin: false, address: null}
        }
    } else {
        Emitter.emit('showMessageAlert', {message: 'Need to install TronLink First', status: 'error'});
        return {isInstalled: false, isLogin: false, address: null}
    }
};

export const metaMaskCheck = async () => {
    const web3Provider = window.ethereum;
    if (web3Provider) {
        try {
            web3Provider.enable();
        } catch (error) {
            console.error("User denied account access")
        }

        let web3js = new window.Web3(web3Provider);
        let accounts = await web3js.eth.getAccounts();
        let address = accounts[0];

        if (address) {
            return {isInstalled: true, isLogin: true, address: address}
        } else {
            return {isInstalled: true, isLogin: false, address: null}
        }

    } else {
        return {isInstalled: false, isLogin: false, address: null}
    }
};

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
    if (chain_id === 1029) {
        return BTFSSCAN_TEST
    }
    if (chain_id === 199) {
        return BTFSSCAN_MAIN
    }

};

export const bttcScanLinkCheck = () => {
    let chain_id = localStorage.getItem('CHAIN_ID');
    if (chain_id === 1029) {
        return BTTCSCAN_TEST
    }
    if (chain_id === 199) {
        return BTTCSCAN_MAIN
    }

};