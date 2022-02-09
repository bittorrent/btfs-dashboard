class TronLink {

    constructor() {
        this.isInstalled = false;
        this.isLogin = false;
        this.tronweb = null;
        setTimeout(() => {
            this.detection();
        }, 500);
    }

    init() {
        this.tronWeb = window.tronWeb;
    }

    detection() {
        if (typeof window.tronWeb !== 'undefined') {
            console.log('Tronlink is installed!');
            this.isInstalled = true;
            this.init();
            if (window.tronWeb.defaultAddress.base58) {
                this.isLogin = true;
                console.log('Tronlink is login!');
            } else {
                this.isLogin = false;
                console.log('Tronlink is not login!');
            }
        } else {
            console.log('Tronlink is not installed!');
            console.log('Tronlink is not login!');
            this.isInstalled = false;
            this.isLogin = false;
        }
    }

    on(event, callback) {
        window.addEventListener('message', function (e) {
            if (e.data.message && e.data.message.action == event) {
                console.log(e.data.message);
                callback();
            }
        })
    }

    request(method, params, successCallback, errorCallback) {
        window.tronWeb.request({
            method: method,
            params: params,
        }).then((res) => {
            console.log(res);
            successCallback()
        }).catch((error) => {
            console.log(error);
            errorCallback();
        })
    }

    connect() {
        window.tronWeb.request({method: 'tron_requestAccounts'});
    }

    getMintContract() {
        let contractAddress = "TFAngi1UtqKmMC34ZfiVHeivxg9rjTk5tz";
        let myContract = window.tronWeb.contract().at(contractAddress);
        return myContract;
    }

}

const TronLinkClient = new TronLink();

export default TronLinkClient;