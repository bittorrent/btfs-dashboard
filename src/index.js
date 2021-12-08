import React from "react";
import ReactDOM from "react-dom";
import {HashRouter, Route, Switch, Redirect} from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import 'antd/dist/antd.css';
import "assets/styles/tailwind.css";
import 'assets/styles/main.scss';

import Admin from "layouts/Admin.js";

import {ContextProvider} from './reducer'
import Inter from './locale/intl';

ReactDOM.render(
    <ContextProvider>
        <Inter>
            <HashRouter>
                <Switch>
                    <Route path="/admin" component={Admin}/>
                    <Redirect from="*" to="/admin"/>
                </Switch>
            </HashRouter>
        </Inter>
    </ContextProvider>,
    document.getElementById("root")
);
