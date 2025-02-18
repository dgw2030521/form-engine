/**
 * 先编辑完整joinList,主表取第一个
 * 确定的时候，将关联表别名都存在本地
 */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, Row, Select, Space } from 'antd';
import { setProperty } from 'dot-prop';
import update from 'immutability-helper';
import { each, find, map } from 'lodash';
import React from 'react';

import useFormDesign from '@/hooks/useFormDesign';

import FieldListComp from './fieldListComp';
import styles from './listItem.module.scss';

const { Option } = Select;

interface ListItemsProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  entityList: any[];

  aliasTableList: any;
  handleAddAlias: Function;
  handleDelAlias: Function;
  handleUpdateAlias: Function;
}

export default function ListItems(props: ListItemsProps) {
  const {
    onChange,
    entityList,
    aliasTableList,
    handleAddAlias,
    handleDelAlias,
    handleUpdateAlias,
  } = props;

  const { FormEntityRelation } = useFormDesign();

  console.log('###FormEntityRelation', FormEntityRelation);

  // 初始化的
  const JoinList = props.value || [];

  /**
   * 增加一组关系
   */
  const handleAddRelation = () => {
    const joinTO = any as {};
    joinTO.LeftTable = undefined;
    joinTO.LeftField = undefined;
    joinTO.RightTable = undefined;
    joinTO.RightField = undefined;
    const operatesDesc = setProperty({}, `$push`, [joinTO]);

    const newData = update(JoinList, operatesDesc);
    onChange(newData);

    // 增加一组关联，会默认创建一个别名对象
    handleAddAlias();
  };

  /**
   * 删除一组关系
   * @param idx
   */
  const handleDelRelation = (idx: number) => {
    const operatesDesc = setProperty({}, `$splice`, [[idx, 1]]);
    const newData = update(JoinList, operatesDesc);
    onChange(newData);
    //
    handleDelAlias(idx);
  };

  /**
   * 触发值的变化，将值回传onChange到formItem
   * @param params
   */
  const handleFieldChange = (
    params: { nodePath: string; key: string; val: any }[],
  ) => {
    let operatesDesc = {};
    each(params, item => {
      const { nodePath, key, val } = item;
      operatesDesc = setProperty(
        operatesDesc,
        `[${nodePath}].${key}.$set`,
        val,
      );
    });

    const newData = update(JoinList, operatesDesc);

    onChange(newData);
  };

  const renderJoinList = (data: any[]) => {
    return map(data, (item, idx) => {
      // 减去主表
      let rightTableVar;
      if (item.RightTable && !item.RightTable.includes('|')) {
        if (FormEntityRelation.TableAlias === item.RightTableAlias) {
          rightTableVar = `${item.RightTable}|-1`;
        } else {
          rightTableVar = `${item.RightTable}|${idx - 1}`;
        }
      }

      console.log(rightTableVar);

      return (
        <Row gutter={5} className={styles.header} key={idx}>
          {/* <Col span={3}> */}
          {/*  <Select> */}
          {/*    {map(LOGIC_MAP, (val, key) => { */}
          {/*      return <Option key={key}>{val}</Option>; */}
          {/*    })} */}
          {/*  </Select> */}
          {/* </Col> */}
          <Col span={14}>
            <Space>
              {/* <span>LEFT JOIN</span> */}
              <Select
                value={item.LeftTable}
                placeholder='选择关联实体表'
                allowClear
                style={{ width: 200 }}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.label.includes(input) ||
                    String(option.value) === String(input)
                  );
                }}
                onChange={val => {
                  // 可能会重复设置
                  handleUpdateAlias(idx, { ID: `${val}|${idx}` });
                  handleFieldChange([
                    {
                      nodePath: `${idx}`,
                      key: 'LeftTable',
                      val,
                    },
                    {
                      nodePath: `${idx}`,
                      key: 'LeftField',
                      val: undefined,
                    },
                  ]);
                }}
                options={map(entityList, item => {
                  return {
                    label: item.Name,
                    value: item.UUKey,
                  };
                })}
              />
              <span>AS</span>
              <Input
                value={item.LeftTableAlias}
                placeholder='设置别名'
                style={{ width: 100 }}
                onChange={ev => {
                  handleUpdateAlias(idx, { Name: ev.target.value });
                  handleFieldChange([
                    {
                      nodePath: `${idx}`,
                      key: 'LeftTableAlias',
                      val: ev.target.value,
                    },
                  ]);
                }}
              />
              <span>ON</span>
              <FieldListComp
                key={`${idx}|left`}
                idx={idx}
                fieldKey='LeftField'
                item={item}
                entityId={item.LeftTable}
                joinList={JoinList}
                handleFieldChange={val => {
                  handleFieldChange([
                    {
                      nodePath: `${idx}`,
                      key: 'LeftField',
                      val,
                    },
                  ]);
                }}
              />
            </Space>
          </Col>
          <Col span={1}>
            <span>=</span>
          </Col>
          <Col span={9}>
            <Space>
              <Select
                placeholder='选择别名表'
                allowClear
                value={rightTableVar}
                notFoundContent='请确认是否已设置别名！'
                style={{ width: 200 }}
                onChange={val => {
                  const matchedAliasTable = find(
                    aliasTableList,
                    item => item.ID === val,
                  );
                  handleFieldChange([
                    {
                      nodePath: `${idx}`,
                      key: 'RightTable',
                      val,
                    },
                    {
                      nodePath: `${idx}`,
                      key: 'RightTableAlias',
                      val: matchedAliasTable?.Name,
                    },
                    {
                      nodePath: `${idx}`,
                      key: 'RightField',
                      val: undefined,
                    },
                  ]);
                }}>
                {map(aliasTableList, item => {
                  const thisID = item.ID;
                  const thisIdx = thisID.split('|')[1];
                  return (
                    <Option
                      key={`${item.ID}`}
                      disabled={
                        // 当前行设置的当前行就不可用
                        String(idx) === String(thisIdx)
                      }>
                      {item.Name}
                    </Option>
                  );
                })}
              </Select>
              <FieldListComp
                key={`${idx}|right`}
                idx={idx}
                fieldKey='RightField'
                item={item}
                entityId={item.RightTable?.split('|')?.[0]}
                joinList={JoinList}
                handleFieldChange={val => {
                  handleFieldChange([
                    {
                      nodePath: `${idx}`,
                      key: 'RightField',
                      val,
                    },
                  ]);
                }}
              />
              <Button
                danger
                size='small'
                shape='circle'
                onClick={() => {
                  handleDelRelation(idx);
                }}>
                <DeleteOutlined />
              </Button>
            </Space>
          </Col>
        </Row>
      );
    });
  };

  return (
    <div className={styles.conditionItem}>
      <Row gutter={5} className={styles.header}>
        {/* <Col span={3}>关联</Col> */}
        <Col span={14}>关联表</Col>
        <Col span={1}>比较</Col>
        <Col span={9}>其他表</Col>
      </Row>
      <Divider style={{ margin: '10px 0' }} />
      {renderJoinList(JoinList)}
      <Divider style={{ margin: '10px 0' }} />
      <Button
        type='primary'
        onClick={() => {
          handleAddRelation();
        }}>
        <PlusOutlined />
        增加关联关系
      </Button>
    </div>
  );
}
