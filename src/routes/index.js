import { AsyncComponent } from 'asyncComponent.js';

const asyncDashboard = AsyncComponent(() => import(/* webpackChunkName: "dashboard" */ 'views/admin/Dashboard.js'));
const asyncPeers = AsyncComponent(() => import(/*  webpackChunkName: "peers" */ 'views/admin/Peers.js'));
const asyncSettings = AsyncComponent(() => import(/*  webpackChunkName: "settings" */ 'views/admin/Settings.js'));
const asyncProxy = AsyncComponent(() => import(/*  webpackChunkName: "settings" */ 'views/admin/Proxy.js'));
const asyncFiles = AsyncComponent(() => import(/*  webpackChunkName: "files" */ 'views/admin/Files.js'));
const asyncCheque = AsyncComponent(() => import(/*  webpackChunkName: "cheque" */ 'views/admin/Cheque.js'));
const asyncHeartBeats = AsyncComponent(() => import(/*  webpackChunkName: "cheque" */ 'views/admin/HeartBeats.js'));

const asyncLogin = AsyncComponent(() => import(/*  webpackChunkName: "cheque" */ 'views/login/Login.js'));


const LoginRoutes = [
    // { path: '/login/endpoint', component: asyncLogin },
    { path: '/login', component: asyncLogin },
    // { path: '/login/set', component: asyncLogin },
    // { path: '/login/reset', component: asyncLogin },
  ];

const SimpleRoutes = [
  { path: '/admin/dashboard', component: asyncDashboard },
  { path: '/admin/peers', component:asyncPeers },
  { path: '/admin/files', component: asyncFiles },
  { path: '/admin/settings', component: asyncSettings },
  { path: '/admin/proxy', component: asyncProxy },
];

const MainRoutes = [
  ...SimpleRoutes,
  { path: '/admin/cheque', component: asyncCheque },
  { path: '/admin/onlineproof', component: asyncHeartBeats },
];




export {
    SimpleRoutes,
    MainRoutes,
    LoginRoutes
}
