import React, {useReducer} from 'react'

const CHANGE_LOCALE = 'CHANGE_LOCALE';
const CHANGE_THEME = 'CHANGE_THEME';
const CHANGE_SIDEBAR = 'CHANGE_SIDEBAR';
const SET_NODE_STATUS = 'SET_NODE_STATUS';
const SET_ACCOUNT = 'SET_ACCOUNT';
const SET_NODE = 'SET_NODE';

const mainContext = React.createContext();
const theme = localStorage.getItem('theme');

window.theme = theme ? theme : "light";
window.nodeStatus = false;

const initState = {
    locale: 'en',
    theme: theme ? theme : 'light',
    sidebarShow: true,
    nodeStatus: false,
    account: null,
    node: null,
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
