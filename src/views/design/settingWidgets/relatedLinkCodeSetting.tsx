import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Select, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { filter, find, isEmpty, map } from 'lodash';
import styles from './RelatedLinkCodeSetting.module.scss';
import useFormDesign from '@/hooks/useFormDesign';
import { MetaFormFieldDisplayType } from '@/CodeDefine/Operation/MetaFormFieldDisplayType';

interface Props {
  value: any;
  onChange: Function;
}
export default function RelatedLinkCodeSetting(props: Props) {
  const { value, onChange } = props;
  console.log('!!!value', value);
  const { FieldList } = useFormDesign();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(value);

  const handleDelTpl = () => {
    setSelected(null);
    onChange(null);
  };
  const handleOnChange = () => {
    // 将值更新给schema
    onChange(selected);

    setVisible(false);
  };

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const matchedItem = find(FieldList, item => item.Code === value);

  return (
    <div className={styles.wgtContainer}>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          <PlusOutlined />
          添加关联模板
        </Button>
      </div>
      <div className={styles.list}>
        {!isEmpty(matchedItem) && (
          <div className={styles.item}>
            <div className={styles.left}>
              <Tooltip placement="topLeft" title={matchedItem?.Name}>
                {matchedItem?.Name}
              </Tooltip>
            </div>
            <div className={styles.right}>
              <span
                onClick={() => {
                  handleDelTpl();
                }}
              >
                <DeleteOutlined />
              </span>
            </div>
          </div>
        )}
      </div>
      <Modal
        destroyOnClose
        width={600}
        title="关联模板"
        open={visible}
        onOk={() => {
          if (!selected) {
            message.error('不能为空');
          } else {
            handleOnChange();
          }
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <span>请选择模板：</span>
        <Select
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          showSearch
          placeholder="请选择组件"
          style={{ width: 300 }}
          onChange={val => {
            setSelected(val);
          }}
          value={selected}
          options={map(
            filter(
              FieldList,
              i => i.DisplayType._value === MetaFormFieldDisplayType.Link.Value,
            ),
            item => {
              return {
                value: item.Code,
                label: item.Name,
              };
            },
          )}
        />
      </Modal>
    </div>
  );
}
