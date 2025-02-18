/**
 * 渲染每个控件的可配置项
 */
import FormRender, { useForm } from 'form-render';
import { isEmpty, isNil } from 'lodash';
import React, { useEffect, useState } from 'react';

import {
  advancedElements,
  baseCommonSettings,
  defaultCommonSettings,
  defaultSettings,
  elements,
  layouts,
} from '../../settings';
import { isObject, mergeInOrder } from '../../utils';
import { useGlobal, useStore } from '../../utils/hooks';
import { getWidgetName } from '../../utils/mapping';
import * as frgWidgets from '../../widgets';

export default function ItemSettings({ widgets }) {
  const setGlobal = useGlobal();
  const form = useForm();
  const {
    selected,
    flatten,
    onItemChange,
    onItemErrorChange,
    userProps = {},
    widgets: globalWidgets,
    mapping: globalMapping,
  } = useStore();

  const { settings, commonSettings, hideId, validation, transformer } =
    userProps;

  const [settingSchema, setSettingSchema] = useState({});

  const _widgets = {
    ...globalWidgets,
    ...frgWidgets,
  };

  const getWidgetList = (settings, commonSettings) => {
    return settings.reduce((widgetList, setting) => {
      if (!Array.isArray(setting.widgets)) return widgetList;
      const basicWidgets = setting.widgets.map(item => {
        const baseItemSettings = {};
        // 如果是列表布局
        if (item.schema.type === 'array' && item.schema.items) {
          baseItemSettings.items = {
            type: 'object',
            hidden: '{{true}}',
          };
        }

        let mergeSettings = {};
        // 定义组件的时候定义useCommon，代表是否使用通用的设置能力
        if (!item.useCommon && !isNil(item.useCommon)) {
          mergeSettings = mergeInOrder(
            baseCommonSettings,
            baseItemSettings,
            item.setting,
          );
        } else {
          mergeSettings = mergeInOrder(
            baseCommonSettings,
            commonSettings,
            baseItemSettings,
            item.setting,
          );
        }
        return {
          ...item,
          widget:
            item.widget ||
            item.schema.widget ||
            getWidgetName(item.schema, globalMapping),
          setting: mergeSettings,
        };
      });
      return [...widgetList, ...basicWidgets];
    }, []);
  };

  // 设置区域值发生变化的时候，需要影响画板的schema
  const onSettingFormDataChange = settingFormValue => {
    // console.log('---拿到的settingSchema---', settingFormValue);
    // console.log('----转换后---', transformer.fromSetting(settingFormValue));
    try {
      const item = flatten[selected];
      if (!item || selected === '#') return;
      if (item && item.schema) {
        onItemChange(
          selected,
          {
            ...item,
            // 首次添加的时候，设置无值，原先的画板schema就被清空了
            schema: transformer.fromSetting(settingFormValue),
          },
          'schema',
        );
      }
    } catch (error) {
      console.error(error, 'catch');
    }
  };

  useEffect(() => {
    // setting 该显示什么的计算，要把选中组件的 schema 和它对应的 widgets 的整体 schema 进行拼接
    try {
      const item = flatten[selected];
      if (!item || selected === '#') return;
      const widgetName = getWidgetName(item.schema, globalMapping);

      // 算 widgetList
      const _settings = Array.isArray(settings)
        ? [
            ...settings,
            { widgets: [...elements, ...advancedElements, ...layouts] },
          ] // TODO: 不是最优解
        : defaultSettings;

      const _commonSettings = isObject(commonSettings)
        ? commonSettings
        : defaultCommonSettings;
      // @todo 配置项会有差异
      // 比如纯布局,自己设置即可，比如不需要产出value的，也是自己的setting就可以

      const widgetList = getWidgetList(_settings, _commonSettings);

      const element = widgetList.find(e => e.widget === widgetName) || {}; // 有可能会没有找到

      const properties = { ...element.setting };

      if (hideId) delete properties.$id;

      // selected变化，首次设置值,再次变化是通过watch来监听
      setTimeout(() => {
        // @todo 设置setting schema；设置表单form,在此之前，form为空，formValue也无值
        setSettingSchema({
          type: 'object',
          displayType: 'column',
          properties,
        });
        // 往schema上增加数据，enumList
        const value = transformer.toSetting(item.schema);
        form.setValues(value);
        onSettingFormDataChange(value);
      }, 0);
    } catch (error) {
      console.error(error);
    }
  }, [selected]);

  useEffect(() => {
    validation && onItemErrorChange(form?.errorFields);
  }, [validation, form?.errorFields]);

  useEffect(() => {
    // 设置对应的设置表单
    setGlobal({ settingsForm: form });
  }, []);

  const watch = {
    // # 为全局
    '#': v => {
      // 此处监听了包括初始化时候的值的变化
      // @NOTICE 表单有schema，但值为{}，说明是初始化变化，这个首次已经解决，需要在监听的时候忽略
      if (isEmpty(v) && !isEmpty(settingSchema)) return;
      setTimeout(() => onSettingFormDataChange(v), 0);
    },
  };

  const onMount = () => {
    // form.setValues({ input1: 'hello world' });
    //
    // delay(3000).then(_ => {
    //   form.setSchemaByPath('select1', {
    //     description: '',
    //     enum: ['a', 'b', 'c'],
    //     enumNames: ['早', '中', '晚'],
    //   });
    // });
  };

  if (isEmpty(settingSchema)) {
    return null;
  }

  return (
    <div style={{ paddingRight: 24 }}>
      <FormRender
        labelWidth='120'
        form={form}
        schema={settingSchema}
        widgets={{ ..._widgets, ...widgets }}
        mapping={globalMapping}
        watch={watch}
        onMount={onMount}
      />
    </div>
  );
}
