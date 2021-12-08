/*eslint-disable*/
import React, {useCallback, useContext} from "react";
import {mainContext} from "reducer";
import LangDropdown from "components/Dropdowns/LangDropdown.js";
import ThemeToggle from "components/Toggles/ThemeToggle";
import themeStyle from "utils/themeStyle.js";

export default function AdminNavbar({color}) {
    const {dispatch, state} = useContext(mainContext);
    const {theme, sidebarShow} = state;

    const sidebarToggle = useCallback(() => {
        dispatch({
            type: 'CHANGE_SIDEBAR',
            sidebarShow: true
        });
    }, []);

    return (
        <>
            <nav
                className="hidden top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start md:flex items-center py-5">
                <div className={"ml-2 hidden " + (!sidebarShow ? "md:flex" : "") +  themeStyle.link[theme]} onClick={sidebarToggle} >
                    <i className="fas fa-indent" style={{fontSize: '24px', float: 'left'}}></i>
                </div>

                <div
                    className="w-full mx-auto items-center hidden md:flex md:flex-nowrap flex-wrap md:px-10 px-4">

                    <div className='flex-1'>
                    <ThemeToggle/>
                    </div>

                    <ul className="flex-col md:flex-row list-none items-center md:flex">
                        <LangDropdown color={color}/>
                    </ul>

                </div>
            </nav>
        </>
    );
}
