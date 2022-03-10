/*eslint-disable*/
import React from "react";
import {Link} from "react-router-dom";
import LangToggle from "components/Toggles/LangToggle.js";
import ThemeToggle from "components/Toggles/ThemeToggle.js";

export default function Navbar(props) {

    return (
        <>
            <nav
                className="top-0 z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">

                        Welcome to BTFS 2.0

                    </div>
                    <div className="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none block">

                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">

                            <li className="flex items-center">
                                <div className="ml-4">
                                    <LangToggle/>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
