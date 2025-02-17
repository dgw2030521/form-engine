import React from 'react';

import NotFound from '@/components/NotFound';
import BasicLayout from '@/layouts/BasicLayout';
import Demo from '@/views/demo';
import DemoDesign from '@/views/demo/design';
import Home from '@/views/home';

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
      {
        path: '/demo/design',
        element: <DemoDesign />,
      },
      ...formListRoutes,
      ...metaModelRoutes,
      // ...designRoutes,
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
export default routes;
