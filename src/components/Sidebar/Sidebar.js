/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mainContext } from 'reducer';
import LangDropdown from 'components/Dropdowns/LangDropdown.js';
import ThemeToggle from 'components/Toggles/ThemeToggle';
import AccountLock from 'components/Lock/AccountLock';

import { getHostInfo } from 'services/dashboardService.js';
import { MAIN_PAGE_MODE, SAMPLE_PAGE_MODE } from 'utils/constants';
import HostID from './HostID';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';


const dashboardLink = { path: '/admin/dashboard', text: t('dashboard'), iconClass: ' iconfont BTFS_icon_Dashboard ' };
const chequeLink = { path: '/admin/cheque', text: t('cheques'), iconClass: ' iconfont BTFS_icon_Cheques  icon-cheques' };
const onlineProofLink = { path: '/admin/onlineproof', text: t('heartbeats'), iconClass: ' iconfont BTFS_icon_a-OnlineProof ' };
const peersLink = { path: '/admin/peers', text: t('peers'), iconClass: ' iconfont BTFS_icon_Peers ' };
const filesLink = { path: '/admin/files', text: t('files'), iconClass: ' iconfont BTFS_icon_Files ' };
const settingsLink =  { path: '/admin/settings', text: t('settings'), iconClass: ' iconfont BTFS_icon_Settings ' };
const proxyLink =  { path: '/admin/proxy', text: t('proxy'), iconClass: ' iconfont BTFS_icon_Settings ' };

const MainNavLinksConfig = [
    dashboardLink,
    chequeLink,
    proxyLink,
    onlineProofLink,
    peersLink,
    filesLink,
    settingsLink,
];

const SimpleNavLinksConfig = [
    dashboardLink,
    proxyLink,
    peersLink,
    filesLink,
    settingsLink,
];

const NavLinksConfig = {};
NavLinksConfig[MAIN_PAGE_MODE] = MainNavLinksConfig;
NavLinksConfig[SAMPLE_PAGE_MODE] = SimpleNavLinksConfig;

const LinkLi = ({ path, text, iconClass }) => {
    const isFocused = window.location.href.indexOf(path) !== -1;

    return (
        <li className="">
            <Link
                className={
                    'p-3 font-bold block rounded-md nav-link-li' +
                    (isFocused ? ' theme-text-main theme-fill-gray' : ' theme-text-sub-info')
                }
                to={path}>
                <i className={'w-5 mr-2 text-sm ' + iconClass}></i> {text}
            </Link>
        </li>
    );
};

