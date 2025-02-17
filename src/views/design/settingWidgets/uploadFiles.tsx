import React, { useState, useEffect } from 'react';
import { Upload, message, Button, Form } from 'antd';
import UploadIcon from '@/asserts/upload.svg';
import './index.styl';

interface FCProps {
  accept?: string;
  ext?: Array<string>;
  maxCount?: number;
  fileSize?: number;
  tip?: React.ReactNode;
  flexList?: boolean;
  defaultFileList?: Array<any>;
  onUpload?: (fileList: any, file: any, action: string) => void;
  showUploadList?: any;
  onPreview?: (file: any) => void;
  onDownload?: (file: any) => void;
  onUploadFile?: (file: any) => void;
  onRemoveFile?: (file: any) => void;
  options?: any;
  value?: any;
  onFileChange?: Function;
  addons?: any;
}
console.log('process.env.PUBLIC_URL---', process.env.PUBLIC_URL);
let fileAction = null;
let fileUploadUrl = '';
let token = '-';
// uploadFile
const isInIframe = window.self !== window.top;
if (!isInIframe) {
  fileUploadUrl =
  process.env.NODE_ENV === 'development'
    ? `/app-gov/IO/fixUpload`
    : `${process.env.PUBLIC_URL}/app-operation/IO/fixUpload`;
  token = localStorage.getItem('token');
} else {
  fileUploadUrl =
  process.env.NODE_ENV === 'development'
    ? `/app-gov/IO/fixUpload`
    : `/zczd/gov/app-gov/IO/fixUpload`;
  token = localStorage.getItem('$gov_token');
}

const UploadFileToLink = (props: FCProps) => {
  const [config, setConfig] = useState<FCProps>(null);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [maxDisabled, setMaxDisabled] = useState(false);

  useEffect(() => {
    const _config = {
      accept: props.accept,
      ext: props.ext || [],
      maxCount: props.maxCount || 1,
      fileSize: props.fileSize || 5,
      tip: props.tip,
      flexList: !!props.flexList,
    };
    setConfig(_config);
  }, [
    props.accept,
    props.ext,
    props.maxCount,
    props.fileSize,
    props.tip,
    props.flexList,
  ]);

  useEffect(() => {
    if (props.defaultFileList && props.defaultFileList.length) {
      const _list = props.defaultFileList.map((item, index) => {
        return {
          uid: index,
          name: item.Name,
          status: 'done',
          ID: item?.ID,
          response: {
            Value: {
              Key: item?.Key,
              Url: item?.Url,
              Duration: item?.Duration,
            },
          },
        };
      });
      setUploadFileList(_list);
    } else {
      setUploadFileList([]);
    }
  }, [props.defaultFileList]);

  useEffect(() => {
    if (config) {
      if (config.maxCount > 1 && uploadFileList.length >= config.maxCount) {
        setMaxDisabled(true);
      } else {
        setMaxDisabled(false);
      }
    }
  }, [config, uploadFileList]);

  return (
    <div className={`biz-upload01`}>
      <div className="biz-upload01-tip">支持pdf、png、jpg、pdf、doc、xls格式，文件大小不超过5M</div>
      <Upload
        accept={config?.accept}
        maxCount={config?.maxCount}
        multiple={config?.maxCount > 1}
        name="file"
        action={fileUploadUrl}
        headers={{
          Authorization: token || '--',
        }}
        data={file => {
          return {
            stream: JSON.stringify({ key: `${file.name}` }),
          };
        }}
        beforeUpload={(file, fileList) => {
          if (config?.ext.length) {
            const ext = file.name
              .substr(file.name.lastIndexOf('.'))
              .toLowerCase();
            if (config?.ext.indexOf(ext) === -1) {
              message.warning(`不支持上传${ext}文件`);
              return Upload.LIST_IGNORE;
            }
          }
          if (file.size > config?.fileSize * 1024 * 1024) {
            message.warning(`上传文件不得大于${config?.fileSize}M`);
            return Upload.LIST_IGNORE;
          }
          fileAction = 'upload';
        }}
        fileList={uploadFileList}
        onRemove={() => {
          fileAction = 'remove';
        }}
        showUploadList={props.showUploadList}
        onDownload={file => {
          if (props.onDownload) props.onDownload(file);
        }}
        onPreview={(file) => {
          if (props.onPreview) props.onPreview(file);
        }}
        onChange={info => {
          if (info.file.status === 'uploading') {
            setUploadFileList(info.fileList);
            return;
          }
          if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
            info.fileList.pop();
            setUploadFileList(info.fileList);
            return;
          }
          if (fileAction === 'remove') {
            if (props.onRemoveFile) {
              props.onRemoveFile(info.file);
            } else {
              message.success(`${info.file.name} 文件删除成功`);
            }
            setUploadFileList(info.fileList);
          } else if (info.file.status === 'done') {
            if (fileAction === 'upload') {
              if (info.file.response.Code === 200) {
                if (props.onUploadFile) {
                  props.onUploadFile(info.file);
                } else {
                  message.success(`${info.file.name} 文件上传成功`);
                }
                if (props.onFileChange) {
                  props.onFileChange(info.file, props.options?.componentName);
                }
                setUploadFileList(info.fileList);
              } else {
                message.error(info.file.response.Message);
                info.fileList.pop();
                setUploadFileList(info.fileList);
                return;
              }
            }
          }
          if (props.onUpload) {
            const _file = {
              name: info.file.name,
              size: info.file.size,
              type: info.file.type,
              key: info.file.response.Value.Key,
              url: info.file.response.Value.Url,
            };
            const _fileList = info.fileList.map(item => {
              return {
                name: item.name,
                size: item.size,
                type: item.type,
                key: item.response.Value.Key,
                url: item.response.Value.Url,
                duration: item.response.Value?.Duration,
              };
            });
            props.onUpload(_fileList, _file, fileAction);
          }
          
        }}
      >
        <Button
          icon={
            <UploadIcon
              style={{
                marginRight: 6,
                fontSize: 16,
                transform: 'translateY(3px)',
              }}
            />
          }
          style={{
            padding: '4px 10px',
            fontWeight: 'bold',
          }}
          onClick={e => {
            if (maxDisabled) {
              message.warning('上传数量已达上限');
              e.stopPropagation();
            }
          }}
        >
          点击上传
        </Button>
      </Upload>
    </div>
  );
};

export default UploadFileToLink;
