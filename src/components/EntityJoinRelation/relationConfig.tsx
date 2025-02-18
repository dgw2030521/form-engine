/**
 * 条件设置
 */
import { Form, Input, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import { setProperty } from 'dot-prop';
import update from 'immutability-helper';
import { each, find, map } from 'lodash';
import React, {
  forwardRef,
  memo,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { AliasTable, EntityRelation } from '@/store/form';
import { convertJoinList2AliasList } from '@/utils/commonTools';

import ListItems from './listItems';

interface RelationConfigProps {
  form: FormInstance;
  initialValues: EntityRelation;
  // 实体数据源
  entityList: any[];
}

function RelationConfig(props: RelationConfigProps, ref: Ref<any>) {
  const { form, entityList, initialValues } = props;
  // aliasList出去之后，不带|，外面的aliasList由这个组件生产，但不消费，这里的由EntityRelation构建
  const [aliasTableList, setAliasList] = useState<AliasTable[]>([]);
  const [mainAlias, setMainAlias] = useState<AliasTable>({
    ID: '',
    Name: '',
  });

  const [unionAliasList, setUnionAliasList] = useState<AliasTable[]>([]);

  const handleUpdateMainAlias = (content: any) => {
    let aliasOperDesc = {};
    if (content.Name) {
      aliasOperDesc = setProperty(aliasOperDesc, `Name.$set`, content.Name);
    }
    if (content.ID) {
      aliasOperDesc = setProperty(aliasOperDesc, `ID.$set`, content.ID);
    }

    const newMainAlias = update(mainAlias, aliasOperDesc);
    setMainAlias(newMainAlias);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      const unionList = convertJoinList2AliasList(initialValues, true);
      console.log('#####unionList', unionList);
      setUnionAliasList(unionList);
      let _mainAlias;
      const _aliasList = [];
      each(unionList, item => {
        if (item.ID.includes('|-1')) {
          _mainAlias = item;
        } else {
          _aliasList.push(item);
        }
      });

      setMainAlias(_mainAlias);
      setAliasList(_aliasList);
    }
  }, [initialValues]);

  const handleAddAlias = () => {
    // 增加一组关联，会默认创建一个别名对象
    const newAlias = { ID: '', Name: '' };
    const aliasOperDesc = setProperty({}, `$push`, [newAlias]);
    const newAliasList = update(aliasTableList, aliasOperDesc);
    setAliasList(newAliasList);
  };

  const handleDelAlias = (idx: number) => {
    const aliasOperDesc = setProperty({}, `$splice`, [[idx, 1]]);
    const newAliasList = update(aliasTableList, aliasOperDesc);
    setAliasList(newAliasList);
  };

  const handleUpdateAlias = (idx: number, content: any) => {
    let aliasOperDesc = {};
    if (content.Name) {
      aliasOperDesc = setProperty(
        aliasOperDesc,
        `[${idx}].Name.$set`,
        content.Name,
      );
    }
    if (content.ID) {
      aliasOperDesc = setProperty(
        aliasOperDesc,
        `[${idx}].ID.$set`,
        content.ID,
      );
    }

    const newAliasList = update(aliasTableList, aliasOperDesc);
    setAliasList(newAliasList);
  };

  useEffect(() => {
    // 过滤没设置完整的
    const unionAlias = [...aliasTableList, mainAlias].filter(item => {
      return item.ID && item.Name;
    });

    setUnionAliasList(unionAlias);
  }, [aliasTableList, mainAlias]);

  useImperativeHandle(ref, () => ({
    getAliasTableList: () => {
      return each(unionAliasList, item => {
        item.ID = item.ID.split('|')[0];
      });
    },
  }));

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete='off'>
      <Space>
        <Form.Item label='' name='Table' wrapperCol={{ span: 20 }}>
          <Select
            style={{ width: 200 }}
            placeholder='请选择主表'
            showSearch
            filterOption={(input, option: any) => {
              return (
                option.label.includes(input) ||
                String(option.value) === String(input)
              );
            }}
            onChange={val => {
              const matchedItem = find(entityList, item => item.UUKey === val);
              // -1是主表
              handleUpdateMainAlias({
                ID: `${val}|-1`,
                Name: matchedItem?.Name,
              });
              form.setFieldValue('TableAlias', matchedItem?.Name);
            }}
            options={map(entityList, item => {
              return {
                label: item.Name,
                value: item.UUKey,
              };
            })}
          />
        </Form.Item>
        <Form.Item name='TableAlias' hidden>
          <Input
            readOnly
            placeholder='设置主表别名'
            style={{ width: 200 }}
            onChange={ev => {
              handleUpdateMainAlias({ Name: ev.target.value });
            }}
          />
        </Form.Item>
      </Space>
      <Form.Item label='' name='JoinList' wrapperCol={{ span: 24 }}>
        <ListItems
          entityList={entityList}
          aliasTableList={unionAliasList}
          handleAddAlias={handleAddAlias}
          handleDelAlias={handleDelAlias}
          handleUpdateAlias={handleUpdateAlias}
        />
      </Form.Item>
    </Form>
  );
}

export default memo(forwardRef(RelationConfig));
