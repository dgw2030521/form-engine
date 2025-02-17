import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { find, map } from 'lodash';
import { MetaDataFieldTO } from '@/CodeDefine/Operation/MetaDataFieldTO';
import { MetaProducerInvoker } from '@/CodeDefine/Operation/Invoker/MetaProducerInvoker';
import { MetaDataProducerRO } from '@/CodeDefine/Operation/MetaDataProducerRO';
import { handlePostMessage } from '@/utils/commonTools';
import useFormDesign from '@/hooks/useFormDesign';
import { useAppSelector } from '@/store/hooks';

// entityId:xxx,metadata:xxx,dataSourceId:xxx
interface MataDataRelationProps {
  value: any;
  onChange: Function;
}

export default function BackDataSetting(props: MataDataRelationProps) {
  const isInIframe = window.self !== window.top;
  const { aliasTableList } = useFormDesign();
  const [fieldList, setFieldList] = useState<MetaDataFieldTO[]>();
  const [dataSources, setDataSources] = useState<MetaDataProducerRO[]>();
  const [form] = Form.useForm();
  const [checkOthers, setCheckOthers] = useState(false);
  const globalDataPoolEntity = useAppSelector(
    state => state.globalInfoState.globalDataPoolEntity,
  );

  const getDataSources = async () => {
    if (!isInIframe) {
      const rst = await MetaProducerInvoker.displayAll();
      if (rst.code.Code === 200) {
        setDataSources(rst.result);
      }
    } else {
      handlePostMessage('getDataSourceList', null);
    }
  };

  const handleEntityChange = (entityId: string, records) => {
    setCheckOthers(true);
    setFieldList(records?.FieldList || []);
    form.setFieldsValue({
      entityName: records?.Name,
      metadata: undefined,
    });
  };

  const handleMessage = ev => {
    const { type, body } = ev.data;
    if (type === 'returnGetDataSourceList') {
      if (body.code.Code === 200) {
        setDataSources(body.result);
      }
    } else if (type === 'returnGetFieldList') {
      if (body.code.Code === 200) {
        setFieldList(body.result?.FieldList);
      }
    }
  };

  // 表单值发送变化
  const onValuesChange = async (changedValues, allValues) => {
    if (changedValues?.entityId) {
      const matchedItem = find(
        aliasTableList,
        item => item.ID === changedValues?.entityId,
      );
      allValues.entityName = matchedItem.Name;
      allValues.metadata = undefined;
    }
    // 将值回传给formItem,实体的话需要给别名出去
    props.onChange(allValues);
  };

  // // 组件刷新
  // useEffect(() => {
  //   if (props.value?.entityId) {
  //     handleEntityChange(props.value?.entityId);
  //   } else {
  //     setFieldList(null);
  //   }
  // }, [props.value?.entityId]);

  useEffect(() => {
    if (props.value) {
      form.setFieldsValue(props.value);
      setFieldList(
        globalDataPoolEntity.find(i => i.UUKey === props.value.entityId)
          ?.FieldList,
      );
    } else {
      form.resetFields();
    }
  }, [props.value]);

  // 初始化渲染
  useEffect(() => {
    Promise.all([getDataSources()]);
    //   响应事件来获取
    window.onmessage = handleMessage;
    return () => {
      window.onmessage = null;
    };
  }, []);
  return (
    <Form
      layout="vertical"
      form={form}
      style={{ width: '100%' }}
      onValuesChange={onValuesChange}
    >
      <Form.Item label="数据池实体" name="entityId">
        <Select
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={handleEntityChange}
          options={map(globalDataPoolEntity, item => {
            return {
              label: item.Name,
              value: item.UUKey,
              ...item,
            };
          })}
        />
      </Form.Item>
      <Form.Item label="实体名称&别名" name="entityName" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        label="数据池元数据"
        name="metadata"
        rules={[
          {
            required: checkOthers,
          },
        ]}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="请选择"
          showSearch
          filterOption={(val, opt) => opt.label.includes(val)}
          options={map(fieldList, item => {
            return {
              label: item.Name,
              value: item.Code,
            };
          })}
        />
      </Form.Item>
    </Form>
  );
}
