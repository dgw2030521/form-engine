export default {
  __externalApi: {
    title: '外接 API',
    type: 'object',
    labelWidth: 80,
    properties: {
      __type: {
        title: '是否外接 API',
        type: 'number',
        enum: [1, 0],
        enumNames: ['是', '否'],
        default: 0,
        required: true,
      },
      __argName: {
        title: '参数名称',
        type: 'string',
        required: true,
        hidden: '{{rootValue.__type===0}}',
      },
    },
  },
};
