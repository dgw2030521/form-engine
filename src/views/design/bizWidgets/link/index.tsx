import { Button, Space } from 'antd';
import { map } from 'lodash';
import React from 'react';

export default function Link(props) {
  const { schema } = props;

  // 上传组件-预览
  const getPreviewUrl = async (fileKey: string, preview: boolean) => {
    // const result = await IOInvoker.getDownUrl(fileKey, preview);
    // if (result.code.Code === 200) {
    //   return result.result;
    // }
    return null;
  };

  return (
    <Space direction={schema.direction} style={{ paddingTop: '5px' }}>
      {map(schema.links, (item, idx) => {
        return (
          <Button
            type='link'
            key={idx}
            onClick={async () => {
              const res = await getPreviewUrl(item.link_url, false);
              window.open(res, '_blank');
            }}>
            {item.link_title}
          </Button>
        );
      })}
    </Space>
  );
}
