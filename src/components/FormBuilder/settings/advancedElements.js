export const advancedElements = [
  {
    text: '日期范围',
    name: 'dateRange',
    schema: {
      title: '日期范围',
      type: 'range',
      format: 'dateTime',
      props: {
        placeholder: ['开始时间', '结束时间'],
      },
    },
    setting: {
      format: {
        title: '类型',
        type: 'string',
        enum: ['dateTime', 'date'],
        enumNames: ['日期时间', '日期'],
        widget: 'radio',
      },
    },
  },
  {
    text: '数字（slider）',
    name: 'slider',
    schema: {
      title: '带滑动条',
      type: 'number',
      widget: 'slider',
    },
    setting: {
      default: {
        title: '默认值',
        type: 'number',
      },
    },
  },
  {
    text: '图片展示',
    name: 'image',
    schema: {
      title: '图片展示',
      type: 'string',
      format: 'image',
    },
    setting: {},
  },
  {
    text: '颜色选择',
    name: 'color',
    schema: {
      title: '颜色选择',
      type: 'string',
      format: 'color',
    },
    setting: {},
  },
];
