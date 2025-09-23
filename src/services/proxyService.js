import Client10 from 'APIClient/APIClient10.js';

// let apiUrl = localStorage.getItem('NODE_URL') ? localStorage.getItem('NODE_URL') : 'http://localhost:5001';

// let client;

// export const setClient = apiUrl => {
//     try {
//         client = create(apiUrl + '/api/v1');
//     } catch (e) {
//         console.log(e);
//     }
// };

// setClient(apiUrl);


export const setProxy = async (arg,bool) => {
    try {
        let data = await Client10.setProxy(arg,bool);
        return data;
    } catch (e) {
        console.log(e);
    }
};


export const setProxyPrice = async (arg) => {
    try {
        let data = await Client10.setProxyPrice(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const getProxyPrice = async () => {
    try {
        let data = await Client10.getProxyPrice();
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const getProxyUploadList = async () => {
    try {
        let data = await Client10.getProxyUploadList();
        return data;
    } catch (e) {
        console.log(e);
    }
};


export const getUserBlance = async () => {
    try {
        let data = await Client10.getUserBlance();
        return data;
    } catch (e) {
        console.log(e);
    }
};


export const getUserPayHistory = async (arg) => {
    try {
        let data = await Client10.getUserPayHistory(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};

