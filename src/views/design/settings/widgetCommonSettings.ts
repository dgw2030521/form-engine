// import Generator, {
//     defaultCommonSettings,
//     defaultGlobalSettings,
//     defaultSettings,
//     deserialize,
//     serializeToDraft,
// } from '@/components/FormMaker';
import BackDataSetting from '@/views/design/settings/backDataSetting';
import dataRelation from '@/views/design/settings/dataRelation';
import preDataSetting from '@/views/design/settings/preDataSetting';

const widgetCommonSettings = {
  $id: {
    title: 'Name',
    description: '字段名称/英文',
    type: 'string',
    widget: 'idInput',
    hidden: true,
    required: true,
    rules: [
      {
        pattern: /^\#\/[0-9a-zA-Z_]{1,}$/g,
        message: 'Name必须是英文、数字或者下划线',
      },
    ],
  },
  title: {
    title: '标题',
    type: 'string',
    widget: 'htmlInput',
    required: true,
  },

  description: {
    title: '说明',
    description: 'tooltips',
    type: 'string',
  },
  placeholder: {
    title: '辅助提示描述',
    type: 'string',
    description: 'placeholder',
  },
  default: {
    title: '默认值',
    type: 'string',
  },
  required: {
    title: '必填',
    type: 'boolean',
  },
  disabled: {
    title: '禁用',
    type: 'boolean',
  },
  readOnly: {
    title: '只读',
    type: 'boolean',
  },
  hidden: {
    title: '隐藏',
    type: 'boolean',
  },

  displayType: {
    title: '标题展示模式',
    type: 'string',
    enum: ['row', 'column'],
    enumNames: ['同行', '单独一行'],
    widget: 'radio',
    default: 'row',
  },
  // bind: {
  //   title: '绑定字段',
  //   type: 'string',
  //   placeholder: '注意：正常不需要设置',
  //   description: '需要使用其他字段来显示值',
  // },

  ...dataRelation,
  ...preDataSetting,
  ...BackDataSetting,
};

export default widgetCommonSettings;
