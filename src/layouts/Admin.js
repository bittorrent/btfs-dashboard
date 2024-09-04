import React, { useEffect, useContext, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { mainContext } from 'reducer';
import MessageAlert from 'components/Alerts/MessageAlert';
import MessageModal from 'components/Modals/MessageModal';
import PasswordVerifyModal from 'components/Modals/PasswordVerifyModal';
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import { nodeStatusCheck, getHostConfigData } from 'services/otherService.js';
import { SimpleRoutes, MainRoutes } from 'routes/index';
import { MAIN_PAGE_MODE, SAMPLE_PAGE_MODE } from 'utils/constants';
import { getUrl } from 'utils/BTFSUtil';
import Cookies from 'js-cookie';
import { getParameterByName } from 'utils/BTFSUtil.js';
import { urlCheck } from 'utils/checks.js';



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
  Title,
  Tooltip,
} from 'chart.js';

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

const routeConfig = {};
routeConfig[MAIN_PAGE_MODE] = MainRoutes;
routeConfig[SAMPLE_PAGE_MODE] = SimpleRoutes;

export default function Admin() {
  const { dispatch, state } = useContext(mainContext);
  const { theme, sidebarShow, pageMode } = state;
  const [isGetSimpleMode, setIsGetSimpleMode] = useState(false);
  const history = useHistory();


  const getPageMode = async () => {
    const data = await getHostConfigData();
    if (data) {
      const { SimpleMode, S3CompatibleAPI, Addresses } = data;
      const pageMode = SimpleMode ? SAMPLE_PAGE_MODE : MAIN_PAGE_MODE;
      const s3ApiUrl = S3CompatibleAPI?.Address;
      const addressConfig = Addresses;
      if(addressConfig){
        addressConfig.Gateway = getUrl(addressConfig.Gateway, true);
      }
      localStorage.setItem('pageMode', pageMode);
      dispatch({
        type: 'SET_PAGE_MODE',
        pageMode: pageMode,
      });

      dispatch({
        type: 'SET_S3_API_URL',
        s3ApiUrl: getUrl(s3ApiUrl),
      });


      dispatch({
        type: 'SET_ADDRESS_CONFIG',
        addressConfig: addressConfig,
      });

    }
    setIsGetSimpleMode(true);
    const isMainMode = MAIN_PAGE_MODE === pageMode;
    return isMainMode;
  };

  const init = async () => {
    const apiUrl = getParameterByName('api', window.location.href);
    let NODE_URL = localStorage.getItem('NODE_URL')
        ? localStorage.getItem('NODE_URL')
        : 'http://localhost:5001';
    if (apiUrl && urlCheck(apiUrl) && NODE_URL !== apiUrl) {
        NODE_URL = apiUrl;
    }

    const token = Cookies.get(NODE_URL)
    if(!token){
      history.push('/login');
      return;
    }
    const isMainMode = await getPageMode();
    // if (!NODE_URL && !window.location.href.includes('/admin/settings')) {
    //   history.push('/admin/settings');
    // } else {
      // check node status
      window.loading = true;
      let result = await nodeStatusCheck(NODE_URL, isMainMode);
      if (result) {
        window.loading = false;
        window.nodeStatus = true;
        dispatch({
          type: 'SET_NODE_STATUS',
          nodeStatus: true,
        });
      } else {
        window.loading = false;
        window.nodeStatus = false;//  false;// false;
        dispatch({
          type: 'SET_NODE_STATUS',
          nodeStatus: false,
        });
      }
    // }
    window.body = document.getElementsByTagName('body')[0];
  };

  useEffect(() => {
    // 检查登录状态

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    isGetSimpleMode &&
    <>
      <Sidebar />
      <div
        className={'relative theme-base-bg ' + (sidebarShow ? 'md:ml-64' : 'md:ml-0')}
        style={{ minHeight: '100vh' }}>
        <AdminNavbar />
        <div className="p-4 pb-6 md:px-8 mx-auto w-full">
          <Switch>
            {routeConfig[pageMode].map(item => {
              return (
                <Route key={item.path} path={item.path} exact component={item.component} />
              )
            })}
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
      <MessageModal color={theme} />
      <PasswordVerifyModal color={theme} />
      <MessageAlert />
    </>
  );
}
