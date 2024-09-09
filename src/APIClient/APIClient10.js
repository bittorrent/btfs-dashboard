import xhr from "axios/index";
import { PRECISION_RATE } from "utils/constants";
import Cookies from 'js-cookie';


class APIClient10 {
    constructor() {
        this.apiUrl = localStorage.getItem('NODE_URL') ? localStorage.getItem('NODE_URL') : "http://localhost:5001";
        this.request = async (url, body, config) => {
            const isFormData = body instanceof FormData
            const token = Cookies.get(this.apiUrl) || '';
            const addToken = url.includes('?')? `&token=${token}` : `?token=${token}`
            return new Promise(async (resolve, reject) => {
                try {

                    let {data} = await xhr.post(
                        this.apiUrl + url + addToken,
                        isFormData?body:
                        {
                            ...body
                        },
                        {...config}
                    );

                    resolve(data);

                }
                catch (e) {
                    let message;
                    if (e.response && e.response.status === 401) {
                        message = e.response['data'];
                        window.location.href = '/#/login';
                    }
                    if (e.response && e.response.status === 500) {
                        message = e.response['data']['Message'];
                    }
                    if (e.response && e.response.status === 400) {
                        message = e.response['data'];
                    }

                    if(e.response && e.response?.data && !e.response?.data?.success && e.response?.data?.type === 'application/json'){
                        const fileReader = new FileReader()
                        fileReader.readAsText(e.response.data,'utf-8')
                        fileReader.onload = function(){
                          const result = JSON.parse(fileReader.result)
                          message = result['Message']
                            resolve({
                                Type: 'error',
                                Message: message ? message : 'network error or host version not up to date'
                            });
                            return;
                        }
                    }else{
                        resolve({
                            Type: 'error',
                            Message: message ? message : 'network error or host version not up to date'
                        });
                    }
                }
            }).catch(err => {
                console.log(err)
            });
        }
    }

    setApiUrl(url) {
        this.apiUrl = url;
    }


    getHostVersion() {
        return this.request('/api/v1/version');
    }

    getHostInfo() {
        return this.request('/api/v1/id');
    }

    getHostScore(version=2) {
        return this.request(`/api/v1/storage/stats/info?l=false&version=${version}`);
    }

    getHostPrice() {
        return this.request('/api/v1/cheque/price');
    }

    getHostPriceByTokenType(tokenType) {
        return this.request(`/api/v1/cheque/price?token-type=${tokenType}`);
    }

    getHostPriceAll() {
        // return this.request('/api/v1/cheque/price-all');
        return this.request('/api/v1/cheque/price-all').then((res) => {
            Object.keys(res).forEach((key) => {
                const item = res[key];
                item.rate = +item.rate * PRECISION_RATE;
            })
            return res;
        }).catch(e => {
          console.log(e);
          return {};
        });
    }

    getHostScoreHistory(from, to) {
        return this.request('/api/v1/storage/stats/list?arg=' + from + '&arg=' + to);
    }

    getHostConfig() {
        return this.request('/api/v1/config/show');
    }
    editHostConfig(key,value,isBool) {
        return this.request('/api/v1/config?arg=' + key + '&arg=' + value + '&bool=' + isBool);
    }
    resetHostConfig() {
        return this.request('/api/v1/config/reset');
    }

    getNetworkStatus() {
        return this.request('/api/v1/network');
    }

    getChainInfo() {
        return this.request('/api/v1/cheque/chaininfo');
    }

    getChequeAddress() {
        return this.request('/api/v1/vault/address');
    }

    getChequeBookBalance() {
        return this.request('/api/v1/vault/balance');
    }

    // V2.3 new
    getChequeBookAllBalance() {
        return this.request('/api/v1/vault/balance_all');
    }

    getChequeBTTBalance(address) {
        return this.request('/api/v1/cheque/bttbalance?arg=' + address);
    }

    getChequeWBTTBalance(address) {
        return this.request('/api/v1/vault/wbttbalance?arg=' + address);
    }

    // V2.3
    getChequeAllBalance(address) {
        return this.request('/api/v1/cheque/all_token_balance?arg=' + address);
    }

    getChequeValue() {
        return this.request('/api/v1/settlement/list');
    }

    getChequeStats() {
        return this.request('/api/v1/cheque/stats');
    }

