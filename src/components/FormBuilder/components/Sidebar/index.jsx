/**
 * 控件区域布局
 */
import React from 'react';
import { Collapse } from 'antd';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { defaultSettings } from '../../settings';
import { useStore } from '../../utils/hooks';
import Element from './Element';
import './index.less';

const Sidebar = props => {
  const { t } = useTranslation();
  const { userProps = {} } = useStore();
  const { settings } = userProps;
  const _settings = Array.isArray(settings) ? settings : defaultSettings;

  const { Panel } = Collapse;

  return (
    <div className="left-layout w5-l w4">
      {Array.isArray(_settings) ? (
        <Collapse bordered={false} defaultActiveKey={['0','1','2']}>
          {map(_settings, (item, idx) => {
            if (item && item.show === false) {
              return null;
            }
            return (
              <Panel
                header={<b>{t(item.title, { ns: 'components' })}</b>}
                key={idx}
              >
                <section className="pl0 items-box">
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
  );
};

export default Sidebar;
