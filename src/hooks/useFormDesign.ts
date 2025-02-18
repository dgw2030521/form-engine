import { each, find } from 'lodash';

import { deserialize } from '@/components/FormBuilder';
import {
  AliasTable,
  EntityRelation,
  setAliasTableList,
  setFieldListAction,
  setFormDetailAction,
  setFormEntityRelation,
  setFormSchemaAction,
} from '@/store/form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { convertJoinList2AliasList } from '@/utils/commonTools';
import widgetsConfig from '@/views/design/settings/widgetsConfig';

export default function useFormDesign() {
  const FieldList = useAppSelector(state => state.formState.FieldList);
  const FormSchema = useAppSelector(state => state.formState.FormSchema);
  const formDetail = useAppSelector(state => state.formState.formDetail);
  const FormEntityRelation = useAppSelector(
    state => state.formState.FormEntityRelation,
  );
  const aliasTableList = useAppSelector(
    state => state.formState.aliasTableList,
  );

  const dispatch = useAppDispatch();

  const getWidgetConfig = widgetName => {
    let flattenWidgets = [];
    each(widgetsConfig, item => {
      flattenWidgets = flattenWidgets.concat(item.widgets);
    });
    const matchedItem = find(flattenWidgets, item => {
      return (
        item.name === widgetName ||
        item?.schema?.widget === widgetName ||
        item?.schema?.type === widgetName
      );
    });
    return matchedItem;
  };

  /**
   * 类型
   */
  const DISPLAYTYPE_CONTROL_NAME_MAP = {
    // input: MetaFormFieldDisplayType.Input.Value,
    // textarea: MetaFormFieldDisplayType.TextArea.Value,
    // date: MetaFormFieldDisplayType.DatePicker.Value,
    // time: MetaFormFieldDisplayType.DatePicker.Value,
    // number: MetaFormFieldDisplayType.InputNumber.Value,
    // checkbox: MetaFormFieldDisplayType.Checkbox.Value,
    // switch: MetaFormFieldDisplayType.Radio.Value,
    // select: MetaFormFieldDisplayType.SingleSelect.Value,
    // radio: MetaFormFieldDisplayType.Radio.Value,
    // multiSelect: MetaFormFieldDisplayType.MultiSelect.Value,
    // checkboxes: MetaFormFieldDisplayType.Checkbox.Value,
    // url: MetaFormFieldDisplayType.Link.Value,
    // upload: MetaFormFieldDisplayType.Upload.Value,
    // buttons: MetaFormFieldDisplayType.Button.Value,
  };

  /**
   * 将schema转换为字段列表
   * @param schema
   */
  const convertSchemaToField = (schema: any) => {
    const result: any[] = [];
    // each(schema?.properties, (item, code) => {
    //   console.log('item: ', item);
    //   const widgetName = code.split('_')[0];
    //   const field = new MetaFormFieldTO();
    //   field.RelatedLinkCode = item.relatedLinkCode;
    //   field.Name = item.title;
    //   field.Code = code;
    //   field.Desc = item.description;
    //   // 关联表换成别名传递
    //   field.LinkTable = item.__dataRelation?.__mataDataConfig?.entityName;
    //   field.LinkTableField = item.__dataRelation?.__mataDataConfig?.metadata;
    //
    //   // 预填数据
    //   field.YTLinkTable = item.__preDataRelation?.__mataDataConfig?.entityId;
    //   field.YTLinkTableField =
    //     item.__preDataRelation?.__mataDataConfig?.metadata;
    //   field.YTProducer.ID =
    //     item.__preDataRelation?.__mataDataConfig?.dataSourceId;
    //
    //   // 回填数据
    //   field.HXLinkTable = item.__BackDataRelation?.__mataDataConfig?.entityId;
    //   field.HXLinkTableField =
    //     item.__BackDataRelation?.__mataDataConfig?.metadata;
    //
    //   // 这个字段后端校验非空，链接的时候是空的，随便写个值进去
    //   if (!field.LinkTableField) {
    //     field.LinkTableField = code;
    //   }
    //   if (item.relationOptions) {
    //     const dataArray = Object.entries(item.relationOptions).map(
    //       ([option, fieldCodes]) => {
    //         return {
    //           Option: option,
    //           FieldCodes: fieldCodes,
    //         };
    //       },
    //     ) as any;
    //     field.RelationOptions = dataArray;
    //   }
    //   if (item.UnitID) {
    //     field.Unit.ID = item?.UnitID;
    //   }
    //   // field.isCustomData = item.__dataRelation?.__type === 'customize';
    //   // 保存的时候需要再转换回来
    //   field.Require = !!item.required;
    //   field.ReadOnly = !!item.readOnly;
    //
    //   field.DisplayType._value = DISPLAYTYPE_CONTROL_NAME_MAP[widgetName];
    //
    //   field.Producer.ID = item.__dataRelation?.__mataDataConfig?.dataSourceId;
    //   field.ReadProducer.ID =
    //     item.__preDataRelation?.__mataDataConfig?.dataSourceId;
    //
    //   if (item.__externalApi?.__type === 1) {
    //     field.ThirdApiFeature = new ThirdApiFeatureTO();
    //     field.ThirdApiFeature.Status = !!item.__externalApi?.__type;
    //     field.ThirdApiFeature.ArgName = item.__externalApi?.__argName;
    //   }
    //
    //   // 处理枚举值
    //   if (
    //     item?.enum?.length === item?.enumNames?.length &&
    //     item?.enumNames?.length > 0
    //   ) {
    //     const EnumValue = [];
    //
    //     item?.enum?.forEach((i, index) => {
    //       const field = new KeyValueVO();
    //       field.Key = i;
    //       field.Value = item.enumNames?.[index];
    //
    //       EnumValue.push(field);
    //     });
    //
    //     field.EnumValue = EnumValue;
    //   }
    //
    //   result.push(field);
    // });

    return result;
  };

  /**
   * 设置字段列表
   * @param fieldList
   */
  const setFieldList = (fieldList: any[]) => {
    dispatch(
      setFieldListAction({
        FieldList: fieldList,
      }),
    );
  };

  const setFormSchema = (formSchema: any) => {
    dispatch(
      setFormSchemaAction({
        FormSchema: formSchema,
      }),
    );
  };

  const setEntityRelation = (detail: EntityRelation) => {
    dispatch(setFormEntityRelation(detail));
  };

  const setAliasList = (newAliasList: AliasTable[]) => {
    dispatch(setAliasTableList(newAliasList));
  };

  const setFormDetail = (detail: any) => {
    dispatch(
      setFormDetailAction({
        formDetail: detail,
      }),
    );
    if (detail) {
      setEntityRelation({
        Table: detail.Table,
        TableAlias: detail.TableAlias,
        JoinList: detail.JoinList,
      });
      // 别名表
      const rst = convertJoinList2AliasList({
        Table: detail.Table,
        TableAlias: detail.TableAlias,
        JoinList: detail.JoinList,
      });
      dispatch(setAliasTableList(rst));
    } else {
      setEntityRelation(null);
      dispatch(setAliasTableList([]));
    }
  };

  const persistDetail = (_formDetail: any) => {
    const formSchema = deserialize(_formDetail.FormSchema);
    const _fieldList = convertSchemaToField(formSchema);

    // 所有信息都可以从formDetail获取
    setFieldList(_fieldList);
    setFormSchema(formSchema);
    setFormDetail(_formDetail);
  };

  const getFormDetailById = async (id: string) => {
    // const rst = await MetaFormInvoker.get(id);
    // if (rst.code.Code === 200) {
    //   const _formDetail = rst.result;
    //   persistDetail(_formDetail);
    // }
  };

  /**
   * 切换表单，重置数据层相关依赖数据
   */
  const switchForm = () => {
    setFieldList([]);
    setFormSchema({
      type: 'object',
      properties: {},
      // labelWidth: 130,
      // displayType: 'row',
      // __displayMode: 'inPage',
      // __ModalSize: 520,
      // column: 1,
      // colon: true,
      // disabled: false,
    });
    setFormDetail(null);
  };
  return {
    getFormDetailById,
    formDetail,
    FieldList,
    FormSchema,
    setFieldList,
    setFormSchema,
    setFormDetail,
    switchForm,
    convertSchemaToField,
    persistDetail,
    FormEntityRelation,
    setEntityRelation,
    aliasTableList,
    setAliasList,
  };
}
