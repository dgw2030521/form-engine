// 有哪些可用的组件的配置
import BackDataSetting from '@/views/design/settings/backDataSetting';
import dataRelation from '@/views/design/settings/dataRelation';
import externalApi from '@/views/design/settings/externalApi';
import listDataSchemaConfig from '@/views/design/settings/listDataSchemaConfig';
import preDataSetting from '@/views/design/settings/preDataSetting';
import relationBtn from '@/views/design/settings/relationsBtn';

const widgetsConfig = [
  {
    title: '在线表单填写类',
    widgets: [
      {
        text: '输入框',
        name: 'input',
        schema: {
          title: '输入框',
          type: 'string',
        },
        setting: {
          ...externalApi,
        },
        // setting: {
        //   props: {
        //     title: '选项',
        //     type: 'object',
        //     labelWidth: 80,
        //     properties: {
        //       allowClear: {
        //         title: '是否带清除按钮',
        //         description: '填写内容后才会出现x哦',
        //         type: 'boolean',
        //       },
        //       addonBefore: {
        //         title: '前tab',
        //         type: 'string',
        //       },
        //       addonAfter: {
        //         title: '后tab',
        //         type: 'string',
        //       },
        //       prefix: {
        //         title: '前缀',
        //         type: 'string',
        //       },
        //       suffix: {
        //         title: '后缀',
        //         type: 'string',
        //       },
        //     },
        //   },
        //   minLength: {
        //     title: '最短字数',
        //     type: 'number',
        //   },
        //   maxLength: {
        //     title: '最长字数',
        //     type: 'number',
        //   },
        //   pattern: {
        //     title: '校验正则表达式',
        //     type: 'string',
        //     props: {
        //       placeholder: '填写正则表达式',
        //     },
        //   },
        // },
      },
      {
        text: '文本框',
        name: 'textarea',
        schema: {
          title: '文本框',
          type: 'string',
          format: 'textarea',
        },
        // setting: {
        //   props: {
        //     title: '选项',
        //     type: 'object',
        //     labelWidth: 80,
        //     properties: {
        //       autosize: {
        //         title: '高度自动',
        //         type: 'boolean',
        //       },
        //       rows: {
        //         title: '指定高度',
        //         type: 'number',
        //       },
        //     },
        //   },
        //   minLength: {
        //     title: '最短字数',
        //     type: 'number',
        //   },
        //   maxLength: {
        //     title: '最长字数',
        //     type: 'number',
        //   },
        //   pattern: {
        //     title: '校验正则表达式',
        //     type: 'string',
        //     props: {
        //       placeholder: '填写正则表达式',
        //     },
        //   },
        // },
      },
      {
        text: '日期选择',
        name: 'date',
        schema: {
          title: '日期选择',
          type: 'string',
          format: 'dateTime',
        },
        setting: {
          placeholder: {
            title: '辅助提示描述',
            type: 'string',
            description: 'placeholder',
            default: '',
          },
          format: {
            title: '格式',
            type: 'string',
            enum: ['dateTime', 'date'],
            enumNames: ['日期时间', '日期'],
            widget: 'radio',
          },
        },
      },
      {
        text: '时间选择',
        name: 'time',
        show: false,
        schema: {
          title: '时间选择',
          type: 'string',
          format: 'time',
        },
        setting: {
          format: {
            title: '格式',
            type: 'string',
            enum: ['dateTime', 'date', 'time'],
            enumNames: ['日期时间', '日期', '时间'],
          },
        },
      },
      // {
      //   text: '数字输入框',
      //   name: 'number',
      //   schema: {
      //     title: '数字输入框',
      //     type: 'number',
      //   },
      //   setting: {
      //     ...dataRelation,
      //     ...selectUnit,
      //     default: {
      //       title: '默认值',
      //       type: 'number',
      //     },
      //     min: {
      //       title: '最小值',
      //       type: 'number',
      //     },
      //     max: {
      //       title: '最大值',
      //       type: 'number',
      //     },
      //   },
      // },
      // {
      //   text: '是否选择',
      //   name: 'checkbox',
      //   schema: {
      //     title: '是否选择',
      //     type: 'boolean',
      //     widget: 'checkbox',
      //   },
      //   setting: {
      //     default: {
      //       title: '是否默认勾选',
      //       type: 'boolean',
      //     },
      //   },
      // },
      // {
      //   text: '是否switch',
      //   name: 'switch',
      //   schema: {
      //     title: '是否switch',
      //     type: 'boolean',
      //     widget: 'switch',
      //   },
      //   setting: {
      //     default: {
      //       title: '是否默认开启',
      //       type: 'boolean',
      //     },
      //   },
      // },
      {
        text: '下拉单选',
        name: 'select',
        schema: {
          title: '下拉单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
          widget: 'select',
        },
        setting: {
          ...listDataSchemaConfig,
          ...dataRelation,
          ...relationBtn,
        },
      },
      {
        text: '点击单选',
        name: 'radio',
        schema: {
          title: '点击单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
          widget: 'radio',
        },
        setting: {
          ...listDataSchemaConfig,
        },
      },
      {
        text: '下拉多选',
        name: 'multiSelect',
        schema: {
          title: '下拉多选',
          description: '',
          type: 'array',
          items: {
            type: 'string',
          },
          enum: ['A', 'B', 'C', 'D'],
          enumNames: ['杭州', '武汉', '湖州', '贵阳'],
          widget: 'multiSelect',
        },
        setting: {
          // default: {
          //   title: '默认值',
          //   type: 'array',
          //   widget: 'jsonInput',
          // },
          ...listDataSchemaConfig,
        },
      },
      {
        text: '点击多选',
        name: 'checkboxes',
        schema: {
          title: '点击多选',
          type: 'array',
          widget: 'checkboxes',
          items: {
            type: 'string',
          },
          enum: ['A', 'B', 'C', 'D'],
          enumNames: ['杭州', '武汉', '湖州', '贵阳'],
        },
        setting: {
          // default: {
          //   title: '默认值',
          //   type: 'array',
          //   widget: 'jsonInput',
          // },
          ...listDataSchemaConfig,
        },
      },
      // {
      //   text: '纯文本展示',
      //   name: 'html',
      //   schema: {
      //     title: '纯文本展示',
      //     type: 'string',
      //     widget: 'html',
      //   },
      //   setting: {
      //     props: {
      //       type: 'object',
      //       properties: {
      //         value: {
      //           title: '展示内容',
      //           type: 'string',
      //         },
      //       },
      //     },
      //   },
      // },
    ],
  },
  {
    title: '自定义组件',
    widgets: [
      {
        text: '链接',
        name: 'url',
        useCommon: false,
        schema: {
          title: '链接',
          type: 'string',
          widget: 'Link',
        },
        setting: {
          title: {
            title: '标题',
            type: 'string',
            required: true,
          },
          description: {
            title: '说明',
            type: 'string',
          },
          direction: {
            title: '平铺方式',
            type: 'string',
            default: 'vertical',
            enum: ['vertical', 'horizontal'],
            enumNames: ['纵向', '横向'],
          },
          links: {
            title: '添加链接',
            type: 'array',
            // widget: 'simpleList',
            className: 'frg-options-list',
            items: {
              type: 'object',
              properties: {
                file_to_link: {
                  title: '文件转链接',
                  type: 'object',
                  widget: 'UploadFileToLink',
                  required: false,
                },
                link_title: {
                  title: '链接标题',
                  type: 'string',
                  required: true,
                },
                link_url: {
                  title: '链接地址',
                  type: 'string',
                  widget: 'url',
                  required: true,
                },
                link_target: {
                  title: '是否新窗口打开',
                  type: 'boolean',
                  default: true,
                },
              },
            },
          },
        },
      },
      // {
      //   text: '上传文件',
      //   name: 'upload',
      //   useCommon: false,
      //   schema: {
      //     title: '上传文件',
      //     type: 'array',
      //     widget: 'Upload',
      //     readOnlyWidget: 'Upload',
      //   },
      //   setting: {
      //     $id: {
      //       title: 'Name',
      //       description: '字段名称/英文',
      //       type: 'string',
      //       widget: 'idInput',
      //       required: true,
      //       rules: [
      //         {
      //           pattern: '^#/.+$',
      //           message: 'ID 必填',
      //         },
      //       ],
      //     },
      //     title: {
      //       title: '标题',
      //       type: 'string',
      //       widget: 'htmlInput',
      //       required: true,
      //     },
      //
      //     description: {
      //       title: '说明',
      //       type: 'string',
      //     },
      //     required: {
      //       title: '必填',
      //       type: 'boolean',
      //     },
      //     disabled: {
      //       title: '禁用',
      //       type: 'boolean',
      //       default: false,
      //     },
      //     readOnly: {
      //       title: '只读',
      //       type: 'boolean',
      //     },
      //     accept: {
      //       title: '支持文件类型',
      //       type: 'string',
      //       default: '.xls,.xlsx',
      //     },
      //     multiple: {
      //       title: '是否支持多文件同时上传',
      //       type: 'boolean',
      //       default: true,
      //     },
      //     maxCount: { title: '支持最大文件数量', type: 'number' },
      //     action: {
      //       title: '配置上传API服务',
      //       type: 'string',
      //       default: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      //       // default: 'http://localhost:3000/dellmin/IO/uploadFile',
      //     },
      //     authorization: {
      //       title: 'authorization',
      //       type: 'string',
      //     },
      //     ...dataRelation,
      //   },
      // },
      {
        text: '上传组件',
        name: 'upload',
        useCommon: false,
        schema: {
          title: '上传文件',
          type: 'string',
          widget: 'IOInvokerUpload',
          readOnlyWidget: 'IOInvokerUpload',
        },
        setting: {
          $id: {
            title: 'Name',
            description: '字段名称/英文',
            type: 'string',
            widget: 'idInput',
            required: true,
            hidden: true,
            rules: [
              {
                pattern: '^#/.+$',
                message: 'ID 必填',
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
            type: 'string',
          },
          required: {
            title: '必填',
            type: 'boolean',
          },
          disabled: {
            title: '禁用',
            type: 'boolean',
            default: false,
          },
          readOnly: {
            title: '只读',
            type: 'boolean',
          },
          accept: {
            title: '支持文件类型',
            type: 'string',
            default: '.doc,.pdf,.docx',
          },
          maxCount: { title: '支持最大文件数量', type: 'number', default: 5 },
          fileSize: {
            title: '大小限制(M)',
            type: 'number',
            default: 5,
          },
          tip: {
            title: '提示语',
            type: 'string',
            default: '',
          },
          action: {
            title: '配置上传API服务',
            type: 'string',
            default: '/zczd/customer/app-customer/IO/uploadFile',
          },
          authorization: {
            title: 'authorization',
            type: 'string',
            default: 'token',
            description:
              '使用上传服务的是c端用户！不是运营端搭建者！默认运营端的token',
          },
          relatedLinkCode: {
            required: false,
            title: '关联材料',
            type: 'string',
            widget: 'RelatedLinkCodeSetting',
          },

          ...dataRelation,
          ...preDataSetting,
          ...BackDataSetting,
        },
      },
    ],
  },
  // {
  //   title: '按钮',
  //   // 不加载默认的通用设置
  //   useCommon: false,
  //   widgets: [
  //     {
  //       text: '按钮',
  //       name: 'buttons',
  //       useCommon: false,
  //       schema: {
  //         type: 'string',
  //         widget: 'Buttons',
  //       },
  //       setting: {
  //         align: {
  //           title: '方向',
  //           type: 'string',
  //           enum: ['left', 'center', 'right'],
  //           enumNames: ['左', '居中', '右'],
  //           widget: 'radio',
  //           default: 'right',
  //         },
  //         margin: {
  //           title: '间距',
  //           type: 'number',
  //           widget: 'slider',
  //           default: 10,
  //           props: {
  //             min: 5,
  //           },
  //         },
  //         buttons: {
  //           title: '所有按钮',
  //           type: 'array',
  //           // widget: 'simpleList',
  //           className: 'frg-options-list',
  //           items: {
  //             type: 'object',
  //             properties: {
  //               btnTitle: {
  //                 title: '按钮文案',
  //                 placeholder: '按钮文案',
  //                 type: 'string',
  //                 props: {},
  //                 className: 'frg-options-input',
  //               },
  //               btnType: {
  //                 placeholder: '类型',
  //                 className: 'frg-options-input',
  //                 props: {},
  //                 title: '按钮类型',
  //                 type: 'string',
  //                 widget: 'select',
  //                 enum: ['normal', 'primary', 'dashed', 'text', 'link'],
  //                 enumNames: [
  //                   '普通按钮',
  //                   '焦点按钮',
  //                   '虚线按钮',
  //                   '文本按钮',
  //                   '超链按钮',
  //                 ],
  //               },
  //               isDanger: { title: '危险按钮', type: 'boolean' },
  //               action: {
  //                 title: '按钮行为',
  //                 type: 'string',
  //                 enum: ['url', 'modal', 'script', 'submit'],
  //                 enumNames: [
  //                   '跳转新页面',
  //                   '打开新表单',
  //                   '代码片段',
  //                   '提交当前表单',
  //                 ],
  //                 widget: 'radio',
  //               },
  //               url: {
  //                 title: '新页面地址',
  //                 type: 'string',
  //                 placeholder: '请输入打开地址',
  //                 hidden: "{{rootValue.action !== 'url'}}",
  //               },
  //               formId: {
  //                 title: '选择表单',
  //                 placeholder: '请选择弹窗加载的表单',
  //                 hidden: "{{rootValue.action !== 'modal'}}",
  //                 type: 'string',
  //                 widget: 'FormSelector',
  //               },
  //               script: {
  //                 title: '执行代码片段',
  //                 type: 'string',
  //                 widget: 'textarea',
  //                 placeholder: '执行代码片段,内置变量:form',
  //                 hidden: "{{rootValue.action !== 'script'}}",
  //               },
  //               postMethod: {
  //                 title: '表单保存方法',
  //                 type: 'string',
  //                 widget: 'textarea',
  //                 placeholder:
  //                   '表单校验后通过后会调用该方法保存;可调用一个通用接口，用来解析数据和分发至对应api',
  //                 hidden: "{{rootValue.action !== 'submit'}}",
  //               },
  //             },
  //           },
  //           props: {
  //             hideMove: true,
  //             hideCopy: true,
  //             // addBtnProps: {
  //             //   type: 'primary',
  //             //   children: '新增按钮',
  //             // },
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
];
export default widgetsConfig;
