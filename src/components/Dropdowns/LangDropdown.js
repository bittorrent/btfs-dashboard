/*eslint-disable*/
import React, {useContext} from "react";
import {mainContext} from 'reducer'

const LangDropdown = () => {

    const {dispatch, state} = useContext(mainContext);
    const {locale} = state;

    const changeLang = (e, lang) => {
        dispatch({
            type: 'CHANGE_LOCALE',
            locale: lang
        })
    };

    return (
        <>
            <a className="text-blueGray-500 block"
               onClick={(e) => {
                   changeLang(e, (locale === "zh" ? "en" : "zh"));
               }}>
                <div className={"items-center flex " + (locale === "en" ? "en" : "zh")}></div>
            </a>
        </>
    );
};

export default LangDropdown;
