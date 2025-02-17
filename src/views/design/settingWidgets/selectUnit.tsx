import React, { useEffect, useState } from 'react';
import { Select, Form } from 'antd';
import { map } from 'lodash';
import { MetaUnitInvoker } from '@/CodeDefine/Operation/Invoker/MetaUnitInvoker';
import { handlePostMessage } from '@/utils/commonTools';

// entityId:xxx,metadata:xxx,dataSourceId:xxx
interface RelationBtnProps {
  value?: any;
  onChange?: Function;
}

export default function SelectUnit(props: RelationBtnProps) {
  const isInIframe = window.self !== window.top;
  const [unitList, setUnitList] = useState<any>([]);

  const getAllUnitList = async () => {
    if (!isInIframe) {
      const res = await MetaUnitInvoker.displayAll();
      if (res.code.Code === 200) {
        setUnitList(res.result);
      }
    } else {
      handlePostMessage('getUnitList', null);
    }
  };

  const handleMessage = ev => {
    const { type, body } = ev.data;
    if (type === 'returnUnitList') {
      if (body.code.Code === 200) {
        setUnitList(body.result);
      }
    }
  };

  // 计量单位选择
  const onValuesChange = value => {
    // 将值回传给formItem
    const unit = unitList.find(item => item.ID === value);
    props.onChange(props.value?.componentName, unit);
  };

  // 组件刷新
  // useEffect(() => {
  //   if (props.value?.unitKey) {
  //     setDefaultKey(props.value?.unitKey);
  //   }
  // }, [props.value?.unitKey]);

  useEffect(() => {
    console.log('单位props', props.value);
    Promise.all([getAllUnitList()]);
    //   响应事件来获取
    window.onmessage = handleMessage;
    return () => {
      window.onmessage = null;
    };
  }, []);

  return (
    <Form>
      <Form.Item label="计量单位选择">
        <Select
          defaultValue={props.value?.UnitID}
          style={{ width: '140px' }}
          placeholder="请选择计量单位"
          options={map(unitList, item => {
            return {
              label: item.Name,
              value: item.ID,
            };
          })}
          onChange={onValuesChange}
        />
      </Form.Item>
    </Form>
  );
}
