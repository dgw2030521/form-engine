import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Space, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { filter, isEmpty, map } from 'lodash';
import { IOInvoker } from '@/CodeDefine/Operation/Invoker/IOInvoker';

export default function App(props) {
  const { schema, value, onChange } = props;
  const [fileList, setFileList] = useState<UploadFile[]>(value);
  const isInPreview = !isEmpty(props.addons);

  const getPreviewUrl = async (fileKey: string, preview: boolean) => {
    const result = await IOInvoker.getDownUrl(fileKey, preview);
    if (result.code.Code === 200) {
      return result.result;
    }
    return null;
  };
  const renderFileBox = (fileKeysStr: string) => {
    const files = fileKeysStr.split(',');
    return map(files, fileKey => {
      const arr = fileKey.split('/');
      const size = arr.length;
      const fileName = arr[size - 1];
      return (
        <p>
          <Space>
            <span>{fileName}</span>
            <a
              target="_blank"
              rel="noreferrer"
              onClick={async () => {
                const previewUrl = await getPreviewUrl(fileKey, true);
                window.open(previewUrl, '_blank');
              }}
            >
              <i className="iconfont icon-chakan-copy" />
              查看
            </a>
            <a
              onClick={async () => {
                const previewUrl = await getPreviewUrl(fileKey, false);
                window.open(previewUrl, '_blank');
              }}
              target="_blank"
              rel="noreferrer"
            >
              <i className="iconfont icon-xiazai" />
              下载
            </a>
          </Space>
        </p>
      );
    });
  };

  const handleChange: UploadProps['onChange'] = info => {
    const newFileList = map(info.fileList, file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  useEffect(() => {
    if (fileList?.length > 0) {
      const returnVal = map(
        filter(fileList, item => {
          return item.status === 'done';
        }),
        item => {
          return {
            uid: item.uid,
            name: item.name,
            status: 'done',
            url: item.response?.url,
          };
        },
      );
      onChange(returnVal);
    }
  }, [fileList]);

  // 只读模式如何展示
  if (schema?.readOnly) {
    return (
      <div style={{ width: '50%' }}>
        {map(fileList, item => {
          return (
            <p>
              <Space>
                <span>{item.name}</span>
                <a
                  target="_blank"
                  rel="noreferrer"
                  onClick={async () => {
                    // const previewUrl = await getPreviewUrl(fileKey, true);
                    // window.open(previewUrl, '_blank');
                  }}
                >
                  查看
                </a>
                <a
                  onClick={async () => {
                    // const previewUrl = await getPreviewUrl(fileKey, false);
                    // window.open(previewUrl, '_blank');
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
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
    <div style={{ width: '50%' }}>
      <Upload
        {...{
          action: schema?.action,
          headers: {
            authorization: schema?.authorization,
          },
          multiple: schema?.multiple,
          maxCount: schema?.maxCount,
          accept: schema?.accept,
        }}
        fileList={fileList}
        onChange={handleChange}
        disabled={schema?.disabled}
      >
        <Button icon={<UploadOutlined />}>上传文件</Button>
      </Upload>
    </div>
  );
}
