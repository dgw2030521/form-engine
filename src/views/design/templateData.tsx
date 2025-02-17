import { Button, Empty, Modal, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';

import { handlePostMessage } from '@/utils/commonTools';

import styles from './templateData.module.scss';

export default function TemplateData({ viewFun, useFun }) {
  const [isRefresh, setFresh] = useState(0);
  const [showModal, setShow] = useState(false);
  const [viewList, setViewList] = useState([]);
  const [listObj, setListObj] = useState({
    total: 0,
    list: [],
    currentPage: 1,
  });
  const renderItem = item => {
    return (
      <div className={styles.templateItem}>
        <div className={styles.hoverDiv}>
          <Button onClick={() => viewFun(item.sourceMetaForm.ID)}>预览</Button>
          <Button type='primary' onClick={() => useFun(item.ID)}>
            使用
          </Button>
          <Button danger onClick={() => deleteModuleFun(item.ID)}>
            移除
          </Button>
        </div>
        <h4 title={item.Name}>{item.Name}</h4>
        <p>说明：{item.Description || '-'}</p>
      </div>
    );
  };

  const changePage = page => {
    console.log(`页面切换：${page}`);
    handlePostMessage('getTemplatePage', page);
  };

  const lookAll = () => {
    handlePostMessage('getTemplatePage', 1);
  };

  const deleteModuleFun = id => {
    Modal.confirm({
      title: '移除模板',
      okText: '确定',
      cancelText: '取消',
      content: (
        <>
          <br />
          确定移除该表单模板吗？
        </>
      ),
      onOk: () => {
        handlePostMessage('deleteTemplateById', id);
      },
    });
  };

  const handleMessage = ev => {
    const { type, body } = ev.data;
    if (type === 'returnGetTemplateByPage') {
      const { Current = 1, Total = 0, Value = [] } = body;
      setListObj({ currentPage: Current, total: Total, list: Value });
      setShow(true);
    }
    if (type === 'returnGetTemplateList') {
      setViewList(body.result?.Value || []);
    }
    if (type === 'returnAddTemplateById') {
      if (body.code.Code === 200) {
        // setFresh(new Date().getTime())
        handlePostMessage('getTemplateList', '');
      }
    } else if (type === 'returnDeleteTemplateById') {
      if (body.code.Code === 200) {
        // setFresh(new Date().getTime())
        let flag = false;
        setShow(l => {
          flag = l;
          return l;
        });
        console.log(flag, showModal);

        handlePostMessage('getTemplateList', '');
        if (flag) {
          handlePostMessage('getTemplatePage', listObj.currentPage);
        }
        // getListData(queryCondition, pagination);
      }
    }
  };

  useEffect(() => {
    handlePostMessage('getTemplateList', '');
    if (showModal) {
      handlePostMessage('getTemplatePage', listObj.currentPage);
    }
    //   响应事件来获取
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <div className={styles.title}>模板库：</div>
      <div className={styles.prbox}>
        <div className={styles.templateList}>
          {!viewList.length && <Empty style={{ margin: 'auto' }} />}
          {viewList.map(item => {
            return renderItem(item);
          })}
        </div>
        {!!viewList.length && (
          <div className={styles.showAll} onClick={() => lookAll()}>
            全部模板
          </div>
        )}
      </div>
      <Modal
        width={1130}
        open={showModal}
        onCancel={() => setShow(false)}
        title='全部模板'
        footer={null}>
        <div className={styles.modalList}>
          {!listObj.list.length && <Empty style={{ margin: 'auto' }} />}
          {listObj.list.map(item => {
            return renderItem(item);
          })}
        </div>
        <Pagination
          className={styles.pageItem}
          showSizeChanger={false}
          pageSize={20}
          onChange={(page, size) => changePage(page)}
          defaultCurrent={1}
          current={listObj.currentPage}
          total={listObj.total}
          showTotal={total => `共${total}条数据`}
        />
      </Modal>
    </>
  );
}
