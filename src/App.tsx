/**
 * 首页，不在router的context之中，所有hooks调用在BasicLayout中
 */
import { ConfigProvider } from 'antd';
// import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import store from '@/store';

import routes from './routes';
import { LoginProvider } from './store/user';

const router = createBrowserRouter(routes, {
  // 解决打包后路径错误的问题
  basename: import.meta.env.VITE_PUBLIC_PATH,
});

// 从本地加载之前的登录信息
const initUserInfo: Partial<any> = {
  Token: localStorage.getItem('token_name'),
  TokenExpireTime: localStorage.getItem('tokenExpireTime'),
  TokenUpdateCode: localStorage.getItem('tokenUpdateCode'),
  ID: localStorage.getItem('ID'),
  Name: localStorage.getItem('Name'),
  UUKey: localStorage.getItem('UUKey'),
  LoginScriptValue: localStorage.getItem('LoginScriptValue'),
};

const App = () => {
  // 定制主题 https://ant.design/docs/react/customize-theme-cn
  return (
    <Provider store={store}>
      <ConfigProvider
      // locale={zhCN}
      // theme={{ algorithm: [darkAlgorithm, compactAlgorithm] }}
      >
        <LoginProvider initUserInfo={initUserInfo}>
          <RouterProvider router={router} />
        </LoginProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
