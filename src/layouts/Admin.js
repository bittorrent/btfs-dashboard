/*eslint-disable*/
import React, {useEffect, useContext} from "react";
import {Switch, Route, Redirect, useHistory} from "react-router-dom";
import {mainContext} from "reducer";
import MessageAlert from "components/Alerts/MessageAlert";
import MessageModal from "components/Modals/MessageModal";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import {AsyncComponent} from 'asyncComponent.js';
import {nodeStatusCheck} from "services/otherService.js";

import {
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    CategoryScale,
    Chart,
    Decimation,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    LogarithmicScale,
    PieController,
    PointElement,
    PolarAreaController,
    RadarController,
    RadialLinearScale,
    ScatterController,
    TimeScale,
    TimeSeriesScale,
    Title, Tooltip
} from "chart.js";

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
);


const asyncDashboard = AsyncComponent(
    () => import(/* webpackChunkName: "dashboard" */'views/admin/Dashboard.js'));
const asyncPeers = AsyncComponent(
    () => import(/*  webpackChunkName: "peers" */'views/admin/Peers.js'));
const asyncSettings = AsyncComponent(
    () => import(/*  webpackChunkName: "settings" */'views/admin/Settings.js'));
const asyncFiles = AsyncComponent(
    () => import(/*  webpackChunkName: "files" */'views/admin/Files.js'));
const asyncCheque = AsyncComponent(
    () => import(/*  webpackChunkName: "cheque" */'views/admin/Cheque.js'));


export default function Admin() {
    const {dispatch, state} = useContext(mainContext);
    const {theme, sidebarShow} = state;
    const history = useHistory();

    useEffect(async () => {
        const NODE_URL = localStorage.getItem('NODE_URL');
        if (!NODE_URL) {
            history.push('/admin/settings');
        } else {
            // check node status
            window.loading = true;
            let result = await nodeStatusCheck(NODE_URL);
            if (result) {
                window.loading = false;

                window.nodeStatus = true;
                dispatch({
                    type: 'SET_NODE_STATUS',
                    nodeStatus: true
                });
            } else {
                window.loading = false;
                window.nodeStatus = false;
                dispatch({
                    type: 'SET_NODE_STATUS',
                    nodeStatus: false
                });
            }
        }
    }, []);

    return (
        <>
            <Sidebar/>
            <div
                className={"relative " + (theme === "light" ? "bg-blueGray-100 " : "bg-blueGray-600 ") + (sidebarShow ? "md:ml-64" : "md:ml-0")}
                style={{minHeight: '100vh'}}>
                <AdminNavbar color={theme}/>
                <div className="p-4 pb-6 md:px-8 mx-auto w-full">
                    <Switch>
                        <Route path="/admin/dashboard" exact component={asyncDashboard}/>
                        <Route path="/admin/peers" exact component={asyncPeers}/>
                        <Route path="/admin/settings" exact component={asyncSettings}/>
                        <Route path="/admin/files" exact component={asyncFiles}/>
                        <Route path="/admin/cheque" exact component={asyncCheque}/>
                        <Redirect from="/admin" to="/admin/dashboard"/>
                    </Switch>
                </div>
            </div>
            <MessageModal color={theme}/>
            <MessageAlert/>
        </>
    );
}
