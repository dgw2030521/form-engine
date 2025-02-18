/**
 * 控件区域布局
 */
import './index.less';

import { Collapse } from 'antd';
import { map } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { defaultSettings } from '../../settings';
import { useStore } from '../../utils/hooks';
import Element from './Element';

const Sidebar = props => {
  const { t } = useTranslation();
  const { userProps = {} } = useStore();
  const { settings } = userProps;
  const _settings = Array.isArray(settings) ? settings : defaultSettings;

  const { Panel } = Collapse;

  return (
    <div className='left-layout w5-l w4'>
      {/* <div className='handleLeft'> */}
      {/*  <div className='handleLeftTop'> */}
      {/*    <span>列表</span> */}
      {/*    <span>组件</span> */}
      {/*  </div> */}
      {/*  <div className='handleLeftBottom'> */}
      {/*    <span>查看</span> */}
      {/*  </div> */}
      {/* </div> */}
      <div className='widgetArea'>
        {/* <div className='widgetAreaHeader'> */}
        {/*  <div className='widgetAreaHeaderLeft'>{t('组件库')}</div> */}
        {/*  <div className='widgetAreaHeaderRight'> */}
        {/*    <Button>固定</Button> */}
        {/*    <Button>关闭</Button> */}
        {/*  </div> */}
        {/* </div> */}
        {Array.isArray(_settings) ? (
          <Collapse bordered={false} defaultActiveKey={['0', '1', '2']}>
            {map(_settings, (item, idx) => {
              if (item && item.show === false) {
                return null;
              }
              return (
                <Panel
                  header={<b>{t(item.title, { ns: 'components' })}</b>}
                  key={idx}>
                  <section className='pl0 items-box'>
                    {Array.isArray(item.widgets) ? (
                      item.widgets
                        .filter(item => item.show !== false)
                        .map((widget, idx) => {
                          return (
                            <Element key={`${idx}`} {...props} {...widget} />
                          );
                        })
                    ) : (
                      <div>{t('此处配置有误')}</div>
                    )}
                  </section>
                </Panel>
              );
            })}
          </Collapse>
        ) : (
          <div>{t('此处配置有误')}</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
