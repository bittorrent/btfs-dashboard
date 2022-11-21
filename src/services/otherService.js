import Client10 from "APIClient/APIClient10.js";
import xhr from "axios/index";
import {setClient} from "services/filesService.js";

export const setApiUrl = (url) => {
    try {
        Client10.setApiUrl(url);
    } catch (e) {
        console.log(e);
    }
};

export const getPeers = async () => {
    let data = await Client10.getPeers();
    return {
        peers: data['Peers'] ? data['Peers'] : []
    }
};

export const addPeer = async (id) => {
    let data = await Client10.addPeer(id);
    return data
};

export const getPrivateKey = async () => {
    try {
        let data = await Client10.getPrivateKey();
        return {
            privateKey: data['wallet_import_prv_key']
        }
    } catch (e) {
        return false
    }
};

export const nodeStatusCheck = async (url) => {
    try {
        if (url) {
            Client10.syncContracts();
            let {data} = await xhr.post(url + '/api/v1/id');
            if (data['ID']) {
                setApiUrl(url);
                setClient(url);
                let {chain_id} = await Client10.getChainInfo();
                localStorage.setItem('NODE_URL', url);
                localStorage.setItem('CHAIN_ID', chain_id);
                return true
            } else {
                return false
            }
        } else {
            let {ID} = await Client10.getHostInfo();
            if (ID) {
                let {chain_id} = await Client10.getChainInfo();
                localStorage.setItem('CHAIN_ID', chain_id);
                return true
            } else {
                return false
            }
        }
    } catch (e) {
        console.log(e);
        return false
    }
};

