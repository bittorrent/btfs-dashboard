import Client10 from "APIClient/APIClient10.js";

const FileType = require('file-type');


export const s3NewAccessKey = async () => {
    try {
        let data = await Client10.s3NewAccessKey();
        return data;
    } catch (e) {
        console.log(e);
    }
};


export const getS3AccessKeyList = async () => {
    try {
        let data = await Client10.getS3AccessKeyList();
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const enableS3AccessKey = async (key) => {
    try {
        let data = await Client10.enableS3AccessKey(key);
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const disableS3AccessKey = async (key) => {
    try {
        let data = await Client10.disableS3AccessKey(key);
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const resetS3AccessKey = async (key) => {
    try {
        let data = await Client10.resetS3AccessKey(key);
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const deleteS3AccessKey = async (key) => {
    try {
        let data = await Client10.deleteS3AccessKey(key);
        return data;
    } catch (e) {
        console.log(e);
    }
};


export const downloadFile = async (uArray, fileName) => {
    const fileType = await FileType.fromBuffer(uArray);
    let blob = new Blob([uArray], { type: fileType ? fileType['mime'] : "" });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display:none";
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
