import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.css';
import 'antd/dist/antd.min.css';
import 'assets/icon/iconfont.css';
import 'assets/styles/overwrite.scss';
import 'assets/styles/tailwind.css';
import 'assets/styles/tailwindAddition.scss';
import 'assets/styles/main.scss';
import 'assets/styles/themeLight.scss';
import 'assets/styles/themeDark.scss';
import 'assets/styles/themeAntd.scss';
import 'assets/styles/index.css';
import './assets/styles/main.scss';


import Admin from 'layouts/Admin.js';
// import Login from 'layouts/Login.js';
import Login from 'views/login/Login';


import { ContextProvider } from './reducer';
import Inter from './locale/intl';

ReactDOM.render(
    <ContextProvider>
        <Inter>
            <HashRouter>
                <Switch>
                    <Route path="/admin" component={Admin} />
                    <Route path="/login" component={Login} />
                    <Redirect from="*" to="/admin" />
                </Switch>
            </HashRouter>
        </Inter>
    </ContextProvider>,
    document.getElementById('root')
);
