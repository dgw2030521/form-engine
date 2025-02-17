import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import { map } from 'lodash';

// entityId:xxx,metadata:xxx,dataSourceId:xxx
interface RelationBtnProps {
  value?: any;
  onChange?: Function;
}

export default function RelationBtn(props: RelationBtnProps) {
  const [modelOpen, setModalOpen] = useState(false);
  const { value } = props;
  const [form] = Form.useForm();
  const onFinish = () => {
    const values = form.getFieldsValue();
    props.onChange(props.value?.componentName, values);
    setModalOpen(false);
  };

  // 组件刷新
  useEffect(() => {
    console.log('关联项props', props.value);
  }, [props.value]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        关联选项设置
      </Button>
      <Modal
        open={modelOpen}
        title="关联选项设置"
        onOk={onFinish}
        width={500}
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        {value.enum && value.enum.length > 0 ? (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                fontSize: '14px',
              }}
            >
              <div style={{ marginRight: '65px' }}>当选项为</div>
              <div>显示以下组件</div>
            </div>
            <Form
              form={form}
              labelAlign="left"
              labelCol={{
                style: { width: 120 },
              }}
              wrapperCol={{
                style: { width: 'calc(100% - 120px)' },
              }}
              initialValues={props.value?.selectedOptions}
            >
              {value.enum.map((item, index) => {
                return (
                  <Form.Item
                    key={item.enum}
                    label={item.enumName}
                    name={item.enum}
                  >
                    <Select
                      placeholder="请选择需要关联展示的组件"
                      mode="multiple"
                      // defaultValue={
                      //   props.value.selectedOptions
                      //     ? Object.entries(props.value?.selectedOptions)[
                      //         index
                      //       ][1]
                      //     : undefined
                      // }
                      options={map(props.value.FieldList, item => {
                        return {
                          label: item.Name,
                          value: item.Code,
                        };
                      })}
                    />
                  </Form.Item>
                );
              })}
            </Form>
          </div>
        ) : (
          <div>暂无数据</div>
        )}
      </Modal>
    </>
  );
}