    // V2.3 new
    getChequeAllStats() {
        return this.request('/api/v1/cheque/stats-all');
    }


    getChequeTotalIncomeNumbers() {
        return this.request('/api/v1/cheque/receive-total-count');
    }

    getContractsNumber() {
        return this.request('/api/v1/storage/contracts/stat?arg=host');
    }

    getChequeTotalExpenseNumbers() {
        return this.request('/api/v1/cheque/send-total-count');
    }

    getChequeCashingList(offset, limit) {
        return this.request('/api/v1/cheque/receivelist?arg=' + offset + '&arg=' + limit);
    }
    // V2.3 new
    getChequeCashingAllList(offset, limit) {
        return this.request('/api/v1/cheque/receivelistall?arg=' + offset + '&arg=' + limit);
    }

    getChequeCashingHistoryList(offset, limit) {
        return this.request('/api/v1/cheque/cashlist?arg=' + offset + '&arg=' + limit);
    }

    getChequeReceivedDetailList(offset, limit) {
        return this.request('/api/v1/cheque/receive-history-list?arg=' + offset + '&arg=' + limit);
    }

    getChequeExpenseList() {
        return this.request('/api/v1/cheque/sendlist');
    }
    // V2.3 new
    getChequeAllExpenseList() {
        return this.request('/api/v1/cheque/sendlistall');
    }

    getChequeSentDetailList(offset, limit) {
        return this.request('/api/v1/cheque/send-history-list?arg=' + offset + '&arg=' + limit);
    }

    getChequeEarningHistory() {
        return this.request('/api/v1/cheque/receive-history-stats');
    }
    // V2.3 new
    getChequeEarningAllHistory() {
        return this.request('/api/v1/cheque/receive-history-stats-all');
    }

    getChequeExpenseHistory() {
        return this.request('/api/v1/cheque/send-history-stats');
    }
   // V2.3 new
    getChequeExpenseAllHistory() {
        return this.request('/api/v1/cheque/send-history-stats-all');
    }

    getFilesStorage() {
        return this.request('/api/v1/repo/stat?human=true');
    }

    getContracts() {
        return this.request('/api/v1/storage/contracts/list/host');
    }

    getNetworkFlow() {
        return this.request('/api/v1/stats/bw');
    }

    getPeers() {
        return this.request('/api/v1/swarm/peers?latency=true');
    }

    getRootHash() {
        return this.request('/api/v1/files/stat?arg=%2F');
    }

    getHashByPath(path) {
        return this.request('/api/v1/files/stat?arg=' + path);
    }

    getRepo() {
        return this.request('/api/v1/repo/stat');
    }

    changeRepo(path, volume) {
        return this.request('/api/v1/storage/path?arg=' + path + '&arg=' + volume);
    }

    getFiles(hash) {
        return this.request('/api/v1/ls?arg=' + hash);
    }

    getFileStat(hash) {
        return this.request('/api/v1/files/stat?arg=/btfs/' + hash);
    }

    getFolder(hash, body, config) {
        return this.request('/api/v1/get?arg=' + hash + '&archive=true', body, config);
    }

    catFile(hash, body, config) {
        return this.request('/api/v1/cat?arg=' + hash, body, config);
    }

    getPrivateKey() {
        return this.request('/api/v1/cheque/chaininfo');
    }

    withdraw(amount, currencyType) {
        return this.request('/api/v1/vault/withdraw?arg=' + amount + '&token-type=' + currencyType);
    }


    deposit(amount, currencyType) {
        return this.request('/api/v1/vault/deposit?arg=' + amount + '&token-type=' + currencyType);
    }

    BTTTransfer(to, amount) {
        console.log(amount);
        return this.request('/api/v1/bttc/send-btt-to?arg=' + to + '&arg=' + amount);
    }

    WBTTTransfer(to, amount) {
        return this.request('/api/v1/bttc/send-wbtt-to?arg=' + to + '&arg=' + amount);
    }

    // V2.3 new
    currencyTransfer(to, amount, currencyType) {
        return this.request('/api/v1/bttc/send-token-to?arg=' + to + '&arg=' + amount + '&token-type=' + currencyType);
    }


    BTT2WBTT(amount) {
        return this.request('/api/v1/bttc/btt2wbtt?arg=' + amount);
    }