export default function Sidebar() {
    const { dispatch, state } = useContext(mainContext);
    const { sidebarShow, theme, pageMode } = state;
    const [collapseShow, setCollapseShow] = useState('hidden');
    const [ID, setID] = useState('');
    const isSimpleMode = pageMode === SAMPLE_PAGE_MODE;

    useEffect(() => {
      const fetchData = async () => {
        const res = await getHostInfo();
        setID(res?.ID || '');
      };
      fetchData();
      Emitter.on('getHostId', fetchData);
      return () => {
        Emitter.removeListener('getHostId');
      };
    }, []);

    const sidebarToggle = () => {
        dispatch({
            type: 'CHANGE_SIDEBAR',
            sidebarShow: false,
        });
    };

    const collapse = () => {
        setCollapseShow('hidden');
    };

    return (
        <nav className={'sidebar theme-bg' + (sidebarShow ? ' md:w-64' : ' md:hidden')}>
            <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                {/* Toggle */}
                <button
                    className="theme-round-btn px-2 py-1 rounded border md:hidden"
                    type="button"
                    onClick={() => setCollapseShow(' m-2 py-3 px-6 ')}>
                    <i className="fas fa-bars"></i>
                </button>
                {/* Brand */}
                <div className={'flex justify-between'}>
                    <div className="items-center">
                        <Link className={`${isSimpleMode ? 'flex' : 'inline-block'} text-left mr-0  whitespace-nowrap text-sm font-bold px-0`} to="/">
                            <img
                                className="inline-block"
                                src={require('assets/img/btfs_logo.png').default}
                                style={{ width: '37px', height: '40px' }}
                                alt="btfs_logo"
                            />
                            { isSimpleMode ?
                                <div className="flex flex-col justify-end">
                                    <div>
                                        <span className="theme-text-main">BTFS Dashboard</span>
                                        <span className="theme-text-base"> 4.1</span>
                                    </div>
                                    <img
                                        className="inline-block"
                                        src={require('assets/img/simple-mode-icon.png').default}
                                        style={{ width: '65px', height: '15px' }}
                                        alt="btfs_logo"
                                    />
                                </div> :
                                <>
                                    <span className="theme-text-main">BTFS Dashboard</span>
                                    <span className="theme-text-base"> 4.1</span>
                                </>
                            }


                        </Link>
                    </div>
                    <button
                        className="hidden md:block theme-toggle-btn"
                        style={{ outline: 'none' }}
                        onClick={sidebarToggle}>
                        <i className="fas fa-outdent" style={{ fontSize: '24px', float: 'right' }}></i>
                    </button>
                </div>
                <ul className="md:hidden items-center flex flex-wrap list-none">
                    <li className="inline-block relative">
                        <LangDropdown color={theme} />
                    </li>
                </ul>
                {/* Collapse */}
                <div
                    className={
                        'theme-bg md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded justify-between ' +
                        collapseShow
                    }>
                    {/* Collapse header */}
                    <div className="md:min-w-full md:hidden block">
                        <div className="flex justify-between items-center">
                            <div className="w-4/12">
                                <Link
                                    className={
                                        'theme-sidebar-link md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0'
                                    }
                                    to="/">
                                    BTFS 4.1.0
                                </Link>
                            </div>
                            <div className="w-4/12 flex flex-row-reverse">
                                <button
                                    className="theme-round-btn rounded-full h-6 w-6 p-0 font-bold md:hidden"
                                    // className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                    onClick={() => setCollapseShow('hidden')}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Search */}
                    <div>
                        {/* HostID */}
                        {ID && ID !== '' && <HostID ID={ID} />}
                        {/* Navigation */}
                        <ul
                            className="md:flex-col md:min-w-full flex flex-col list-none  text-xs font-bold"
                            onClick={collapse}>
                            {NavLinksConfig[pageMode].map(({ path, text, iconClass }) => (
                                <LinkLi key={path} path={path} text={text} iconClass={iconClass} />
                            ))}
                        </ul>
                    </div>

                    <div className="">
                        {/* Navigation */}
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none mb-4">
                            <li className="items-center">
                                <a className={'sidebar-link theme-sidebar-link'}>{t('version')} 4.1.0</a>
                            </li>

                            <li className="items-center">
                                <a
                                    className={'sidebar-link theme-sidebar-link'}
                                    href="https://docs.btfs.io/docs/btfs-dashboard"
                                    target="_blank"
                                    rel="noreferrer">
                                    {t('read_doc')}
                                </a>
                            </li>
                            <li className="items-center">
                                <a
                                    className={'sidebar-link theme-sidebar-link'}
                                    href="https://github.com/bittorrent/btfs-dashboard"
                                    target="_blank"
                                    rel="noreferrer">
                                    {t('view_code')}
                                </a>
                            </li>

                            <li className="items-center">
                                <a
                                    className={'sidebar-link theme-sidebar-link'}
                                    href="https://github.com/bittorrent/btfs-dashboard/issues"
                                    target="_blank"
                                    rel="noreferrer">
                                    {t('report_bugs')}
                                </a>
                            </li>

                            <li className="items-center">
                                <a
                                    className={'sidebar-link theme-sidebar-link'}
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSeH1Vhm4C6tcsI80gLzUQ58cuYtMHj3LEQFx_STAqWNoCP3Ew/viewform"
                                    target="_blank"
                                    rel="noreferrer">
                                    {t('contact_us')}
                                </a>
                            </li>
                        </ul>

                        <div className="flex items-center">
                            <ThemeToggle />
                            <LangDropdown />
                            <AccountLock/>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
