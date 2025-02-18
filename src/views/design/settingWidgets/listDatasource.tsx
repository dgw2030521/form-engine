import { Form, Select, Checkbox, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { filter, find, isEmpty, map } from 'lodash';
import { MetaEnumRO } from '@/CodeDefine/Operation/MetaEnumRO';
import { MetaEnumInvoker } from '@/CodeDefine/Operation/Invoker/MetaEnumInvoker';
import { handlePostMessage } from '@/utils/commonTools';

/**
 * 下拉数据源设置，MetaEnumInvoker.displayAll
 * 选择好之后，将对应的MemberList渲染出来，Name/Value
 * @constructor
 */
interface ListDatasourceProps {
  value: any;
  onChange: Function;
}

export default function ListDatasource(props: ListDatasourceProps) {
  const isInIframe = window.self !== window.top;
  const [form] = Form.useForm();
  const { value } = props;
  const [dataSources, setDataSources] = useState<MetaEnumRO[]>();
  const [memberList, setMemberList] = useState([]);

  const onValuesChange = async (changedValues, allValues) => {
    if (changedValues?.usedEnumId) {
      const matchedItem = find(
        dataSources,
        item => item.ID === changedValues.usedEnumId,
      );
      setMemberList(matchedItem.MemberList || []);
      const usedIds = map(matchedItem.MemberList, item => {
        return item.Value;
      });
      const usedNames = map(matchedItem.MemberList, item => {
        return item.Desc;
      });
      form.setFieldValue('usedEnum', usedIds);
      form.setFieldValue('usedEnumNames', usedNames);
      allValues.usedEnum = usedIds;
      allValues.usedEnumNames = usedNames;
    }
    if (changedValues?.usedEnum) {
      const filterList = filter(memberList, item => {
        return changedValues.usedEnum.includes(item.Value);
      });

      const usedNames = map(filterList, item => item.Desc);
      form.setFieldValue('usedEnumNames', usedNames);
      allValues.usedEnumNames = usedNames;
    }
    props.onChange(allValues);
  };

  const getEnumList = async () => {
    if (!isInIframe) {
      const result = await MetaEnumInvoker.displayAll();
      if (result.code.Code === 200) {
        setDataSources(result.result);
      }
    } else {
      handlePostMessage('getEnumList', null);
    }
  };

  const getEnumById = async (id: string) => {
    if (!isInIframe) {
      const result = await MetaEnumInvoker.get(id);
      if (result.code.Code === 200) {
        setMemberList(result.result.MemberList);
      }
    } else {
      handlePostMessage('getEnumById', id);
    }
  };

  const handleMessage = ev => {
    const { type, body } = ev.data;
    if (type === 'returnGetEnumList') {
      if (body.code.Code === 200) {
        setDataSources(body.result);
      }
    } else if (type === 'returnGetEnumById') {
      if (body.code.Code === 200) {
        setMemberList(body.result.MemberList);
      }
    }
  };

  useEffect(() => {
    if (props.value) {
      form.setFieldsValue(props.value);
    } else {
      form.resetFields();
    }
  }, [props.value]);

  useEffect(() => {
    Promise.all([getEnumList()]);
    //   响应事件来获取
    window.onmessage = handleMessage;
    return () => {
      window.onmessage = null;
    };
  }, []);

  useEffect(() => {
    if (props.value?.usedEnumId) {
      getEnumById(props.value?.usedEnumId);
    }
  }, [props.value?.usedEnumId]);

  return (
    <Form
      layout="vertical"
      form={form}
      style={{ width: '100%' }}
      onValuesChange={onValuesChange}
    >
      <Form.Item
        label="选择展示枚举字段"
        name="usedEnumId"
        rules={[{ required: true }]}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="选择元数据的枚举"
          showSearch
          filterOption={(input, option) => {
            return (
              option.label.includes(input) ||
              String(option.value) === String(input)
            );
          }}
          options={map(dataSources, item => {
            return {
              label: item.Name,
              value: item.ID,
            };
          })}
        />
      </Form.Item>
      {!isEmpty(memberList) && (
        <Form.Item label="配置枚举字段值" name="usedEnum">
          <Checkbox.Group>
            {map(memberList, item => {
              return (
                <Row key={item.Value}>
                  <Col>
                    <Checkbox value={item.Value}>{item.Desc}</Checkbox>
                  </Col>
                </Row>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
      )}
      <Form.Item label="配置需要展示哪几个Names" name="usedEnumNames" hidden>
        <Checkbox.Group>
          {map(memberList, item => {
            return (
              <Row key={item.Desc}>
                <Col>
                  <Checkbox value={item.Desc}>{item.Desc}</Checkbox>
                </Col>
              </Row>
            );
          })}
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );
}
