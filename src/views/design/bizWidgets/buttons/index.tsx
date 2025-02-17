/**
 * 按钮渲染和按钮事件
 */
import React from 'react';
import { Button, message, Space } from 'antd';
import { isEmpty, map } from 'lodash';
import styles from './button.module.scss';

const NewButton = props => {
  const { schema } = props;
  const isInFRPreview = !isEmpty(props.addons);

  const layoutStyle = {
    justifyContent: schema?.align,
  };

  return (
    <div className={styles.layout} style={layoutStyle}>
      <Space size={schema?.margin}>
        {map(schema?.buttons, (item, idx) => {
          const mergeProps: any = {};
          if (item.action === 'submit') {
            mergeProps.htmlType = 'submit';
            mergeProps.onClick = () => {
              if (isInFRPreview) {
                // 先校验
                props.addons.validateFields().then(values => {
                  console.log('@@@values', values);
                });
              } else {
                message.info('编辑状态无法触发按钮交互行为!');
              }
            };
          } else if (item.action === 'script') {
            mergeProps.onClick = () => {
              if (isInFRPreview) {
                const actionStr = item?.script;
                if (actionStr) {
                  //  @todo 设置常用的上下文, props.addons几乎就是form
                  return new Function('form', `return ${actionStr}`)(
                    // 包含form属性
                    props.addons,
                  );
                }
              } else {
                message.info('编辑状态无法触发按钮交互行为!');
              }
            };
          }
          return (
            <Button
              {...mergeProps}
              key={idx}
              type={item?.btnType}
              danger={item?.isDanger}
            >
              {item.btnTitle || '按钮标题'}
            </Button>
          );
        })}
      </Space>
    </div>
  );
};

export default NewButton;
