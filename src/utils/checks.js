import Emitter from "./eventBus";

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


export const inputCheck = () => {

};

export const urlCheck = (url) => {
    try {
        if (url.indexOf('http://') < 0 || !url.split(":")[2]) {
            Emitter.emit('showMessageAlert', {message: 'api_invalid', status: 'error', type:'frontEnd'});
            return false;
        } else {
            return true;
        }
    } catch (e) {
        console.log(e)
    }
};