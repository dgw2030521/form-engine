import { isNil } from 'lodash';
import { getChildren2 } from '../utils';

// Setting Schema => FR Schema
const transformFrom = schema => {
  const isObj = schema.type === 'object' && schema.properties;
  const isList =
    schema.type === 'array' && schema.items && schema.items.properties;
  const hasChildren = isObj || isList;

  if (!hasChildren) {
    // @NOTICE @todo   专门为type=array，enumList写的转化逻辑
    if (schema.__datasourceType === 'customize') {
      if (Array.isArray(schema.enumList)) {
        schema.enum = schema.enumList
          .filter(item => !isNil(item.value))
          .map(item => item.value);
        schema.enumNames = schema.enumList
          .filter(item => !isNil(item.value))
          .map(item => item.label || item.value);
      }
      delete schema.enumList;
    } else if (schema.__datasourceType === 'metadata') {
      if (schema.__enumList.usedEnumId) {
        schema.enum = schema.__enumList.usedEnum;
        schema.enumNames = schema.__enumList.usedEnumNames;
        const list = schema.enum.map((item, idx) => ({
          value: item,
          label: schema.enumNames[idx],
        }));
        schema.enumList = list;
      }
    }
  } else {
    const childrenList = getChildren2(schema);
    childrenList.map(item => {
      if (isObj) {
        schema.properties[item.name] = transformTo({ ...item.schema });
      }
      if (isList) {
        schema.items.properties[item.name] = transformTo({ ...item.schema });
      }
    });
  }
  return schema;
};

export const fromSetting = schema => transformFrom({ ...schema });

// 将渲染表单的form转为setting的schema
// FR Schema => Setting Schema
const transformTo = schema => {
  const isObj = schema.type === 'object' && schema.properties;
  const isList =
    schema.type === 'array' && schema.items && schema.items.properties;
  const hasChildren = isObj || isList;

  if (!hasChildren) {
    if (Array.isArray(schema.enum) && Array.isArray(schema.enumNames)) {
      // console.log('---222---将formSchema转为settingSchema', schema);
      const list = schema.enum.map((item, idx) => ({
        value: item,
        label: schema.enumNames[idx],
      }));
      schema.enumList = list;
      schema.enum;
      schema.enumNames;
    }
  } else {
    const childrenList = getChildren2(schema);
    childrenList.map(item => {
      if (isObj) {
        schema.properties[item.name] = transformFrom({ ...item.schema });
      }
      if (isList) {
        schema.items.properties[item.name] = transformFrom({ ...item.schema });
      }
    });
  }
  return schema;
};

export const toSetting = schema => transformTo({ ...schema });
