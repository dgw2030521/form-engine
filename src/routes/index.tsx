import React from 'react';

import NotFound from '@/components/NotFound';
import BasicLayout from '@/layouts/BasicLayout';
import Demo from '@/views/demo';
import Home from '@/views/home';

import designRoutes from './design';
import formListRoutes from './formList';
import metaModelRoutes from './metaModel';

const routes = [
  {
    path: '/',
    handle: {
      title: '表单引擎 ',
    },
    element: <BasicLayout />,
    children: [
      {
        index: true,
        handle: {
          title: '首页 ',
        },
        element: <Home />,
      },
      {
        path: '/demo',
        element: <Demo />,
      },
      ...formListRoutes,
      ...metaModelRoutes,
      ...designRoutes,
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
export default routes;
