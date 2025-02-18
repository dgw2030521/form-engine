import { Button, message, Space, Upload } from 'antd';
import classNames from 'classnames';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import styles from './index.module.scss';
import { storage } from './storage';

interface UploadProps {
  // 打开上传筛选的类型
  accept?: string;
  ext?: Array<string>;
  // 最大数量>1默认支持
  maxCount?: number;
  fileSize?: number;
  // // 同时上传多文件
  // multiple?: boolean;
  action?: string;
  authorization?: string;

  // 提示语
  tip?: React.ReactNode;
  flexList?: boolean;
}

export default function IOInvokerUpload(props) {
  // 配置从schema读取，value是fieldList初始值，onChange是将上传结果回传给表单
  const { schema, value, onChange } = props;

  // 只读模式
  const isInPreview = props.readOnly;

  const [config, setConfig] = useState<UploadProps>(null);

  const uploadFileList = JSON.parse(value || '[]');

  const [maxDisabled, setMaxDisabled] = useState(false);

  /**
   * 查询下载和预览链接，需要修改IOInvoker
   * @param fileKey
   * @param preview
   */
  const getPreviewUrl = async (fileKey: string, preview: boolean) => {
    // const result = await IOInvoker.getDownUrl(fileKey, preview);
    // if (result.code.Code === 200) {
    //   return result.result;
    // }
    return null;
  };

  const handleFileOnChange = info => {
    if (info.file.status === 'removed') {
      message.success(`${info.file.name} 文件删除成功`);
    }
    // fileList的url显式下载链接
    if (info.file.status === 'error') {
      // 先全部放在列表里
      message.error(`${info.file.name} 文件上传失败`);
    }

    if (info.file.status === 'done') {
      // 处理上传结果
      if (info.file.response.Code === 200) {
        message.success(`${info.file.name} 文件上传成功`);
      } else {
        message.error(info.file.response.Message);
      }
    }

    const _fileList = map(info.fileList, item => {
      return {
        name: item.name,
        size: item.size,
        type: item.type,
        key: item.response?.Value.Key,
        duration: item.response?.Value?.Duration,
      };
    });

    onChange(JSON.stringify(_fileList));
  };

  useEffect(() => {
    const _config = {
      accept: schema.accept,
      ext: schema.ext || [],
      maxCount: schema.maxCount || 1,
      fileSize: schema.fileSize || 5,
      tip: schema.tip,
      flexList: !!schema.flexList,
      multiple: schema?.multiple,
      authorization: schema?.authorization,
      action: schema?.action,
    };
    setConfig(_config);
  }, [
    schema.accept,
    schema.ext,
    schema.maxCount,
    schema.fileSize,
    schema.tip,
    schema.flexList,
    schema?.multiple,
    schema?.authorization,
    schema?.action,
  ]);

  useEffect(() => {
    if (config) {
      if (config.maxCount > 1 && uploadFileList?.length >= config.maxCount) {
        setMaxDisabled(true);
      } else {
        setMaxDisabled(false);
      }
    }
  }, [config, uploadFileList]);

  // 只读模式如何展示
  // @todo 该功能实现不完整，暂时不需要，没有用到该组件的渲染只读功能
  if (isInPreview) {
    return (
      <div style={{ width: '100%' }}>
        {map(uploadFileList, (item, idx) => {
          return (
            <p key={idx}>
              <Space>
                <span>{item.name}</span>
                <a
                  target='_blank'
                  rel='noreferrer'
                  onClick={async () => {
                    const previewUrl = await getPreviewUrl(item.key, true);
                    window.open(previewUrl, '_blank');
                  }}>
                  查看
                </a>
                <a
                  onClick={async () => {
                    const previewUrl = await getPreviewUrl(item.key, false);
                    window.open(previewUrl, '_blank');
                  }}
                  target='_blank'
                  rel='noreferrer'>
                  下载
                </a>
              </Space>
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {config ? (
        <div
          className={classNames({
            [styles['biz-upload01']]: true,
            [styles['biz-upload01-list']]: true,
          })}>
          {/* 仅支持pdf、word、xls文件，最多上传5份，单个大小不超过20M */}
          <div className={styles['biz-upload01-tip']}>{config.tip}</div>
          <Upload
            accept={config.accept}
            maxCount={config.maxCount}
            multiple={config.maxCount > 1}
            action={config.action}
            headers={{
              Authorization: storage.getItem(config?.authorization),
            }}
            data={file => {
              // 上传对象的构建
              return {
                stream: JSON.stringify({
                  key: `${file.name}`,
                }),
              };
            }}
            beforeUpload={file => {
              if (config.ext?.length) {
                const ext = file.name
                  .substr(file.name.lastIndexOf('.'))
                  .toLowerCase();
                if (config.ext.indexOf(ext) === -1) {
                  message.warning(`不支持上传${ext}文件`);
                  return Upload.LIST_IGNORE;
                }
              }
              if (file.size > config.fileSize * 1024 * 1024) {
                message.warning(`上传文件不得大于${config.fileSize}M`);
                return Upload.LIST_IGNORE;
              }
            }}
            defaultFileList={uploadFileList}
            onRemove={file => {}}
            onChange={handleFileOnChange}>
            <Button
              style={{
                padding: '4px 10px',
                fontWeight: 'bold',
              }}
              onClick={e => {
                if (maxDisabled) {
                  message.warning('上传数量已达上限');
                  e.stopPropagation();
                }
              }}>
              点击上传
            </Button>
          </Upload>
        </div>
      ) : null}
    </>
  );
}
