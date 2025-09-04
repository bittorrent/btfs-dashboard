import React, {useReducer} from 'react'
import { MAIN_PAGE_MODE } from 'utils/constants';

const CHANGE_LOCALE = 'CHANGE_LOCALE';
const CHANGE_THEME = 'CHANGE_THEME';
const CHANGE_SIDEBAR = 'CHANGE_SIDEBAR';
const SET_NODE_STATUS = 'SET_NODE_STATUS';
const SET_ACCOUNT = 'SET_ACCOUNT';
const SET_NODE = 'SET_NODE';
const SET_PAGE_MODE = 'SET_PAGE_MODE';
const SET_S3_API_URL = 'SET_S3_API_URL';
const SET_ADDRESS_CONFIG = 'SET_ADDRESS_CONFIG';
const SET_PROXY_CONFIG = 'SET_PROXY_CONFIG';

const mainContext = React.createContext();
const theme = localStorage.getItem('theme');
const pageMode = localStorage.getItem('pageMode');

window.theme = theme ? theme : "light";
window.nodeStatus = false;

const initState = {
    locale: 'en',
    theme: theme ? theme : 'light',
    sidebarShow: true,
    nodeStatus: false,
    account: null,
    node: null,
    pageMode: pageMode ? pageMode : MAIN_PAGE_MODE,
    s3ApiUrl: '',
    proxyMode:false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_LOCALE:
            return {...state, locale: action.locale || 'en'};
        case CHANGE_THEME:
            return {...state, theme: action.theme || 'light'};
        case CHANGE_SIDEBAR:
            return {...state, sidebarShow: action.sidebarShow};
        case SET_NODE_STATUS:
            return {...state, nodeStatus: action.nodeStatus || false};
        case SET_ACCOUNT:
            return {...state, account: action.account || false};
        case SET_NODE:
            return {...state, node: action.node || false};
        case SET_PAGE_MODE:
                return {...state, pageMode: action.pageMode};
        case SET_S3_API_URL:
            return {...state, s3ApiUrl: action.s3ApiUrl};
        case SET_ADDRESS_CONFIG:
                return {...state, addressConfig: action.addressConfig};
        case SET_PROXY_CONFIG:
                return {...state, proxyMode: action.proxyMode};
        default:
            return state
    }
};

const ContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <mainContext.Provider value={{state, dispatch}}>
            {props.children}
        </mainContext.Provider>
    )
};

export {reducer, mainContext, ContextProvider}
