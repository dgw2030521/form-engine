export const defaultGlobalSettings = {
  type: 'object',
  properties: {
    column: {
      title: '整体布局',
      type: 'number',
      enum: [1, 2, 3],
      enumNames: ['一行一列', '一行二列', '一行三列'],
      props: {
        placeholder: '默认一行一列',
        allowClear: true,
      },
      default: 1,
    },
    width: {
      title: '元素宽度',
      type: 'string',
      widget: 'percentSlider',
    },
    labelWidth: {
      title: '标签宽度',
      description: '默认值120',
      type: 'number',
      widget: 'slider',
      max: 400,
      default: 120,
      props: {
        hideNumber: true,
      },
    },

    displayType: {
      title: '标签展示模式',
      type: 'string',
      enum: ['row', 'column'],
      enumNames: ['同行', '单独一行'],
      widget: 'radio',
      default: 'row',
    },
    colon: {
      title: '显示冒号',
      type: 'boolean',
      props: {},
      default: true,
    },
    readOnly: {
      title: '表单只读',
      type: 'boolean',
      props: {},
      default: false,
    },
    disabled: {
      title: '禁用全部表单',
      type: 'boolean',
      props: {},
      default: false,
    },
  },
};
