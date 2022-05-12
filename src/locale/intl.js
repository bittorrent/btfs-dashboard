import React, {useContext} from 'react'
import {IntlProvider} from 'react-intl'
import {mainContext} from '../reducer'
import en_US from "./en";
import zh_CN from "./zh";
import es_ES from './es';

const Inter = (props) => {

    const {state} = useContext(mainContext);

    const chooseLocale = (val) => {
        //  let _val = val || navigator.language.split('_')[0];
        switch (val) {
            case 'en':
                return en_US;
            case 'zh':
                return zh_CN;
            case 'es':
                return es_ES;
            default:
                return en_US;
        }
    };

    let locale = state.locale;
    let {children} = props;

    return (
        <IntlProvider
            locale={locale}
            defaultLocale='en'
            messages={chooseLocale(locale)}
        >
            {children}
        </IntlProvider>
    )
};

export default Inter
