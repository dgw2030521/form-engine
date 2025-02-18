import metaEnumList from '@/views/design/settings/mateEnumList';

export default {
  __datasourceType: {
    title: '配置展示数据',
    type: 'string',
    default: 'customize',
    enum: ['metadata', 'customize'],
    enumNames: ['关联元数据枚举', '自定义'],
  },
  enumList: {
    title: '',
    type: 'array',
    widget: 'simpleList',
    className: 'frg-options-list',
    items: {
      type: 'object',
      properties: {
        value: {
          title: '',
          type: 'string',
          className: 'frg-options-input',
          props: {},
          placeholder: '字段',
        },
        label: {
          title: '',
          type: 'string',
          className: 'frg-options-input',
          props: {},
          placeholder: '名称',
        },
      },
    },
    props: {
      hideMove: true,
      hideCopy: true,
    },
    hidden: '{{rootValue.__datasourceType==="metadata"}}',
  },
  ...metaEnumList,
};
