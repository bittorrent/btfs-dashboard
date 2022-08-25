/*eslint-disable*/
import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {mainContext} from "reducer";
import LangDropdown from "components/Dropdowns/LangDropdown.js";
import ThemeToggle from "components/Toggles/ThemeToggle";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function Sidebar() {
    const {dispatch, state} = useContext(mainContext);
    const {sidebarShow, theme} = state;
    const [collapseShow, setCollapseShow] = useState("hidden");

    const sidebarToggle = () => {
        dispatch({
            type: 'CHANGE_SIDEBAR',
            sidebarShow: false
        });
    };

    const collapse = () => {
        setCollapseShow("hidden");
    };

    return (
        <>
            <nav className={"md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative z-10 py-4 px-6 " + (themeStyle.bg[theme]) + (sidebarShow ? "md:w-64" : "md:hidden")}>
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggle */}
                    <button className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() => setCollapseShow(" m-2 py-3 px-6 ")}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    {/* Brand */}
                    <div className={"flex justify-between " + themeStyle.link[theme]}>
                        <div className="items-center">
                            <Link className={"text-left mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold px-0" + themeStyle.link[theme]} to="/">
                                <img className="inline-block" src={require('assets/img/btfs_logo.png').default} style={{width: '37px', height: '40px'}}/>
                                BTFS 2.0
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center cursor-pointer" onClick={sidebarToggle}>
                            <i className="fas fa-outdent" style={{fontSize: '24px', float: 'right'}}></i>
                        </div>
                    </div>
                    <ul className="md:hidden items-center flex flex-wrap list-none">
                        <li className="inline-block relative">
                            <LangDropdown color={theme}/>
                        </li>
                    </ul>
                    {/* Collapse */}
                    <div className={"md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded justify-between " +
                            collapseShow + themeStyle.bg[theme]
                        }
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                            <div className="flex justify-between items-center">
                                <div className="w-4/12">
                                    <Link className={"md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0 " + themeStyle.text[theme]} to="/">
                                        BTFS 2.0
                                    </Link>
                                </div>
                                <div className="w-4/12 flex flex-row-reverse">
                                    <button
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        type="button"
                                        onClick={() => setCollapseShow("hidden")}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Search */}
                        <div>
                            {/* Divider */}
                            <hr className="my-4 md:min-w-full hidden md:block"/>
                            {/* Navigation */}
                            <ul className="md:flex-col md:min-w-full flex flex-col list-none uppercase text-xs font-bold" onClick={collapse}>
                                <li className="items-center">
                                    <Link className={"py-3 font-bold block hover:text-lightBlue-600 " +
                                    (window.location.href.indexOf("/admin/dashboard") !== -1
                                        ? "text-lightBlue-500 "
                                        : (themeStyle.link[theme]))}
                                          to="/admin/dashboard">
                                        <i className={"w-5 fas fa-tv mr-2 text-sm " + (window.location.href.indexOf("/admin/dashboard") !== -1 ? "" : "opacity-50")}></i>{" "}
                                        {t('dashboard')}
                                    </Link>
                                </li>

                                <li className="items-center">
                                    <Link className={"py-3 block hover:text-lightBlue-600 " +
                                    (window.location.href.indexOf("/admin/cheque") !== -1
                                        ? "text-lightBlue-500 "
                                        : (themeStyle.link[theme]))}
                                          to="/admin/cheque">
                                        <i className={"w-5 fas fa-file-invoice-dollar mr-2 text-sm " + (window.location.href.indexOf("/admin/cheque") !== -1 ? "" : "opacity-50")}></i>{" "}
                                        {t('cheques')}
                                    </Link>
                                </li>

                                <li className="items-center">
                                    <Link className={"py-3 block hover:text-lightBlue-600 " +
                                    (window.location.href.indexOf("/admin/onlineproof") !== -1
                                        ? "text-lightBlue-500 "
                                        : (themeStyle.link[theme]))}
                                          to="/admin/onlineproof">
                                        <i className={"w-5 fab fa-chromecast mr-2 text-sm " + (window.location.href.indexOf("/admin/onlineproof") !== -1 ? "" : "opacity-50")}></i>{" "}
                                        {t('heartbeats')}
                                    </Link>
                                </li>

                                <li className="items-center">
                                    <Link className={"py-3 block hover:text-lightBlue-600 " +
                                    (window.location.href.indexOf("/admin/peers") !== -1
                                        ? "text-lightBlue-500 "
                                        : (themeStyle.link[theme]))}
                                          to="/admin/peers">
                                        <i className={"w-5 fas fa-map-marked mr-2 text-sm " + (window.location.href.indexOf("/admin/peers") !== -1 ? "" : "opacity-50")}></i>{" "}
                                        {t('peers')}
                                    </Link>
                                </li>

                                <li className="items-center">
                                    <Link className={"py-3 block hover:text-lightBlue-600 " +
                                    (window.location.href.indexOf("/admin/files") !== -1
                                        ? "text-lightBlue-500 "
                                        : (themeStyle.link[theme]))}
                                          to="/admin/files">
                                        <i className={"w-5 fas fa-file-alt mr-2 text-sm " + (window.location.href.indexOf("/admin/files") !== -1 ? "" : "opacity-50")}></i>{" "}
                                        {t('files')}
                                    </Link>
                                </li>

                                <li className="items-center">
                                    <Link className={"py-3 block hover:text-lightBlue-600 " +
                                    (window.location.href.indexOf("/admin/settings") !== -1
                                        ? "text-lightBlue-500 "
                                        : (themeStyle.link[theme]))}
                                          to="/admin/settings">
                                        <i className={"w-5 fas fa-tools mr-2 text-sm " + (window.location.href.indexOf("/admin/settings") !== -1 ? "" : "opacity-50")}></i>{" "}
                                        {t('settings')}
                                    </Link>
                                </li>

                            </ul>
                        </div>

                        <div className=''>
                            {/* Navigation */}
                            <ul className="md:flex-col md:min-w-full flex flex-col list-none mb-4">
                                <li className="items-center">
                                    <a className={"text-xs py-3 block" + (themeStyle.link[theme])}>
                                        {t('version')} 2.2.1
                                    </a>
                                </li>

                                <li className="items-center">
                                    <a className={" text-xs  py-3  block" + (themeStyle.link[theme])}
                                       href='https://github.com/bittorrent/btfs-dashboard'
                                       target='_blank'
                                    >
                                        {t('view_code')}
                                    </a>
                                </li>

                                <li className="items-center">
                                    <a className={" text-xs  py-3  block" + (themeStyle.link[theme])}
                                       href='https://github.com/bittorrent/btfs-dashboard/issues'
                                       target='_blank'
                                    >
                                        {t('report_bugs')}
                                    </a>
                                </li>

                                <li className="items-center">
                                    <a className={" text-xs  py-3  block" + (themeStyle.link[theme])}
                                       href='https://docs.google.com/forms/d/e/1FAIpQLSeH1Vhm4C6tcsI80gLzUQ58cuYtMHj3LEQFx_STAqWNoCP3Ew/viewform'
                                       target='_blank'
                                    >
                                        {t('contact_us')}
                                    </a>
                                </li>
                            </ul>

                            <div className="flex justify-between items-center">
                                <LangDropdown color={theme}/>
                                <ThemeToggle/>
                            </div>

                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
