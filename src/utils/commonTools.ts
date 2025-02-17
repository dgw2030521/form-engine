import { PaginationProps } from 'antd';
import { each } from 'lodash';
import { EntityRelation } from '@/store/form';

const handlePostMessage = (type: string, data: any) => {
  const transforData = {
    type,
    body: data,
  };
  window.parent.postMessage(transforData, '*');
};

const showTotal: PaginationProps['showTotal'] = total => {
  return `总共 ${total} 条记录`;
};

// 是否使用url记录查询参数，方便回显结果
const USE_URL_SEARCH = false;

/**
 * 构建别名表
 * @param detail
 * @param useSubFix
 */
const convertJoinList2AliasList = (
  detail: EntityRelation,
  useSubFix?: boolean,
) => {
  const mainTableId = detail.Table;
  const mainTableName = detail.TableAlias;
  const joinList = detail.JoinList;
  const result = [
    {
      ID: useSubFix ? `${mainTableId}|-1` : mainTableId,
      Name: mainTableName,
    },
  ];
  each(joinList, (item, idx) => {
    result.push({
      ID: useSubFix ? `${item.LeftTable}|${idx}` : item.LeftTable,
      Name: item.LeftTableAlias,
    });
  });
  return result;
};

/**
 * 随机生成字符串
 * @param len 指定生成字符串长度
 */
function getRandomString(len = 7) {
  const _charStr =
    'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
  const min = 0;
  const max = _charStr.length - 1;
  let _str = ''; // 定义随机字符串 变量
  // 判断是否指定长度，否则默认长度为15
  // 循环生成字符串
  for (let i = 0, index; i < len; i += 1) {
    index = ((randomIndexFunc, i) => {
      return randomIndexFunc(min, max, i, randomIndexFunc);
    })((min, max, i, _self) => {
      let indexTemp = Math.floor(Math.random() * (max - min + 1) + min);
      const numStart = _charStr.length - 10;
      if (i === 0 && indexTemp >= numStart) {
        indexTemp = _self(min, max, i, _self);
      }
      return indexTemp;
    }, i);
    _str += _charStr[index];
  }
  return _str;
}

export {
  showTotal,
  USE_URL_SEARCH,
  handlePostMessage,
  convertJoinList2AliasList,
  getRandomString,
};
