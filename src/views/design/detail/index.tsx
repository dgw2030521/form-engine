/**
 * 搭建明细，有id直接初始化，没id返回列表页
 */
import { LeftCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Alert, Button, Form, Menu, message, Space } from 'antd';
import { isEmpty, isNumber } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { serializeToDraft } from 'src/components/FormBuilder';

import { MetaFormInvoker } from '@/CodeDefine/Operation/Invoker/MetaFormInvoker';
import { MetaFormCreateVO } from '@/CodeDefine/Operation/MetaFormCreateVO';
import { MetaFormUpdateVO } from '@/CodeDefine/Operation/MetaFormUpdateVO';
import useFormDesign from '@/hooks/useFormDesign';
import { handlePostMessage } from '@/utils/commonTools';
import Preview, { useForm } from '@/views/design/bizWidgets/preview';
import BasicInfo from '@/views/design/detail/basicInfo';
import ControlsInfo from '@/views/design/detail/controlsInfo';

import styles from './index.module.scss';

const items: MenuProps['items'] = [
  {
    label: '表单逻辑',
    key: 'detail',
  },
  {
    label: '页面预览',
    key: 'preview',
  },
];

export default function DesignDetail() {
  const isInIframe = window.self !== window.top;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const previewForm = useForm();
  const [current, setCurrent] = useState('detail');
  const formId = params.id;
  const location = useLocation();

  const {
    getFormDetailById,
    FieldList,
    FormSchema,
    setFormDetail,
    formDetail,
  } = useFormDesign();

  const [currentFormValues, setCurrentFormValues] = useState();

  const doSaveForm = async values => {
    let rst;
    if (parseInt(formId, 10) > 0) {
      const updateVO = new MetaFormUpdateVO();
      // 从detail里加载信息
      updateVO.Name = values.Name;
      updateVO.Description = values.Description;

      // 其它非表单字段
      updateVO.FieldList = FieldList;
      const str = serializeToDraft(FormSchema);
      // FormSchema
      updateVO.FormSchema = str;

      if (!isInIframe) {
        rst = await MetaFormInvoker.update(formId, updateVO);
        if (rst.code.Code === 200) {
          message.success('保存成功！');
          setFormDetail(rst.result);
        }
      } else {
        handlePostMessage('updateData', {
          id: formId,
          updateVO,
        });
      }
    } else {
      const createVO = new MetaFormCreateVO();
      createVO.Name = values.Name;
      createVO.UUKey = values.UUKey;
      createVO.Description = values.Description;

      // 其它非表单字段
      createVO.FieldList = FieldList;

      const str = serializeToDraft(FormSchema);
      // FormSchema
      createVO.FormSchema = str;

      if (!isInIframe) {
        rst = await MetaFormInvoker.create(createVO);
        if (rst.code.Code === 200) {
          setFormDetail(rst.result);
          message.success('创建成功！');

          navigate(`/form/design/${rst.result.ID}/detail/edit?from=design`);
        }
      } else {
        handlePostMessage('createData', {
          createVO,
        });
      }
    }

    return null;
  };

  const handleSaveForm = async () => {
    const validateRst = await form.validateFields();
    const { errorFields } = validateRst;
    if (isEmpty(errorFields)) {
      const values = !isEmpty(form.getFieldsValue())
        ? form.getFieldsValue()
        : currentFormValues;
      await doSaveForm(values);
    }
  };

  const handleSaveAndPublish = async () => {
    const validateRst = await form.validateFields();
    const { errorFields } = validateRst;
    if (isEmpty(errorFields)) {
      const values = !isEmpty(form.getFieldsValue())
        ? form.getFieldsValue()
        : currentFormValues;
      const result = await doSaveForm(values);
      if (result) {
        const _formId = result.ID;
        const rst = await MetaFormInvoker.enable(_formId);
        if (rst.code.Code === 200) {
          message.success('保存并发布成功！');
          navigate(`/form/design/${result.ID}/detail/edit`);
        }
      }
    }
  };

  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
    if (e.key === 'preview') {
      setCurrentFormValues(form.getFieldsValue());
    }
  };

  /**
   * 上一步
   */
  const handleLastStep = () => {
    if (isNumber(parseInt(formId, 10))) {
      navigate(`/form/design/${formId}/${params.type}`);
    } else {
      // 其他情况，直接返回搭建页面
      navigate(`/form/design/edit`);
    }
  };

  useEffect(() => {
    if (parseInt(formId, 10) > 0) {
      if (isEmpty(formDetail)) {
        getFormDetailById(formId);
      }
    } else {
      // 其他情况，直接返回搭建页面
      navigate(`/form/design/edit`);
    }
  }, [formId, formDetail]);

  const handleOnFinish = (values, errors) => {
    console.log('>>>>>>>验证表单的值<<<<<<<', values, errors);
  };

  const handleMessage = ev => {
    const { type, body } = ev.data;
    // 上层要请求数据了
    if (type === 'returnCreateData') {
      if (body.code.Code === 200) {
        setFormDetail(body.result);
        message.success('创建成功！');
        navigate(`/form/design/${body.result.ID}/detail/edit?from=design`);
      }
    } else if (type === 'returnUpdateData') {
      if (body.code.Code === 200) {
        setFormDetail(body.result);
        message.success('保存成功！');
      }
    }
  };

  useEffect(() => {
    //   响应事件来获取
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Space>
        <Button
          type='text'
          icon={<LeftCircleOutlined />}
          onClick={() => {
            handleLastStep();
          }}>
          返回配置
        </Button>
        {/* 总览配置隐藏保存按钮 */}
        {/* <Button
          type="text"
          icon={<SaveOutlined />}
          onClick={() => {
            handleSaveForm();
          }}
        >
          保存
        </Button> */}
        {/* <Button */}
        {/*  type="text" */}
        {/*  icon={<ProfileOutlined />} */}
        {/*  onClick={() => { */}
        {/*    handleSaveAndPublish(); */}
        {/*  }} */}
        {/* > */}
        {/*  保存并发布 */}
        {/* </Button> */}
      </Space>

      <div className={styles.mainBox}>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode='horizontal'
          items={items}
        />
        {current === 'detail' && (
          <div
            className={styles.detailBox}
            style={{ visibility: current === 'detail' ? 'visible' : 'hidden' }}>
            <BasicInfo form={form} formDetail={formDetail} />
            <ControlsInfo FieldList={FieldList} />
          </div>
        )}
        {current === 'preview' && (
          <>
            <Alert
              closable
              message={
                <ol>
                  <li>
                    表单加载前后事件属于第三方调用逻辑，加载前要获取数据设置在表单上或者提交后表单存储逻辑，也需要调用方支持
                  </li>
                  <li>加载表单是以弹窗方式打开还是直接页面打开，调用方决定</li>
                </ol>
              }
              type='info'
            />
            <div
              style={{
                visibility: current === 'preview' ? 'visible' : 'hidden',
              }}>
              <Preview
                schema={FormSchema}
                form={previewForm}
                onFinish={handleOnFinish}
              />
            </div>

            <div style={{ margin: '0 20px 20px 0', textAlign: 'right' }}>
              <Space>
                <Button
                  type='primary'
                  onClick={() => {
                    previewForm.submit();
                  }}>
                  控制台查看表单值
                </Button>
              </Space>
            </div>
          </>
        )}
      </div>
    </>
  );
}
