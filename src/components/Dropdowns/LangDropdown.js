import{useContext, useState} from "react";
import {mainContext} from 'reducer'
import { Popover } from "antd";

export default function LangDropdown() {
    const {dispatch, state} = useContext(mainContext);
    const {locale} = state;

    const [visible, setVisible] = useState(false);

    const localeMap = {
        zh: '中文',
        en: 'English',
        es: 'Español'
    }

    const handleVisibleChange = (visible) => {
        setVisible(visible);
    };

    const changeLang = (e, lang) => {
        setVisible(false);
        dispatch({
            type: 'CHANGE_LOCALE',
            locale: lang
        })
    };
  const content = (
    <ul>
                {Object.keys(localeMap).map(key => {
                    return (
                        <li
                            key={key}
                            className={`${locale === key ? 'text-lightBlue-600 font-bold' : '' } cursor-pointer hover:text-lightBlue-600 p-2`}
                            onClick={(e) => {
                                changeLang(e, (key));
                            }}>
                               {localeMap[key]}
                        </li>
                    )
                })}
            </ul>
  );
  return (
    <Popover
      color="#fff"
      placement="right"
      content={content}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <button className="bg-indigo-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs py-2 w-90-px rounded shadow hover:shadow-md outline-none focus:outline-none">{localeMap[locale]}</button>
    </Popover>
  );
}
