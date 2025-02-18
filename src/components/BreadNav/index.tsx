/**
 * 面包屑导航
 * @description:
 * @author: guowei.dong
 * @created: 2023-01-10 15:48:00
 */
import { Breadcrumb } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';

interface BreadcrumbProps {
  separator?: any;
}

export default function BreadNav(props: BreadcrumbProps) {
  const currentMenu = useAppSelector(state => state.mainState.currentMenu);

  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>首页</Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`${currentMenu?.path}`}>{currentMenu?.label}</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
