export default {
  __BackDataRelation: {
    title: '回写数据配置',
    type: 'object',
    labelWidth: 80,
    properties: {
      __type: {
        title: '是否关联数据',
        type: 'string',
        default: 'metadata',
        // enum: ['metadata', 'customize'],
        // enumNames: ['关联元数据', '自定义'],
        enum: ['metadata'],
        enumNames: ['关联元数据'],
        required: true,
        hidden: true,
      },
      __maxLength: {
        title: '输入最大长度',
        type: 'number',
        required: true,
        hidden: '{{rootValue.__type!=="customize"}}',
      },
      __secret: {
        title: '是否加密',
        type: 'boolean',
        required: true,
        enum: [true, false],
        enumNames: ['是', '否'],
        default: false,
        hidden: '{{rootValue.__type!=="customize"}}',
      },
      __union: {
        title: '是否校验唯一性 ',
        type: 'boolean',
        required: true,
        enum: [true, false],
        enumNames: ['是', '否'],
        default: false,
        hidden: '{{rootValue.__type!=="customize"}}',
      },
      __mataDataConfig: {
        hidden: '{{rootValue.__type!=="metadata"}}',
        type: 'object',
        required: true,
        // 元数据关联使用自定义的组件
        widget: 'BackDataSetting',
      },
    },
  },
};
