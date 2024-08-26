import Client10 from "APIClient/APIClient10.js";
import xhr from "axios/index";
import {setClient} from "services/filesService.js";

export const checkLoginPassword = async () => {
    try {
        let data = await Client10.checkLoginPassword();
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const setLoginPassword = async (arg) => {
    try {
        let data = await Client10.setLoginPassword(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const login = async (arg) => {
    try {
        let data = await Client10.login(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};
export const loginValidate = async (arg) => {
    try {
        let data = await Client10.loginValidate(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};
export const changePassword = async (arg) => {
    try {
        let data = await Client10.changePassword(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};


export const resetLoginPassword = async (arg) => {
    try {
        let data = await Client10.resetLoginPassword(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const logout = async (arg) => {
    try {
        let data = await Client10.logout(arg);
        return data;
    } catch (e) {
        console.log(e);
    }
};

