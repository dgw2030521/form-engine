/**
 * @description:
 * @author: dongguowei
 * @created: 2025/02/06
 */

import { Button } from 'antd';
import React, { useRef, useState } from 'react';

import Generator from '@/components/FormBuilder';
import useFormDesign from '@/hooks/useFormDesign';
import { getRandomString } from '@/utils/commonTools';
import Buttons from '@/views/design/bizWidgets/buttons';
import IOInvokerUpload from '@/views/design/bizWidgets/IOInvokerUpload';
import Link from '@/views/design/bizWidgets/link';
import Upload from '@/views/design/bizWidgets/upload';
import widgetCommonSettings from '@/views/design/settings/widgetCommonSettings';
import { widgetGlobalSettings } from '@/views/design/settings/widgetGlobalSettings';
import widgetsConfig from '@/views/design/settings/widgetsConfig';
import UploadFileToLink from '@/views/design/settingWidgets/uploadFiles';

import styles from './index.module.scss';

const defaultValue = {
  type: 'object',
  properties: {
    inputName: {
      title: '输入框',
      type: 'string',
    },
  },
};

export default function Design() {
  const genRef = useRef<any>();
  const [preview, setPreview] = useState(false);
  const [selectOptions, setSelectOptions] = useState<any>({});
  const [selectUnit, setSelectUnit] = useState<any>({});
  const [fileLink, setFileLink] = useState<any>({});

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

  return (
    <div className={styles.container}>
      <div className={styles.mainHeader}>
        <Button>编辑</Button>
        <Button>预览</Button>
      </div>
      <Generator
        getId={name => {
          return `${name.split('_')[0]}_${getRandomString(6)}`;
        }}
        ref={genRef}
        hideInnerOperateButtons
        defaultValue={defaultValue}
        preview={preview}
        /** 画板自定义组件 */
        widgets={{ Buttons, Upload, Link, IOInvokerUpload }}
        /** 左侧组件 */
        settings={[...widgetsConfig]}
        /** 设置 */
        commonSettings={widgetCommonSettings}
        /** 全局设置 */
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
        settingsWidgets={{
          // MataDataRelation,
          // PreDataSetting,
          // RelatedLinkCodeSetting,
          // BackDataSetting,
          // RelationBtn: () => (
          //   <RelationBtn
          //     value={selectOptions}
          //     onChange={(name: any, val: any) => {
          //       const newSchema = updateFormSchema(name, val, 'select');
          //       const newList = updateFieldList(name, val, 'select');
          //       setFieldList(newList);
          //       console.log('添加关联newSchema', newSchema);
          //       // console.log(name, '选中的关联项', val);
          //       setSelectOptions(preValues => ({
          //         ...preValues,
          //         componentName: name,
          //         selectedOptions: val,
          //       }));
          //       setFormSchema(newSchema);
          //     }}
          //   />
          // ),
          // FormSelector,
          // ListDatasource,
          // SelectUnit: () => {
          //   return (
          //     <SelectUnit
          //       value={selectUnit}
          //       onChange={(name: any, val: any) => {
          //         const newSchema = updateFormSchema(name, val, 'number');
          //         setSelectUnit({
          //           componentName: name,
          //           UnitID: val.ID,
          //         });
          //         const newList = updateFieldList(name, val, 'number');
          //         setFieldList(newList);
          //         setFormSchema(newSchema);
          //       }}
          //     />
          //   );
          // },
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
  );
}