    WBTT2BTT(amount) {
        return this.request('/api/v1/bttc/wbtt2btt?arg=' + amount);
    }

    cash(id, currencyType) {
        return this.request('/api/v1/cheque/cash?arg=' + id + '&token-type=' + currencyType);
    }

    addPeer(id) {
        return this.request('/api/v1/swarm/connect?arg=' + id);
    }

    copy(from, to) {
        return this.request('/api/v1/files/cp?arg=' + from + '&arg=' + to);
    }

    remove(hash) {
        return this.request('/api/v1/rm?arg=' + hash);
    }

    syncContracts() {
        return this.request('/api/v1/storage/contracts/sync/host');
    }

    getBTFS10Balance() {
        // deprecated
        return null;
        // return this.request('/api/v1/wallet/balance');
    }

    withdraw10(amount) {
        return this.request('/api/v1/wallet/withdraw?arg=' + amount);
    }

    async getAirDrop(address) {
        try {
            let {data} = await xhr.get('https://scan-backend-dev.btfs.io/api/v1/airdrop/node_id/history_total?bttc_addr=' + address);
            return data;
        } catch (e) {
            return {data: {}}
        }
    }

    getHeartBeatsStats() {
        return this.request('/api/v1/statuscontract/total');
    }

    getHeartBeatsStatsV2() {
        return this.request('/api/v1/statuscontract/daily_total');
    }

    getHeartBeatsLastInfo() {
        return this.request('/api/v1/statuscontract/lastinfo');
    }

    getHeartBeatsReportlist(from) {
        return this.request('/api/v1/statuscontract/reportlist?arg=' + from + '&arg=10');
    }
    getHeartBeatsReportlistV2(from) {
        return this.request('/api/v1/statuscontract/daily_report_list?arg=' + from + '&arg=10');
    }

    // V2.3 new
    getSupportTokens() {
        return this.request('/api/v1/storage/upload/supporttokens');
    }
    async getExchangeRate(currency) {
        try {
            let {data} = await xhr.get(`https://scan-backend.btfs.io/api/v1/exchange_rate?from_symbol=BTT&to_symbol=${currency}`);
            return data;
        } catch (e) {
            return {data: {}}
        }
    }

    encrypt(formData,to,password,onUploadProgress) {
        return this.request(`/api/v1/encrypt?${to?'to='+to:''}${password?'p='+password:''}`,formData,{
            'headers':{
                'Content-Type':'application/x-www-form-urlencoded',
            },
            'timeout': 0,
            // signal: signal,
            onUploadProgress:onUploadProgress
        });
    }

    decrypt({cid,hostid,password,t}, body, config) {
        return this.request(`/api/v1/decrypt?arg=${cid}&from=${hostid}&p=${password}&t=${t}`, body, config);
    }

    // s3 api

    // generate key
    s3NewAccessKey() {
        return this.request('/api/v1/accesskey/generate');
    }

    getS3AccessKeyList() {
        return this.request('/api/v1/accesskey/list');
    }

    enableS3AccessKey(key) {
        return this.request(`/api/v1/accesskey/enable/${key}`);
    }

    disableS3AccessKey(key) {
        return this.request(`/api/v1/accesskey/disable/${key}`);
    }

    resetS3AccessKey(key) {
        return this.request(`/api/v1/accesskey/reset/${key}`);
    }

    deleteS3AccessKey(key) {
        return this.request(`/api/v1/accesskey/delete/${key}`);
    }

    //login
    checkLoginPassword() {
        return this.request(`/api/v1/dashboard/check`);
    }
    setLoginPassword(arg){
        return this.request(`/api/v1/dashboard/set?arg=${arg}`);
    }
    login(arg){
        return this.request(`/api/v1/dashboard/login?arg=${arg}`);
    }
    loginValidate(arg,token){
        return this.request(`/api/v1/dashboard/validate?arg=${arg}&token=${token}`);
    }
    changePassword(arg,newpassword,token){
        return this.request(`/api/v1/dashboard/change?arg=${arg}&arg=${newpassword}&token=${token}`);
    }
    resetLoginPassword(privateKey, password){
        return this.request(`/api/v1/dashboard/reset?arg=${privateKey}&arg=${password}`);
    }
    logout(){
        return this.request(`/api/v1/dashboard/logout`);
    }

}

const Client10 = new APIClient10();

export default Client10;
