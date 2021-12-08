import Client10 from "APIClient/APIClient10.js";
import xhr from "axios/index";

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
            let {data} = await xhr.post(url + '/api/v1/id');
            if (data['ID']) {
                return true
            } else {
                return false
            }
        } else {
            let {ID} = await Client10.getHostInfo();
            if (ID) {
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

export const setApiUrl = (url) => {
    Client10.setApiUrl(url);
};
