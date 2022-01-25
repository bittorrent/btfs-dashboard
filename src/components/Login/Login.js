import React, {useContext} from "react";
import {mainContext} from 'reducer'
import {Dropdown, Menu} from 'antd';
import themeStyle from "utils/themeStyle.js";
import {connect, disConnect} from "utils/connect.js";
import {Truncate} from "utils/text.js";

const Login = ({color}) => {

    const {dispatch, state} = useContext(mainContext);
    const {account} = state;

    const link = (e, wallet) => {
        connect(wallet, dispatch);
    };

    const disLink = () => {
        disConnect(dispatch);
    };

    const connectMenu = (<Menu>
        <Menu.Item key='english'>
            <a id="english"
               className={"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent "}
               onClick={(e) => {
                   link(e, 'tron')
               }}>
                TRONLink
            </a>
        </Menu.Item>
        <Menu.Item key='chinese'>
            <a id="chinese"
               className={"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent "}
               onClick={(e) => {
                   link(e, 'eth')
               }}>
                MetaMask
            </a>
        </Menu.Item>
    </Menu>);

    const logoutMenu = (<Menu>
        <Menu.Item key='logout'>
            <a id="logout"
               className={"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent "}
               onClick={(e) => {
                   disLink(e);
               }}>
                Log out
            </a>
        </Menu.Item>
    </Menu>);

    return (
        <>
            <div className={"mr-3 " + themeStyle.bg[color]}>
                {!account &&
                <Dropdown overlay={connectMenu} placement="bottomCenter" overlayClassName="connect">
                    <button
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        Connect
                    </button>
                </Dropdown>}
                {account &&
                <Dropdown overlay={logoutMenu} placement="bottomCenter" overlayClassName="logout">
                    <button
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                    >
                        <Truncate>{account.address}</Truncate>
                    </button>
                </Dropdown>}
            </div>
        </>
    );
};

export default Login;
