import Web3 from "web3";

class Metamask {

    constructor() {
        this.isInstalled = false;
        this.isLogin = false;
        this.web3js = null;
        setTimeout(() => {
            this.detection();
        }, 500);
    }

    init() {
        let web3Provider = window.ethereum;
        this.web3js = new Web3(web3Provider);
    }

    detection() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            this.isInstalled = true;
            this.init();
            if (window.ethereum.isConnected()) {
                this.isLogin = true;
                console.log('MetaMask is login!');
            } else {
                this.isLogin = false;
                console.log('MetaMask is not login!');
            }
        } else {
            console.log('MetaMask is not installed!');
            console.log('MetaMask is not login!');
            this.isInstalled = false;
            this.isLogin = false;
        }
    }

    on(event, callback) {
        this.eventFunction = (res) => {
            callback(res);
        };
        window.ethereum.on(event, this.eventFunction);
    }

    off(event) {
        window.ethereum.removeListener(event, this.eventFunction);
    }

    request(method, params, successCallback, errorCallback) {
        window.ethereum.request({
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
        this.web3js.eth.requestAccounts().then((res) => {
            console.log(res);
        });
    }

    getContract() {
        let ABI = [
            {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
                    "indexed": true,
                    "name": "_spender",
                    "type": "address"
                }, {"indexed": false, "name": "_value", "type": "uint256"}],
                "name": "Approval",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
                    "indexed": true,
                    "name": "_to",
                    "type": "address"
                }, {"indexed": false, "name": "_value", "type": "uint256"}],
                "name": "Transfer",
                "type": "event"
            }, {
                "constant": false,
                "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
                "name": "approve",
                "outputs": [{"name": "success", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
                "name": "transfer",
                "outputs": [{"name": "success", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "transferFrom",
                "outputs": [{"name": "success", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "inputs": [{"name": "_name", "type": "string"}, {"name": "_symbol", "type": "string"}, {
                    "name": "_decimals",
                    "type": "uint8"
                }, {"name": "_totalSupply", "type": "uint256"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            }, {
                "constant": true,
                "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
                "name": "allowance",
                "outputs": [{"name": "remaining", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{"name": "", "type": "uint8"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{"name": "", "type": "string"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{"name": "", "type": "string"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }];
        let contractAddress = "0xe5b2f5a38d6fe39a45f825d39d4cbf0a0aef5a7e";
        let myContract = new this.web3js.eth.Contract(ABI, contractAddress);
        return myContract;
    }

    signMessage() {
        let msgHash = this.web3js.utils.sha3('aloha');
        let result = this.web3js.eth.sign(msgHash, window.ethereum.selectedAddress);
        console.log(result);
    }
}

const MetamaskClient = new Metamask();

export default MetamaskClient;