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

export const getRepo = async () => {
    let data = await Client10.getRepo();
    return {
        path: data['RepoPath'],
        size: data['RepoSize']
    };
};

export const changeRepo = async (path, volume) => {
    let data = await Client10.changeRepo(path, volume);
    return data;
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

export const nodeStatusCheck = async (url, isMainMode) => {
    try {
        if (url) {
            if(isMainMode){
                Client10.syncContracts();
            }
            let {data} = await xhr.post(url + '/api/v1/id');
            if (data['ID']) {
                setApiUrl(url);
                setClient(url);

                if(isMainMode){
                    let {chain_id} = await Client10.getChainInfo();
                    localStorage.setItem('CHAIN_ID', chain_id);
                }

                localStorage.setItem('NODE_URL', url);

                return true
            } else {
                return false
            }
        } else {
            let {ID} = await Client10.getHostInfo();
            if (ID) {
                if(isMainMode){
                    let {chain_id} = await Client10.getChainInfo();
                    localStorage.setItem('CHAIN_ID', chain_id);
                }
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

export const getHostConfigData = async () => {
    const data = await Client10.getHostConfig();
    return data;
};

export const resetHostConfigData = async () => {
    const data = await Client10.resetHostConfig();
    return data;
};
export const editHostConfig = async (key,value,isBool) => {
    const data = await Client10.editHostConfig(key,value,isBool);
    return data;
};

