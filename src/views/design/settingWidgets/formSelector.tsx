import React, { useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import { map } from 'lodash';
import { MetaFormRO } from '@/CodeDefine/Operation/MetaFormRO';
import { MetaFormInvoker } from '@/CodeDefine/Operation/Invoker/MetaFormInvoker';
import { MetaFormDisplayConditionVO } from '@/CodeDefine/Operation/MetaFormDisplayConditionVO';

interface FormSelectorProps {
  value: any;
  onChange: Function;
}

export default function FormSelector(props: FormSelectorProps) {
  const [form] = Form.useForm();
  const [formList, setFormList] = useState<MetaFormRO[]>();

  const getFormList = async () => {
    const queryBody = new MetaFormDisplayConditionVO();
    const rst = await MetaFormInvoker.display(queryBody, 1, 100000);
    if (rst.code.Code === 200) {
      setFormList(rst.result.Value);
    }
  };

  useEffect(() => {
    Promise.all([getFormList()]);
  }, []);
  return (
    <Form layout="vertical" form={form} style={{ width: '100%' }}>
      <Form.Item
        label="选择表单"
        name="formId"
        rules={[{ required: true }]}
        initialValue={props.value}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="选择表单"
          onChange={val => {
            props.onChange(val);
          }}
          options={map(formList, item => {
            return {
              label: item.Name,
              value: item.ID,
            };
          })}
        />
      </Form.Item>
    </Form>
  );
}
