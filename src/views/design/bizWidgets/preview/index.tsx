/**
 * 处理表单的预览渲染功能，开放出来可设置的功能,后续作为内置组件提供
 */
import FormRender, {
  Error,
  FormInstance,
  useForm,
  ValidateParams,
} from 'form-render';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

import Buttons from '@/views/design/bizWidgets/buttons';
import IOInvokerUpload from '@/views/design/bizWidgets/IOInvokerUpload';
import Link from '@/views/design/bizWidgets/link';
import Upload from '@/views/design/bizWidgets/upload';

import styles from './preview.module.scss';

interface PreviewProps {
  schema: any;
  // 接收三个回调，在渲染表单时候，外部可以自定义按钮
  onMount?: () => void;
  beforeFinish?: (params: ValidateParams) => Error[] | Promise<Error[]>;
  // 表单包括按钮，只做数据收集，拿到数据怎么消费使用，是第三方应用的事情
  onFinish?: (formData: any, errors: Error[]) => void;
  form: FormInstance;
}

export default function Preview(props: PreviewProps) {
  const { form } = props;
  const [schema, setSchema] = useState(props.schema);

  useEffect(() => {
    setSchema(props.schema);
  }, [props.schema]);

  const renderForm = () => {
    return (
      <FormRender
        // readOnly
        form={form}
        schema={schema}
        widgets={{ Buttons, Upload, Link, IOInvokerUpload }}
        disabled={schema?.disabled}
        colon={schema?.colon}
        onFinish={props?.onFinish}
        onMount={props?.onMount}
        beforeFinish={props?.beforeFinish}
        scrollToFirstError
      />
    );
  };

  return (
    <div className={styles.preview}>
      {isEmpty(props.schema) ? (
        <span>没有数据可以渲染！请先添加控件</span>
      ) : (
        renderForm()
      )}
    </div>
  );
}

export { useForm };
