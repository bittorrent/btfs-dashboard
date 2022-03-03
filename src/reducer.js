import React, {useReducer} from 'react'

const CHANGE_LOCALE = 'CHANGE_LOCALE';
const CHANGE_THEME = 'CHANGE_THEME';

const mainContext = React.createContext();

const initState = {
    locale: 'en',
    theme: 'light',
};

const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_LOCALE:
            return {...state, locale: action.locale || 'en'};
        case CHANGE_THEME:
            return {...state, theme: action.theme || 'light'};
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
