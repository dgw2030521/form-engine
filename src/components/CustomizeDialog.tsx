import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, ModalProps } from 'antd';

/**
 * persist属性：持久化表示弹窗是使用原有div承载的，弹窗关闭后div不会消失；
 * 非持久化，每次弹窗都是新成一个div
 * @param props
 * @constructor
 */
export default function CustomizeDialog(
  props: ModalProps & { persist?: boolean },
) {
  const { children } = props;
  const doc = window.document;
  // 弹窗关闭后，div还在
  const modalNode = doc.getElementById('modalBox');
  // 每次弹窗都是新生产的div
  const node = doc.createElement('div');

  useEffect(() => {
    return () => {
      // doc.removeChild(node);
    };
  }, []);

  return createPortal(
    <Modal {...props} maskClosable={false}>
      {children}
    </Modal>,
    props.persist ? modalNode : node,
  );
}
