/* eslint-disable react/no-unstable-nested-components */
/**
 * FieldList需要自己维护
 */
import { Button, Form, message, Select, Space } from 'antd';
import { each, filter, map } from 'lodash';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Generator, { serializeToDraft } from 'src/components/FormBuilder';

import { MetaDataTableInvoker } from '@/CodeDefine/Operation/Invoker/MetaDataTableInvoker';
import { MetaFormInvoker } from '@/CodeDefine/Operation/Invoker/MetaFormInvoker';
import { MetaProducerInvoker } from '@/CodeDefine/Operation/Invoker/MetaProducerInvoker';
import { MetaDataProducerRO } from '@/CodeDefine/Operation/MetaDataProducerRO';
import { MetaDataTableDisplayConditionVO } from '@/CodeDefine/Operation/MetaDataTableDisplayConditionVO';
import { MetaDataTableRO } from '@/CodeDefine/Operation/MetaDataTableRO';
import { MetaFormUpdateVO } from '@/CodeDefine/Operation/MetaFormUpdateVO';
import { PolicyMetaFormCreateVO } from '@/CodeDefine/Operation/PolicyMetaFormCreateVO';
import CustomizeDialog from '@/components/CustomizeDialog';
import useFormDesign from '@/hooks/useFormDesign';
import { useFrameEmbed } from '@/hooks/useFrameEmbed';
import { clearFormAction } from '@/store/form';
import {
  setGlobalDataPoolEntity,
  setGlobalDataSource,
  setGlobalEntity,
} from '@/store/global';
import { useAppDispatch } from '@/store/hooks';
import { getRandomString, handlePostMessage } from '@/utils/commonTools';
import Buttons from '@/views/design/bizWidgets/buttons';
import IOInvokerUpload from '@/views/design/bizWidgets/IOInvokerUpload';
import Link from '@/views/design/bizWidgets/link';
import Upload from '@/views/design/bizWidgets/upload';
import BasicInfo from '@/views/design/detail/basicInfo';
import widgetCommonSettings from '@/views/design/settings/widgetCommonSettings';
import { widgetGlobalSettings } from '@/views/design/settings/widgetGlobalSettings';
import BackDataSetting from '@/views/design/settingWidgets/backDataSetting';
import FormSelector from '@/views/design/settingWidgets/formSelector';
import ListDatasource from '@/views/design/settingWidgets/listDatasource';
import MataDataRelation from '@/views/design/settingWidgets/mataDataRelation';
import PreDataSetting from '@/views/design/settingWidgets/preDataSetting';
import RelatedLinkCodeSetting from '@/views/design/settingWidgets/relatedLinkCodeSetting';

import RelationConfig from '../../components/EntityJoinRelation/relationConfig';
import styles from './design.module.scss';
import widgetsConfig from './settings/widgetsConfig';
import RelationBtn from './settingWidgets/relationBtn';
import SelectUnit from './settingWidgets/selectUnit';
import UploadFileToLink from './settingWidgets/uploadFiles';

