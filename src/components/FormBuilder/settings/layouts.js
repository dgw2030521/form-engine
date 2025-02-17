export const layouts = [
  {
    text: '对象',
    name: 'object',
    schema: {
      title: '对象',
      type: 'object',
      properties: {},
    },
    setting: {},
  },
  {
    text: '常规列表',
    name: 'list',
    schema: {
      title: '数组',
      type: 'array',
      items: {
        type: 'object',
        properties: {},
      },
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput',
      },
      items: {
        type: 'object',
        hidden: '{{true}}',
      },
      min: {
        title: '最小长度',
        type: 'number',
      },
      max: {
        title: '最大长度',
        type: 'number',
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean',
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string',
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string',
          },
        },
      },
    },
  },
  {
    text: '简单列表',
    name: 'simpleList',
    schema: {
      title: '数组',
      type: 'array',
      widget: 'simpleList',
      items: {
        type: 'object',
        properties: {},
      },
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput',
      },
      items: {
        type: 'object',
        hidden: '{{true}}',
      },
      min: {
        title: '最小长度',
        type: 'number',
      },
      max: {
        title: '最大长度',
        type: 'number',
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean',
          },
          hideTitle: {
            title: '隐藏标题',
            type: 'boolean',
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string',
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string',
          },
        },
      },
    },
  },
  {
    text: '表格列表',
    name: 'list2',
    schema: {
      title: '数组',
      type: 'array',
      widget: 'list2',
      items: {
        type: 'object',
        properties: {},
      },
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput',
      },
      items: {
        type: 'object',
        hidden: '{{true}}',
      },
      min: {
        title: '最小长度',
        type: 'number',
      },
      max: {
        title: '最大长度',
        type: 'number',
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean',
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string',
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string',
          },
          hideCopy: {
            title: '隐藏复制按钮',
            type: 'string',
          },
          hideMove: {
            title: '隐藏上下移动按钮',
            type: 'string',
          },
        },
      },
    },
  },
  {
    text: '复杂表格列表',
    name: 'drawerList',
    schema: {
      title: '数组',
      type: 'array',
      widget: 'drawerList',
      items: {
        type: 'object',
        properties: {},
      },
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput',
      },
      items: {
        type: 'object',
        hidden: '{{true}}',
      },
      min: {
        title: '最小长度',
        type: 'number',
      },
      max: {
        title: '最大长度',
        type: 'number',
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean',
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string',
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string',
          },
        },
      },
    },
  },
];
