import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { map } from 'lodash';
import { MetaFormFieldTO } from '@/CodeDefine/Operation/MetaFormFieldTO';

interface ControlsInfoProps {
  FieldList: MetaFormFieldTO[];
}

export default function ControlsInfo(props: ControlsInfoProps) {
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      key: '_index',
      width: 80,
      render: (_, record, idx) => {
        return idx + 1;
      },
    },
    {
      title: '标题',
      dataIndex: 'Name',
    },
    {
      title: '控件名称',
      width: 120,
      key: '_ControlName',
      render: (_, record) => {
        return record.Code?.split('_')?.[0];
      },
    },
    // {
    //   title: '自定义',
    //   width: 100,
    //   key: 'isCustomData',
    //   render: (_, record) => {
    //     return record.isCustomData ? '是' : '否';
    //   },
    // },
    {
      title: '关联实体',
      width: 220,
      key: 'LinkTable',
      render: (_, record) => {
        return record.LinkTable;
      },
    },
    {
      title: '关联元数据字段',
      width: 220,
      fixed: true,
      key: 'LinkTableField',
      render: (_, record) => {
        return record.LinkTableField;
      },
    },
  ];
  const dataSource = map(props.FieldList, item => {
    const plainObj = MetaFormFieldTO.ToJson(item);
    return plainObj;
  });

  return (
    <div>
      <h3>控件信息</h3>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="Code"
        pagination={false}
      />
    </div>
  );
}
