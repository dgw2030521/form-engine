import { elements } from './elements';
import { baseCommonSettings } from './baseCommonSettings';
import { defaultCommonSettings } from './defaultCommonSettings';
import { advancedElements } from './advancedElements';
import { layouts } from './layouts';
import { defaultGlobalSettings } from './defaultGlobalSettings';

export {
  elements,
  baseCommonSettings,
  defaultCommonSettings,
  advancedElements,
  layouts,
  defaultGlobalSettings,
};

const saves = [
  {
    text: '复杂结构样例',
    name: 'something',
    schema: {
      title: '对象',
      description: '这是一个对象类型',
      type: 'object',
      properties: {
        inputName: {
          title: '简单输入框',
          type: 'string',
        },
        selectName: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        dateName: {
          title: '时间选择',
          type: 'string',
          format: 'date',
        },
        listName: {
          title: '对象数组',
          description: '对象数组嵌套功能',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rangeName: {
                title: '日期/时间范围',
                type: 'range',
                format: 'date',
                props: {
                  placeholder: ['开始日期', '结束日期'],
                },
              },
            },
          },
        },
      },
    },
  },
];

export const defaultSettings = [
  {
    title: '基础组件',
    widgets: elements,
    show: true,
    useCommon: true, // TODO: 是否将common
  },
  {
    title: '高级组件',
    widgets: advancedElements,
  },
  {
    title: '布局组件',
    widgets: layouts,
  },
  {
    title: '模板',
    widgets: saves,
  },
];
