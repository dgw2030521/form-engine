import { message, Select } from 'antd';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import { handlePostMessage } from '@/utils/commonTools';

const { Option } = Select;

interface FieldListCompProps {
  fieldKey: string;
  entityId: string;
  item: any;
  handleFieldChange: Function;
  idx: any;
  joinList: any;
}

export default function FieldListComp(props: FieldListCompProps) {
  const { fieldKey, entityId, item, handleFieldChange, idx, joinList } = props;
  const [filedLists, setFieldLists] = useState<any>([{ left: [], right: [] }]);

  const [fieldList, setFieldList] = useState<any[]>();
  const isInIframe = window.self !== window.top;
  const handleEntityChange = async (id: string) => {
    if (!isInIframe) {
      // const rst = await MetaDataTableInvoker.getByUUKey(id);
      // if (rst.code.Code === 200) {
      //   setFieldList(rst.result?.FieldList);
      // }
    } else {
      // 多接收一个key，记录路径
      handlePostMessage('getFieldList', id);
    }
  };
  useEffect(() => {
    if (entityId) {
      handleEntityChange(entityId);
    } else {
      setFieldList([]);
    }
  }, [entityId]);

  const handleMessage = ev => {
    const { type, body } = ev.data;
    if (type === 'returnGetFieldList') {
      if (body.code.Code === 200) {
        setFieldList(body.result?.FieldList);
        if (entityId) {
          const arr = [{ left: [], right: [] }];
          if (
            fieldKey === 'LeftField' &&
            item.LeftTable === body.result?.UUKey
          ) {
            // filedLists[idx].left = body.result?.FieldList;
            filedLists[idx] = {
              ...filedLists[idx],
              left: body.result?.FieldList,
            };
          } else if (
            fieldKey === 'RightField' &&
            item.RightTable.split('|')[0] === body.result?.UUKey
          ) {
            // filedLists[idx].right = body.result?.FieldList;
            filedLists[idx] = {
              ...filedLists[idx],
              right: body.result?.FieldList,
            };
          }
          setFieldLists([...filedLists]);
        }
      } else {
        message.error(body.code.Message);
      }
    }
  };
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < joinList.length; i++) {
      arr[i] = { left: [], right: [] };
    }
    setFieldLists([...arr]);
  }, []);

  useEffect(() => {
    //   响应事件来获取
    if (entityId) {
      window.addEventListener('message', handleMessage);
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [entityId]);

  return (
    <Select
      style={{ width: 120 }}
      placeholder='请选择字段'
      allowClear
      value={item[fieldKey]}
      onChange={val => {
        handleFieldChange(val);
      }}>
      {filedLists[idx]
        ? fieldKey === 'LeftField'
          ? map(filedLists[idx].left || [], item => {
              return (
                <Option key={item.Code} value={item.Code}>
                  {item.Name}
                </Option>
              );
            })
          : map(filedLists[idx].right || [], item => {
              return (
                <Option key={item.Code} value={item.Code}>
                  {item.Name}
                </Option>
              );
            })
        : map([], item => {
            return (
              <Option key={item.Code} value={item.Code}>
                {item.Name}
              </Option>
            );
          })}
      {/* {fieldKey === 'LeftField' ? map(filedLists[idx]['left'] || [], item => {
        return (
          <Option key={item.Code} value={item.Code}>
            {item.Name}
          </Option>
        );
      }) : map(filedLists[idx]['right'] || [], item => {
        return (
          <Option key={item.Code} value={item.Code}>
            {item.Name}
          </Option>
        );
      })} */}
      {/* {map(fieldList, item => {
         return (
           <Option key={item.Code} value={item.Code}>
             {item.Name}
           </Option>
         );
      })} */}
    </Select>
  );
}
