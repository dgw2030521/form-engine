import { Button, Form, message, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { MetaFormInvoker } from '@/CodeDefine/Operation/Invoker/MetaFormInvoker';
import { MetaFormDisplayConditionVO } from '@/CodeDefine/Operation/MetaFormDisplayConditionVO';
import { MetaFormUpdateVO } from '@/CodeDefine/Operation/MetaFormUpdateVO';
import { PolicyMetaFormRO } from '@/CodeDefine/Operation/PolicyMetaFormRO';
import CustomizeDialog from '@/components/CustomizeDialog';
import useFormDesign from '@/hooks/useFormDesign';
import { useFrameEmbed } from '@/hooks/useFrameEmbed';
import Template from '@/Templates/tablelist02';
import { handlePostMessage, USE_URL_SEARCH } from '@/utils/commonTools';
import { constant } from '@/utils/constant';
import { ViPage } from '@/ViCross/ViPage';
import BasicInfo from '@/views/design/detail/basicInfo';

import styles from './index.module.scss';
import TemplateData from './templateData';

const DEFAULT_PAGE_SIZE = 10;

const mockData = [
  {
    id: 1,
    name: '模板1',
    desc: '企业基本信息',
  },
  {
    id: 2,
    name: '模板2',
    desc: '企业基本信息企业基本信息企业基本信息企业基本信息企业基本信息企业基本信息',
  },
  {
    id: 3,
    name: '模板3',
    desc: '企业基本信息',
  },
  {
    id: 4,
    name: '模板4',
    desc: '企业基本信息',
  },
  {
    id: 5,
    name: '模板5',
    desc: '企业基本信息',
  },
];

export default function FormIndex() {
  const isInIframe = window.self !== window.top;
  const { switchForm, persistDetail, formDetail } = useFormDesign();
  const [form] = Form.useForm();
  const [type, setType] = useState(0);
  const [basicInfoForm] = Form.useForm();
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  const [addForm, setAddForm] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [listData, setListData] = useState<ViPage<PolicyMetaFormRO>>();
  const [currentFormInfo, setCurrentFormInfo] = useState<PolicyMetaFormRO>();
  const initialCond = new MetaFormDisplayConditionVO();
  const { isEmbedByGovProtocol, getEmbedSearchParams } = useFrameEmbed();

  const newFromCreateOptions = isEmbedByGovProtocol
    ? [
        {
          value: 0,
          label: '自定义表单',
        },
      ]
    : [
        {
          value: 1,
          label: '默认表单',
        },
        {
          value: 0,
          label: '自定义表单',
        },
      ];

  const initPagination = {
    pageIdx: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  if (USE_URL_SEARCH) {
    initialCond.Active._value = Number(searchParams.get('Active')) || 0;
    initialCond.Name = searchParams.get('Name') || '';
    initPagination.pageIdx = Number(searchParams.get('pageIdx')) || 1;
    initPagination.pageSize =
      Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE;
  }

  const [queryCondition, setQueryCondition] = useState(initialCond);
  const [pagination, setPagination] = useState(initPagination);

  const getListData = async (
    params: MetaFormDisplayConditionVO,
    pg: typeof initPagination,
  ) => {
    setLoading(true);
    if (!isInIframe) {
      const rst = await MetaFormInvoker.display(
        params,
        pg.pageIdx,
        pg.pageSize,
      );
      if (rst.code.Code === 200) {
        // setListData(rst.result);
      }
    } else {
      handlePostMessage('getList', {
        queryCondition: params,
        pagination: pg,
      });
    }

    setLoading(false);
  };

  const onPageChange = (current, pageSize) => {
    const newPagination = { ...pagination, pageIdx: current, pageSize };
    setPagination(newPagination);
    getListData(queryCondition, newPagination);
  };

  const onFinish = async values => {
    const newCondi = new MetaFormDisplayConditionVO();
    newCondi.Name = values.Name;
    setQueryCondition(newCondi);
    await getListData(newCondi, pagination);
  };

  const getFormDetailById = async (id: string) => {
    setCreateOpen(true);
    if (!isInIframe) {
      const rst = await MetaFormInvoker.get(id);
      if (rst.code.Code === 200) {
        const _formDetail = rst.result;
        // setCurrentFormInfo(_formDetail);
        persistDetail(_formDetail);
        // basicInfoForm.setFieldsValue(_formDetail);
      }
    } else {
      handlePostMessage('getDetail', id);
    }
  };

  const deleteById = async (id: string) => {
    if (!isInIframe) {
      const rst = await MetaFormInvoker.destroy(id);
      if (rst.code.Code === 200) {
        message.success('删除成功');
        getListData(queryCondition, pagination);
      }
    } else {
      handlePostMessage('deleteById', id);
    }
  };

  const copyById = async (id: string) => {
    Modal.confirm({
      title: '复制提示',
      content: '确认复制该表单',
      onOk: () => {
        handlePostMessage('copyById', id);
      },
    });
  };

  const publishById = async (id: string) => {
    const rst = await MetaFormInvoker.enable(id);
    if (rst.code.Code === 200) {
      message.success('发布成功');
      getListData(queryCondition, pagination);
    }
  };
  const offlineById = async (id: string) => {
    const rst = await MetaFormInvoker.disable(id);
    if (rst.code.Code === 200) {
      message.success('下线成功');
      getListData(queryCondition, pagination);
    }
  };

  const handleUpdateFormBasicInfo = async () => {
    const values = basicInfoForm.getFieldsValue();
    let updateVO = new MetaFormUpdateVO();
    updateVO = { ...currentFormInfo, ...values };
    if (!isInIframe) {
      const rst = await MetaFormInvoker.update(currentFormInfo.ID, updateVO);
      if (rst.code.Code === 200) {
        message.success('更新成功');
        setCreateOpen(false);
        getListData(queryCondition, pagination);
      }
    } else {
      handlePostMessage('updateData', {
        id: currentFormInfo.ID,
        updateVO,
      });
    }
  };

  const reset = async () => {
    form.resetFields();
    await getListData(initialCond, initPagination);
    setQueryCondition(initialCond);
  };

  // 1. 接收上层请求数据【getList】的事件，将查询条件透出【respGetList】
  // --->上层发送getList事件给iframe，然后响应respGetList接收iframe传递的参数
  // 2. 接收上层查询后的数据【returnListResult】
  // ----->上层执行完查询后，发送returnListResult事件给iframe，iframe响应returnListResult事件接收结果
  const handleMessage = ev => {
    const { type, body } = ev.data;
    // 上层要请求数据了
    if (type === 'getList') {
      // 传送查询条件给上层，是因为上层还要做一层业务封装查询
      handlePostMessage('respGetList', {
        queryCondition,
        pagination,
      });
    } else if (type === 'returnListResult') {
      setListData(body.result);
    } else if (type === 'returnDeleteById') {
      if (body.code.Code === 200) {
        message.success('删除成功');
        getListData(queryCondition, pagination);
      } else {
        message.error(body.code.Message);
      }
    } else if (type === 'returnGetDetail') {
      if (body.code.Code === 200) {
        const _formDetail = body.result as PolicyMetaFormRO;
        setCurrentFormInfo(_formDetail);
        persistDetail(_formDetail);
        // basicInfoForm.setFieldsValue(_formDetail);
      } else {
        message.error(body.code.Message);
      }
    } else if (type === 'returnUpdateData') {
      if (body.code.Code === 200) {
        message.success('更新成功');
        setCreateOpen(false);
        getListData(queryCondition, pagination);
      } else {
        message.error(body.code.Message);
      }
    } else if (type === 'returnCopyById') {
      if (body.code.Code === 200) {
        message.success('复制成功');
        getListData(queryCondition, pagination);
      } else {
        message.error(body.code.Message);
      }
    } else if (type === 'returnAddTemplateById') {
      if (body.code.Code === 200) {
        message.success('设置成功');
        getListData(queryCondition, pagination);
      } else {
        message.error(body.code.Message);
      }
    } else if (type === 'returnDeleteTemplateById') {
      if (body.code.Code === 200) {
        message.success('移除模板成功');
        getListData(queryCondition, pagination);
      } else {
        message.error(body.code.Message);
      }
    }
  };

  // 设置模板
  const setModuleFun = record => {
    Modal.confirm({
      title: '设为模板',
      okText: '确定',
      cancelText: '取消',
      content: (
        <>
          <br />
          {record.hasTemplate
            ? '该表单曾被设为模板，确定继续被设为模板吗？'
            : '确定将该表单设为模板吗？'}
          <br />
          <br />
          模板设置成功后，仅自己可见可使用
        </>
      ),
      onOk: () => {
        handlePostMessage('addTemplate', record.ID);
      },
    });
  };

  const viewForm = id => {
    switchForm();
    navigate(`/form/design/${id}/preview`);
  };
  // 模板使用
  const useForm = id => {
    switchForm();
    navigate(`/form/design/${id}/edit?type=6`);
  };

  useEffect(() => {
    console.log('in i');
    Promise.all([getListData(initialCond, initPagination)])
      .then(() => {})
      .catch(e => {
        setLoading(false);
      });
    //   响应事件来获取
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (addForm !== 0) {
      switchForm();
      const search = getEmbedSearchParams();
      console.log('🚀 ~ useEffect ~ search:', search);
      navigate(`design?type=${type}&${search}`);
    }
  }, [addForm]);

  return (
    <>
      <CustomizeDialog
        width={600}
        open={createOpen && !!formDetail}
        title='编辑基础信息'
        onCancel={() => {
          setCreateOpen(false);
          switchForm();
          basicInfoForm.resetFields();
        }}
        onOk={() => {
          handleUpdateFormBasicInfo();
        }}>
        <BasicInfo form={basicInfoForm} formDetail={formDetail} />
      </CustomizeDialog>
      <TemplateData viewFun={viewForm} useFun={useForm} />
      <Template
        Search={{
          RowProps: {
            gutter: [16, 16],
          },
          FormProps: {
            form,
            onFinish,
          },
          ColProps: {
            span: 8,
          },
          Fields: [
            {
              FormItem: {
                label: '表单名称',
                name: 'Name',
              },
              component: 'Input',
              componentProps: {
                placeholder: '请输入',
              },
            },
          ],

          Buttons: [
            { text: '查询', type: 'primary', htmlType: 'submit' },
            {
              text: '重置',
              onClick: () => {
                reset();
              },
            },
          ],
          ButtonsColProps: {
            span: 16,
            style: {
              textAlign: 'right',
            },
          },
        }}
        Action={
          <Space style={{ paddingBottom: '20px' }}>
            <Button
              type='primary'
              onClick={() => {
                // Modal.confirm({
                //   title: '新增表单',
                //   content: (
                //     <Select
                //       style={{ width: '100%' }}
                //       options={newFromCreateOptions}
                //       onChange={val => {
                //         setType(val);
                //       }}
                //     />
                //   ),
                //   onOk: () => {
                //     setAddForm(addForm + 1);
                //   },
                // });
                setAddForm(addForm + 1);
              }}>
              新增表单
            </Button>
          </Space>
        }
        Table={{
          scroll: {
            scrollToFirstRowOnChange: true,
            x: '100%',
          },
          rowKey: 'ID',
          columns: [
            constant.TableIndex({
              pageIdx: pagination.pageIdx,
              pageSize: pagination.pageSize,
              fixed: true,
              width: 60,
            }),
            {
              title: '表单名称',
              dataIndex: 'Name',
              width: 120,
              ellipsis: true,
              fixed: true,
            },
            {
              title: '英文名称',
              dataIndex: 'UUKey',
              width: 120,
              ellipsis: true,
              fixed: true,
            },
            {
              title: '表单描述',
              dataIndex: 'Description',
              width: 300,
              ellipsis: true,
            },
            {
              title: '状态',
              dataIndex: 'StatusDesc',
              width: 200,
              ellipsis: true,
            },
            // {
            //   title: '画板类型',
            //   width: 100,
            //   render: (_, record: MetaFormRO) => {
            //     return MetaFormTerminalType.Get(
            //       record.TerminalType._value,
            //       null,
            //     )?.Name;
            //   },
            // },
            // {
            //   title: '表单类型',
            //   ellipsis: true,
            //   width: 100,
            //   render: (_, record: MetaFormRO) => {
            //     return MetaFormType.Get(record.FormType._value, null)?.Name;
            //   },
            // },
            // {
            //   title: '发布状态',
            //   width: 100,
            //   ellipsis: true,
            //   render: (_, record: MetaFormRO) => {
            //     return (
            //       StatusType.Get(record.StatusType._value, null).Desc ||
            //       StatusType.Get(record.StatusType._value, null).Name
            //     );
            //   },
            // },
            {
              title: '维护人员',
              key: 'LastModifier',
              dataIndex: 'LastModifier',
              width: 200,
              ellipsis: true,
            },
            {
              title: '维护时间',
              key: 'UpdateTime',
              dataIndex: 'UpdateTime',
              width: 200,
              ellipsis: true,
            },
            constant.TableAction({
              fixed: 'right',
              width: 200,
              ButtonsRender: (text, record: PolicyMetaFormRO) => {
                const _buttons = [
                  {
                    label: '预览配置',
                    onClick: () => {
                      viewForm(record.ID);
                    },
                  },
                  {
                    label: '设为模板',
                    onClick: () => {
                      setModuleFun(record);
                      //  deleteModuleFun(record)
                    },
                  },
                  record?.Edit
                    ? {
                        label: '进入配置',
                        onClick: () => {
                          switchForm();
                          navigate(`/form/design/${record.ID}/edit`);
                        },
                      }
                    : null,
                  record.Edit
                    ? {
                        label: '编辑',
                        onClick: () => {
                          getFormDetailById(record.ID);
                        },
                      }
                    : null,
                  {
                    label: '复制',
                    onClick: () => {
                      copyById(record.ID);
                    },
                  },
                  {
                    confirm: true,
                    confirmTips:
                      '删除后已被引用的表单将失效，配置页面需要重新选择表单进行配置保存并重新政策上架申请，请确认是否删除?',
                    label: <span style={{ color: 'red' }}>删除</span>,
                    onClick: () => {
                      deleteById(record.ID);
                    },
                  },
                ].filter(item => item);
                // if (!isInIframe) {
                //   _buttons.push({
                //     confirm: true,
                //     confirmTips: '确定要设置成模板吗?',
                //     label: '设为模板',
                //     onClick: () => {
                //       message.warn('暂不支持！');
                //     },
                //   });
                //
                //   if (!record.Active) {
                //     _buttons.push({
                //       label: '发布',
                //       confirm: true,
                //       confirmTips: '确认发布吗?',
                //       onClick: () => {
                //         publishById(record.ID);
                //       },
                //     });
                //   } else {
                //     _buttons.push({
                //       label: '下线',
                //       confirm: true,
                //       confirmTips: '确认下线吗?',
                //       onClick: () => {
                //         offlineById(record.ID);
                //       },
                //     });
                //   }
                // }

                return _buttons;
              },
            }),
          ],
          dataSource: listData?.Value,
          loading,
          pagination: {
            hideOnSinglePage: false,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: onPageChange,
            current: listData?.Current || 1,
            total: listData?.Total || 0,
            pageSize: pagination?.pageSize,
          },
        }}
      />
      <section className={styles.memoTips}>
        <p>注意：</p>
        <p>
          1.编辑操作，编辑后保存即生效，所引用的页面会同步变更，政策重新发版通过后对外才会同步更新!
        </p>
        <p>
          2.删除操作，删除后需要重新对引用表单的页面进行配置，然后重新政策上架通过后对外才会同步更新！
        </p>
      </section>
    </>
  );
}