export default function FormDesign() {
  const isInIframe = window.self !== window.top;

  const genRef = useRef() as any;

  const {
    getFormDetailById,
    FieldList,
    formDetail,
    FormSchema,
    setFormSchema,
    setFieldList,
    convertSchemaToField,
    persistDetail,
    FormEntityRelation,
    setEntityRelation,
    setAliasList,
  } = useFormDesign();

  const dispatch = useAppDispatch();
  const [dataSources, setDataSources] = useState<MetaDataProducerRO[]>();
  const navigate = useNavigate();
  const joinRelationRef: MutableRefObject<any> = useRef();

  const { isEmbedByGovProtocol, getEmbedSearchParams } = useFrameEmbed();
  const [preview, setPreview] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(true);
  const [relationOpen, setRelationOpen] = useState(false);
  const [basicInfoForm] = Form.useForm();
  const [relationInfoForm] = Form.useForm();
  const [selectedDataSource, setSelectedDataSource] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entityList, setEntityList] = useState<MetaDataTableRO[]>();
  const [dataPoolEntityList, setDataPoolEntityList] =
    useState<MetaDataTableRO[]>();
  const [selectOptions, setSelectOptions] = useState<any>({});
  const [selectUnit, setSelectUnit] = useState<any>({});
  const [fileLink, setFileLink] = useState<any>({});
  const params = useParams();
  const formId = params.id;

  const handlePreviewBtnClick = () => {
    setPreview(!preview);
  };

  useEffect(() => {
    setSelectedDataSource(formDetail?.Producer.ID);
  }, [formDetail?.Producer.ID]);

  /**
   * 点击保存：创建的话先打开弹窗；保存的话直接调用update
   */
  const handleSaveBtnClick = async () => {
    if (
      (!formId || formId === 'new' || searchParams.get('type') === '6') &&
      showAdd
    ) {
      //   先弹出创建窗口
      setCreateOpen(true);
    } else {
      const updateVO = new MetaFormUpdateVO();
      updateVO.Producer.ID = selectedDataSource;
      // 从detail里加载信息
      updateVO.Name = formDetail.Name;
      updateVO.Description = formDetail.Description;

      // 其它非表单字段
      updateVO.FieldList = FieldList;
      // @ts-ignore
      const value = genRef.current && genRef.current.getValue();

      const str = serializeToDraft(value);
      // FormSchema
      updateVO.FormSchema = str;
      updateVO.Table = FormEntityRelation.Table;
      updateVO.TableAlias = FormEntityRelation.TableAlias;
      updateVO.JoinList = FormEntityRelation.JoinList;

      if (!isInIframe) {
        const rst = await MetaFormInvoker.update(formId, updateVO);
        if (rst.code.Code === 200) {
          message.success('保存成功！');
        }
      } else {
        handlePostMessage('updateData', {
          id: formId,
          updateVO,
        });
      }
    }
  };

  const handleSaveJoinRelation = () => {
    const joinValues = relationInfoForm.getFieldsValue();

    // 重设RightTable选择的id
    each(joinValues.JoinList, item => {
      item.RightTable = item.RightTable?.split('|')[0];
    });
    // console.log('---joinValues---', joinValues);
    // console.log('----alias-----', joinRelationRef.current.getAliasTableList());

    setEntityRelation(joinValues);
    setAliasList(joinRelationRef.current.getAliasTableList());
    setRelationOpen(false);
  };

  const handleCreateNewForm = async () => {
    const values = basicInfoForm.getFieldsValue();
    const createVO = new PolicyMetaFormCreateVO();
    createVO.Producer.ID = selectedDataSource;
    createVO.Name = values.Name;
    createVO.UUKey = values.UUKey;
    createVO.Description = values.Description;
    // 其它非表单字段
    createVO.FieldList = FieldList;

    // @ts-ignore
    const value = genRef.current && genRef.current.getValue();

    console.log('???###???##value', value);

    const str = serializeToDraft(value);
    // FormSchema
    createVO.FormSchema = str;

    createVO.Table = FormEntityRelation.Table;
    createVO.TableAlias = FormEntityRelation.TableAlias;
    createVO.JoinList = FormEntityRelation.JoinList;
    createVO.AsDefault = !(searchParams.get('type') === '0');
    createVO.EditAttr = values.EditAttr;
    createVO.Visible = values.Visible;
    if (!isInIframe) {
      const rst = await MetaFormInvoker.create(createVO);
      if (rst.code.Code === 200) {
        message.success('保存成功');
        const detail = rst.result;
        setCreateOpen(false);
        navigate(`/${detail.ID}/edit`);
      }
    } else {
      if (searchParams.get('type') === '6') {
        createVO.AsDefault = false;
      }

      handlePostMessage('createData', {
        createVO,
      });
    }
  };

  const handleClearBtnClick = () => {
    // 需要清空schema
    // 需要清空设置
    // @ts-ignore
    genRef.current && genRef.current.clearSchema();
    dispatch(clearFormAction());

    message.success('清空成功');
  };

  /**
   * 下一步，将对应的数据写入store
   */
  const handleNextStep = () => {
    console.log('params', params);
    // @ts-ignore
    const _currentSchema = genRef.current && genRef.current.getValue();
    navigate(`/form/design/${formId || 'new'}/detail/${params.type}`);
    setFormSchema(_currentSchema);
    // @todo 这个也不用，实际操作会实时
    setFieldList(FieldList);
  };

  useEffect(() => {
    if (!isInIframe) {
      // 有id且store里不存在
      if (formId && !formDetail) {
        Promise.all([getFormDetailById(formId)]);
      }
    } else if (searchParams.get('type') === '6') {
      // 模板使用流程
      handlePostMessage('getTemplateInfo', formId);
    } else {
      handlePostMessage('getDetail', formId);
      if (searchParams.get('type') === '1') {
        handlePostMessage('getFormSchema', null);
      }
    }
  }, [formId]);

  const getEntitys = async () => {
    if (!isInIframe) {
      const rst = await MetaDataTableInvoker.displayAll();
      if (rst.code.Code === 200) {
        setEntityList(rst.result);
      }
    } else {
      handlePostMessage('getEntityList', null);
    }
  };

  const getDataPoolEntitys = async () => {
    if (!isInIframe) {
      const payload = new MetaDataTableDisplayConditionVO();
      payload.Active._value = 1;
      payload.Active._active = true;
      payload.SourceType._value = 1;
      payload.SourceType._active = true;
      const rst = await MetaDataTableInvoker.displayAllByConditionDataPool(
        payload,
      );
      if (rst.code.Code === 200) {
        setDataPoolEntityList(rst.result);
      }
    } else {
      handlePostMessage('getDataPoolEntityList', null);
    }
  };

  /**
   * 1. 保存，需要告诉上层要保存了，携带数据，上层执行保存，返回保存结果给iframe
   * 发送【saveData】，上层响应【saveData】，执行保存，保存之后上层发送【updateResult/createResult】,iframe响应
   * @param ev
   */
  const handleMessage = ev => {
    console.log('handleMessage: ', ev);
    const { type, body } = ev.data;
    // 上层要请求数据了
    if (type === 'returnGetDetail') {
      if (body.code.Code === 200) {
        const _formDetail = body.result;
        persistDetail(_formDetail);
      }
    } else if (type === 'returnGetTemplateInfo') {
      if (body.code.Code === 200) {
        const _formDetail = body.result;
        persistDetail(_formDetail);
      }
    } else if (type === 'returnCreateData') {
      if (body.code.Code === 200) {
        message.success('保存成功');
        const detail = body.result;
        setCreateOpen(false);
        setShowAdd(false);
        console.log(window.location);
        // if(searchParams.get('type') !== '6'){
        navigate(`/form/design/${detail.ID}/edit`);
        // }
      } else {
        message.error(`${body.code.Message}`);
      }
    } else if (type === 'returnUpdateData') {
      if (body.code.Code === 200) {
        message.success('保存成功');
      } else {
        message.error(`${body.code.Message}`);
      }
    } else if (type === 'returnGetEntityList') {
      if (body.code.Code === 200) {
        dispatch(setGlobalEntity(body.result));
        setEntityList(body.result);
      }
    } else if (type === 'returnGetDataPoolEntityList') {
      if (body.code.Code === 200) {
        dispatch(setGlobalDataPoolEntity(body.result));
      }
    } else if (type === 'returnGetDataSourceList') {
      if (body.code.Code === 200) {
        setDataSources(body.result);
        dispatch(setGlobalDataSource(body.result));
      } else if (type === 'returnFormSchema') {
        setFormSchema(body.result);
      }
    } else if (type === 'returnGetFormSchema') {
      persistDetail(body.result);
    }
  };

  const getDataSources = async () => {
    if (!isInIframe) {
      const rst = await MetaProducerInvoker.displayAll();
      if (rst.code.Code === 200) {
        setDataSources(rst.result);
      }
    } else {
      handlePostMessage('getDataSourceList', null);
    }
  };

  const updateFormSchema = (name, val, type, dataIndex?: any) => {
    // @ts-ignore
    const newSchema: any = genRef.current && genRef.current.getValue();
    if (type === 'select') {
      const mergedArray = Array.from(new Set(Object.values(val).flat()));
      // console.log('newSchema', newSchema);
      if (newSchema && newSchema.properties) {
        newSchema.properties[name] = {
          ...newSchema?.properties[name],
          relationOptions: val,
        };
        // console.log('关联项配置', val);
        mergedArray.map((item: string, index) => {
          // console.log('item', item);
          // console.log('index', index);
          // console.log('keys', keys);
          newSchema.properties[item] = {
            ...newSchema.properties[item],
            hidden: true,
          };
        });
      }
    }
    if (type === 'number') {
      if (newSchema && newSchema.properties) {
        newSchema.properties[name] = {
          ...newSchema?.properties[name],
          UnitID: val.ID,
          UnitName: val.Name,
        };
      }
    }
    if (type === 'Link') {
      if (newSchema && newSchema.properties) {
        const linkArr = newSchema?.properties[name].links;
        linkArr[dataIndex].link_url = val.Url;
        linkArr[dataIndex].file_to_link = val;
        newSchema.properties[name] = {
          ...newSchema?.properties[name],
          links: [...linkArr],
        };
      }
    }
    return newSchema;
  };

  const updateFieldList = (name, val, type) => {
    let newFieldList = FieldList;
    if (type === 'select') {
      const dataArray = Object.entries(val).map(([option, fieldCodes]) => {
        return {
          Option: option,
          FieldCodes: fieldCodes,
        };
      }) as any;
      newFieldList = newFieldList.map(item => {
        if (item.Code === name) {
          item.RelationOptions = dataArray;
        }
        return item;
      });
    }
    if (type === 'number') {
      newFieldList = newFieldList.map(item => {
        if (item.Code === name) {
          item.Unit.ID = val.ID;
        }
        return item;
      });
    }
    return newFieldList;
  };

  useEffect(() => {
    Promise.all([getEntitys(), getDataSources(), getDataPoolEntitys()]);
    // 响应事件来获取
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const [defaultFileList, setDefaultFileList] = useState(null);
  return (
    <div className={styles.design}>
      <div className={styles.operateBox}>
        <Space>
          <Select
            allowClear
            value={selectedDataSource}
            style={{ width: 200 }}
            placeholder='选择表单数据源'
            options={map(dataSources, item => {
              return {
                label: item.Name,
                value: item.ID,
              };
            })}
            onChange={val => {
              setSelectedDataSource(val);
            }}
          />
          <Button
            className={styles.btn}
            onClick={() => {
              let search = '?inner=1&';
              if (isEmbedByGovProtocol) search += getEmbedSearchParams();
              navigate(`/form${search}`);
            }}>
            返回列表
          </Button>
          {params.type !== 'preview' && (
            <>
              {/* <Button
                className={styles.btn}
                type="primary"
                danger
                onClick={() => {
                  setRelationOpen(true);
                }}
              >
                实体关系配置
              </Button> */}
              <CustomizeDialog
                width={1000}
                open={relationOpen}
                title='配置实体关系'
                onCancel={() => {
                  setRelationOpen(false);
                }}
                onOk={() => {
                  handleSaveJoinRelation();
                }}>
                <RelationConfig
                  ref={joinRelationRef}
                  entityList={filter(entityList, item => {
                    return item.Active;
                  })}
                  form={relationInfoForm}
                  initialValues={FormEntityRelation}
                />
              </CustomizeDialog>
              <Button
                className={styles.btn}
                onClick={() => {
                  handleClearBtnClick();
                }}>
                清空
              </Button>
              <Button
                className={styles.btn}
                onClick={() => {
                  handlePreviewBtnClick();
                }}>
                {preview ? '编辑' : '预览'}
              </Button>
              <Button
                type='primary'
                className={styles.btn}
                onClick={() => {
                  handleSaveBtnClick();
                }}>
                保存
              </Button>
            </>
          )}
          <CustomizeDialog
            width={600}
            open={createOpen}
            title='保存基础信息'
            onCancel={() => {
              setCreateOpen(false);
            }}
            onOk={() => {
              handleCreateNewForm();
            }}>
            <BasicInfo form={basicInfoForm} formDetail={formDetail} />
          </CustomizeDialog>
          <Button
            className={styles.btn}
            onClick={() => {
              handleNextStep();
            }}>
            总览
          </Button>
        </Space>
      </div>
      <div className={styles.designBox}>
        <Generator
          getId={name => {
            return `${name.split('_')[0]}_${getRandomString(6)}`;
          }}
          ref={genRef}
          hideInnerOperateButtons
          preview={preview}
          defaultValue={FormSchema}
          /** 画板自定义组件 */
          widgets={{ Buttons, Upload, Link, IOInvokerUpload }}
          settings={[...widgetsConfig]}
          commonSettings={widgetCommonSettings}
          globalSettings={widgetGlobalSettings}
          onCanvasSelect={data => {
            if (data.widget === 'select') {
              const name = data.$id?.slice(2);
              const result = data.enum.map((enumValue, index) => {
                const enumName = data.enumNames[index];
                return { enum: enumValue, enumName };
              });
              setSelectOptions({
                componentName: name,
                enum: result,
                FieldList: FieldList.filter(item => item.Code !== name),
                selectedOptions: data?.relationOptions,
              });
            }
            if (data.type === 'number') {
              const name = data.$id?.slice(2);
              setSelectUnit({
                componentName: name,
                UnitID: data.UnitID,
              });
            }
            if (data.widget === 'Link') {
              const name = data.$id?.slice(2);
              setFileLink({
                componentName: name,
                links: data.links,
              });
              // const linkList = data.links;
              // console.log('linkList---', linkList);
              // if (linkList && linkList.length) {
              //   const list = [];
              //   linkList.map(item => {
              //     if (item.file_to_link) {
              //       list.push({
              //         Key: item.file_to_link?.Key,
              //         Name: item.file_to_link?.Name,
              //         Url: item.file_to_link?.Url,
              //       });
              //     }
              //   })
              //   setDefaultFileList(list);
              // }
            }
          }}
          onSchemaChange={schema => {
            const _fieldList = convertSchemaToField(schema);
            setFieldList(_fieldList);
          }}
          onChange={data => {}}
          /** 配置栏自定义组件 */
          settingsWidgets={{
            MataDataRelation,
            PreDataSetting,
            RelatedLinkCodeSetting,
            BackDataSetting,
            RelationBtn: () => (
              <RelationBtn
                value={selectOptions}
                onChange={(name: any, val: any) => {
                  const newSchema = updateFormSchema(name, val, 'select');
                  const newList = updateFieldList(name, val, 'select');
                  setFieldList(newList);
                  console.log('添加关联newSchema', newSchema);
                  // console.log(name, '选中的关联项', val);
                  setSelectOptions(preValues => ({
                    ...preValues,
                    componentName: name,
                    selectedOptions: val,
                  }));
                  setFormSchema(newSchema);
                }}
              />
            ),
            FormSelector,
            ListDatasource,
            SelectUnit: () => {
              return (
                <SelectUnit
                  value={selectUnit}
                  onChange={(name: any, val: any) => {
                    const newSchema = updateFormSchema(name, val, 'number');
                    setSelectUnit({
                      componentName: name,
                      UnitID: val.ID,
                    });
                    const newList = updateFieldList(name, val, 'number');
                    setFieldList(newList);
                    setFormSchema(newSchema);
                  }}
                />
              );
            },
            UploadFileToLink: props => {
              return (
                <UploadFileToLink
                  {...props}
                  tip='支持pdf、png、jpg、pdf、doc、xls格式，文件大小不超过5M'
                  ext={[
                    '.pdf',
                    '.word',
                    '.xls',
                    '.xlsx',
                    '.doc',
                    '.docx',
                    '.jpg',
                    '.jpeg',
                    '.png',
                  ]}
                  fileSize={5}
                  maxCount={1}
                  options={fileLink}
                  defaultFileList={
                    props.addons.getValue().links &&
                    props.addons.getValue().links[props.addons.dataIndex] &&
                    props.addons.getValue().links[props.addons.dataIndex]
                      .file_to_link
                      ? [
                          props.addons.getValue().links[props.addons.dataIndex]
                            .file_to_link,
                        ]
                      : []
                  }
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: false,
                  }}
                  onFileChange={(val, name) => {
                    const infoObj = {
                      // Key: val.response.Value.Key,
                      Name: val.response.Value.Name || val.name,
                      Url: val.response.Value,
                    };
                    // const list = [infoObj];
                    // setDefaultFileList(list);
                    const newSchema = updateFormSchema(
                      name,
                      infoObj,
                      'Link',
                      props.addons.dataIndex,
                    );
                    props.addons.setValueByPath(
                      `links[${props.addons.dataIndex}].link_url`,
                      infoObj.Url,
                    );
                    props.addons.setValueByPath(
                      `links[${props.addons.dataIndex}].file_to_link`,
                      infoObj,
                    );
                    const linksArr = newSchema?.properties[name]?.links;
                    setFileLink({
                      componentName: name,
                      links: [...linksArr],
                    });
                    setFormSchema(newSchema);
                  }}
                />
              );
            },
          }}
        />
      </div>
    </div>
  );
}
