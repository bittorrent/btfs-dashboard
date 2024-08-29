import Client10 from "APIClient/APIClient10.js";
import BigNumber from 'bignumber.js';
import {switchStorageUnit2, fileArrayBuffer, compareStr} from "utils/BTFSUtil.js";
import {create} from 'ipfs-http-client';

const FileType = require('file-type');

let apiUrl = localStorage.getItem('NODE_URL') ? localStorage.getItem('NODE_URL') : "http://localhost:5001";

let client;

export const setClient = (apiUrl) => {
  try {
    client = create(apiUrl + '/api/v1');
  } catch(e){
    console.log(e);
  }
};

setClient(apiUrl);

function pathArray2String(path) {
    let _path = '';
    path.forEach((p) => {
        if (p === 'root') {
            _path = '/';
        } else {
            _path = _path + p + '/'
        }
    });
    return _path === '' ? '/' : _path;
}

export const getFilesStorage = async () => {
    try {
        let data = await Client10.getFilesStorage();
        return {
            capacity: switchStorageUnit2(data['StorageMax']),
            storageUsed: switchStorageUnit2(data['RepoSize']),
            percentage: new BigNumber(data['RepoSize']).dividedBy(data['StorageMax']).multipliedBy(100).toFixed(2),
            filesCount: data['NumObjects']
        }
    } catch (e) {
        console.log(e);
    }
};

export const getRootFiles = async () => {
    try {
        let data1 = await Client10.getRootHash();
        let data2 = await Client10.getFiles(data1['Hash']);
        return {
            rootHash: data1['Hash'],
            files: data2['Objects'][0]['Links'] ? data2['Objects'][0]['Links'].sort(compareStr('Name')) : []
        }
    } catch (e) {
        console.log(e);
        return {
            rootHash: '',
            files: []
        }
    }
};

export const getFiles = async (hash) => {
    try {
        let data = await Client10.getFiles(hash);
        return {
            files: data['Objects'][0]['Links'] ? data['Objects'][0]['Links'].sort(compareStr('Name')) : []
        }
    } catch (e) {
        console.log(e);
        return {files: []}
    }
};

export const searchFiles = async (hash) => {
    try {
        let data = await Client10.getFiles(hash);
        return data
    } catch (e) {
        console.log(e);
    }
};

export const getHashByPath = async (path) => {
    try {
        let url = pathArray2String(path);
        let data = await Client10.getHashByPath(url);
        return {
            hash: data['Hash']
        }
    } catch (e) {
        console.log(e);
        return {
            hash: ''
        }
    }
};

export const getFolerSize = async (files) => {
    try {
        if (files) {
            for (let i = 0; i < files.length; i++) {
                if (files[i]['Type'] === 1) {
                    let {Hash, CumulativeSize} = await Client10.getFileStat(files[i]['Hash']);
                    files.forEach((item) => {
                        if (item['Hash'] === Hash) {
                            item['Size'] = CumulativeSize;
                        }
                    });
                }
            }
            return files
        }
    } catch (e) {
        console.log(e);
    }
};

export const uploadFiles = async (input, path, onUploadProgress, setErr, setMessage) => {
    try {
        let url = pathArray2String(path);
        let totalSize = 0;
        if (input.length === 1) {
            totalSize = input[0].size;
            let file = await client.add(input[0], {
                pin: true,
                progress: (size) => {
                    onUploadProgress(size, totalSize)
                }
            });

            let {Type, Message} = await Client10.copy('/btfs/' + file.cid.toString(), url + file.path);

            if (Type === 'error') {
                setMessage(Message);
                setErr(true);
                return false;
            } else {
                return true
            }
        }
        if (input.length > 1) {
            for (let i = 0; i < input.length; i++) {
                totalSize = totalSize + input[i].size;
            }
            let size = 0;
            let folder;
            for await (const result of client.addAll(input, {pin: true})) {
                folder = result;
                if (size > totalSize) {
                } else {
                    size = size + result.size;
                }
                onUploadProgress(size, totalSize)
            }
            let {Type, Message} = await Client10.copy('/btfs/' + folder.cid.toString(), url + folder.path);
            if (Type === 'error') {
                setMessage(Message);
                setErr(true);
                return false;
            } else {
                return true
            }
        }

    } catch (e) {
        console.log(e);
        setErr(true);
        return false
    }
};

async function createObjectURL(data, name) {
    let arrayBuffer = await fileArrayBuffer(data);
    let uArray = new Uint8Array(arrayBuffer);
    const fileType = await FileType.fromBuffer(arrayBuffer);
    let blob = new Blob([uArray], {type: fileType ? fileType['mime'] : ""});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display:none";
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
}

export const downloadFile = async (hash, name, size, onDownloadProgress, setErr) => {
    try {
        let data = await Client10.catFile(hash, {}, {onDownloadProgress: onDownloadProgress, responseType: 'blob'});
        createObjectURL(data, name);
    } catch (e) {
        console.log(e);
        setErr(true);
    }
};

export const downloadFolder = async (hash, name, size, onDownloadProgress, setErr) => {
    try {
        let data = await Client10.getFolder(hash, {}, {onDownloadProgress: onDownloadProgress, responseType: 'blob'});
        createObjectURL(data, name);
    } catch (e) {
        console.log(e);
        setErr(true);
    }
};

export const viewFile = async (hash, name, size) => {
    try {
        let content = [];
        for await (const result of client.cat(hash)) {
            content = [...content, ...result];
        }
        let fileType = await  FileType.fromBuffer(new Uint8Array(content));
        if (!fileType) {
            if (name.indexOf('.json') > -1) {
                fileType = {mime: 'application/json'};
            }
        }
        let blob = new Blob([new Uint8Array(content)], {type: fileType ? fileType['mime'] : ""});
        return blob;
    } catch (e) {
        console.log(e);
    }
};

export const importFromBTFS = async (hash, path) => {
    try {
        let url = pathArray2String(path);
        let data = await Client10.copy('/btfs/' + hash, url);
        if(!data) {
            return {result: true}
        } else {
            return {result: data}
        }
    } catch (e) {
        console.log(e);
        return  {result: false}
    }
};

export const createNewFolder = async (name, path) => {
    try {
        let url = pathArray2String(path);
        await client.files.mkdir(url + name, {
            parents: true
        });
        return true
    } catch (e) {
        console.log(e);
        return false
    }
};


export const removeFiles = async (hash, name, path, type) => {
    try {
        let url = pathArray2String(path);
        if (type === 1) {
            await client.files.rm(url + name, {recursive: true});
        }
        if (type === 2) {
            await client.files.rm(url + name);
        }
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};



export const encryptUploadFiles = async (file,hostId,password,onUploadProgress) => {
    try {
            const formData = new FormData();
            formData.append("file", file);
            let res = await Client10.encrypt(formData,hostId,password,onUploadProgress);
            if (res?.Type === 'error') {
                return Promise.reject(res);
            }else{
                return res
            }
    } catch (e) {
        console.log(e);
        return false
    }
};


export const decryptUploadFiles = async (cid,hostid,password,t) => {
    try {
            let data = await Client10.decrypt({cid,hostid,password,t}, {}, {responseType: 'blob'});
            if(data.Type && data.Type === 'error' ){
                return Promise.reject(data);
            }
            createObjectURL(data, cid);
    } catch (e) {
        console.log(e);
        return false
    }
};
