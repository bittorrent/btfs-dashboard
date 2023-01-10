import React, { useContext } from 'react';
import { mainContext } from 'reducer';

const LangDropdown = () => {
    const { dispatch, state } = useContext(mainContext);
    const { locale } = state;

    const changeLang = (e, lang) => {
        dispatch({
            type: 'CHANGE_LOCALE',
            locale: lang,
        });
    };

    return (
        <button
            className="ml-2 round-btn theme-round-btn"
            onClick={e => {
                changeLang(e, locale === 'zh' ? 'en' : 'zh');
            }}>
            {locale === 'en' ? '中' : 'En'}
        </button>
    );
};

export default LangDropdown;
