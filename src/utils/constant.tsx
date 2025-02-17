import React from 'react';
import { ColumnType } from 'antd/es/table';
import { FixedType } from 'rc-table/es/interface';
import Tableaction from '@/components/tableaction';

interface TableActionButtons {
  label: string;
  link?: string | number;
  style: any;
  onClick?: () => void;
}

export class constant {
  // Table列表数据Index(序号)列
  public static TableIndex(config: {
    pageIdx: number;
    pageSize: number;
    fixed?: boolean | string;
    width?: number;
  }) {
    return {
      title: '序号',
      key: '_index',
      align: 'center',
      fixed: config.fixed,
      width: config.width,
      render: (text, record, index) => {
        return (
          <div style={{ minWidth: 28 }}>
            {(config.pageIdx - 1) * config.pageSize + index + 1}
          </div>
        );
      },
    };
  }

  // Table列表数据Action(操作)列
  public static TableAction(config: {
    MaxLen?: number;
    Buttons?: Array<TableActionButtons>;
    ButtonsRender?: (
      text: any,
      record: any,
      index: number,
    ) => Array<{
      label: React.ReactNode;
      link?: string | number;
      style?: any;
      onClick?: () => void;
    }>;
    fixed?: boolean | string;
    width?: number;
  }): ColumnType<any> {
    return {
      title: <span style={{ paddingLeft: 7 }}>操作</span>,
      key: '_action',
      fixed: (config.fixed && config.fixed === true
        ? 'right'
        : config.fixed) as FixedType,
      width: config.width,
      render: (text, record, index) => {
        if (config.ButtonsRender) {
          const _buttons = config.ButtonsRender(text, record, index);
          return <Tableaction MaxLen={config.MaxLen} Buttons={_buttons} />;
        }
        if (config.Buttons) {
          return (
            <Tableaction MaxLen={config.MaxLen} Buttons={config.Buttons} />
          );
        }
        return '/';
      },
    };
  }
}
