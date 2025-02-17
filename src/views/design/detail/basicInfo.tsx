import React, { useEffect } from 'react';
import { Form, FormInstance, Input, Select } from 'antd';
import { MetaFormRO } from '@/CodeDefine/Operation/MetaFormRO';
import { useSearchParams } from 'react-router-dom';
import { FormEditType } from '@/CodeDefine/Operation/FormEditType';
import { FormVisibleType } from '@/CodeDefine/Operation/FormVisibleType';
import { useFrameEmbed } from '@/hooks/useFrameEmbed';

interface BasicInfoProps {
  form: FormInstance;
  formDetail: MetaFormRO;
}

export default function BasicInfo(props: BasicInfoProps) {
  const { form, formDetail } = props;
  const [searchParams] = useSearchParams();

  const EditAttr = Form.useWatch('EditAttr', form);
  const { isEmbedByGovProtocol } = useFrameEmbed();

  const getEditAttrVisible = () => {
    if (formDetail?.AsDefault) return false;
    return +searchParams.get('type') !== 1;
  }

  useEffect(() => {
    if (formDetail) {
      form.setFieldsValue(MetaFormRO.ToJson(formDetail));
    }
  }, [formDetail]);
  return (
    <div>
      <h3>表单基本信息</h3>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={formDetail ? {} : { EditAttr: FormEditType.BEFORE_FLOW.Value, Visible: FormVisibleType.EXCEPT_APPLY.Value }}
        autoComplete="off"
      >
        <Form.Item label="表单名称" name="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="英文名称" name="UUKey" rules={[{ required: true }]}>
          {/* 新建，模板使用场景可以编辑 */}
          <Input disabled={!!formDetail && searchParams.get('type') !='6'} />
        </Form.Item>

        {getEditAttrVisible() && (
          <>
            {!isEmbedByGovProtocol && (
              <Form.Item
                label="表单编辑属性"
                name="EditAttr"
                rules={[{ required: true }]}
              >
                <Select
                  options={FormEditType.ValueList}
                  fieldNames={{ label: 'Name', value: 'Value' }}
                  disabled={!!formDetail && searchParams.get('type') !='6'}
                />
              </Form.Item>
            )}

            {EditAttr === FormEditType.AFTER_FLOW.Value && (
              <Form.Item
                label="表单可见性"
                name="Visible"
                rules={[{ required: true }]}
              >
                <Select options={FormVisibleType.ValueList} fieldNames={{ label: 'Name', value: 'Value'}} disabled />
              </Form.Item>
            )}
          </>
        )}

        <Form.Item
          label="表单描述"
          name="Description"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
}
