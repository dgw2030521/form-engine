/**
 * 渲染每个控件，可拖拽
 */
import './Element.less';

import React from 'react';
import { useDrag } from 'react-dnd';
import { useTranslation } from 'react-i18next';

import { addItem } from '../../utils';
import { useGlobal, useStore } from '../../utils/hooks';

// 目前没有用icon，但是可以补上
const WidgetUI = ({ onClick, text, icon }) => {
  const { t } = useTranslation(['components']);
  return (
    <li className='left-item' onClick={onClick}>
      {icon}
      {t(text)}
    </li>
  );
};

const Element = ({ text, name, schema, icon, fixedName }) => {
  const setGlobal = useGlobal();
  const {
    selected,
    flatten,
    errorFields,
    userProps,
    onFlattenChange,
    elementRender,
  } = useStore();

  const { getId } = userProps;
  const [{ isDragging }, dragRef] = useDrag({
    type: 'box',
    item: {
      dragItem: {
        parent: '#',
        schema,
        children: [],
      },
      $id: fixedName ? `#/${name}` : `#/${getId(name)}`,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleElementClick = async () => {
    if (errorFields?.length) return;
    // 如果没有选中，就默认表单
    if (selected && !flatten[selected]) {
      setGlobal({ selected: '#' });
      return;
    }
    const { newId, newFlatten } = addItem({
      selected,
      name,
      schema,
      flatten,
      fixedName,
      getId,
    });

    setGlobal({ selected: newId });
    // @TODO 这里写入是个异步的过程，依赖的地方没办法确定是否更新
    await onFlattenChange(newFlatten);
  };

  const widgetProps = {
    text,
    icon,
    onClick: handleElementClick,
  };

  const originNode = <WidgetUI {...widgetProps} />;

  return (
    <div ref={dragRef}>
      {elementRender
        ? elementRender(schema, widgetProps, originNode)
        : originNode}
    </div>
  );
};

export default Element;
