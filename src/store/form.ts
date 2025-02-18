/**
 * 表单主体数据层
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import update from 'immutability-helper';

// import { FieldJoinTO } from '@/CodeDefine/Operation/FieldJoinTO';
// import { MetaFormFieldTO } from '@/CodeDefine/Operation/MetaFormFieldTO';
// import { MetaFormRO } from '@/CodeDefine/Operation/MetaFormRO';

export interface AliasTable {
  ID: string;
  Name: string;
}

export interface EntityRelation {
  // 主表
  Table: string; // 表id
  TableAlias?: string; // 表名
  JoinList: any[];
}

interface FormState {
  formDetail: any;
  FormSchema: any;
  FieldList: any[];
  FormEntityRelation: any;
  aliasTableList: AliasTable[];
}

const initialState: FormState = {
  formDetail: null,
  FormSchema: {
    type: 'object',
    properties: {},
    // labelWidth: 130,
    // displayType: 'row',
    // __displayMode: 'inPage',
    // __ModalSize: 520,
    // column: 1,
    // colon: true,
    // disabled: false,
  },
  FieldList: [],
  // 初始是空，加载detail之后赋值，实时操作赋值
  FormEntityRelation: {
    Table: undefined,
    JoinList: [],
  },
  // 别名表构建
  aliasTableList: [],
};

export const formSlice = createSlice({
  name: 'formState',
  initialState,
  reducers: {
    setFormSchemaAction: (state, action: PayloadAction<Partial<FormState>>) => {
      return update(state, {
        FormSchema: {
          $set: action.payload.FormSchema,
        },
      });
    },
    setFormDetailAction: (state, action: PayloadAction<Partial<FormState>>) => {
      return update(state, {
        formDetail: {
          $set: action.payload.formDetail,
        },
      });
    },
    setFieldListAction: (state, action: PayloadAction<Partial<FormState>>) => {
      return update(state, {
        FieldList: {
          $set: action.payload.FieldList,
        },
      });
    },
    clearFormAction: state => {
      return update(state, {
        FormSchema: {
          $set: initialState.FormSchema,
        },
      });
    },

    setFormEntityRelation: (
      state,
      // 只需用到Table和JoinList
      action: PayloadAction<EntityRelation>,
    ) => {
      return update(state, {
        FormEntityRelation: {
          Table: {
            $set: action.payload?.Table,
          },
          TableAlias: {
            $set: action.payload?.TableAlias,
          },
          JoinList: {
            $set: action.payload?.JoinList,
          },
        },
      });
    },

    setAliasTableList: (state, action: PayloadAction<AliasTable[]>) => {
      return update(state, {
        aliasTableList: {
          $set: action.payload,
        },
      });
    },
    addAliasTableList: (state, action: PayloadAction<AliasTable>) => {
      return update(state, {
        aliasTableList: {
          $push: [action.payload],
        },
      });
    },
    delAliasTable: (state, action: PayloadAction<number>) => {
      return update(state, {
        aliasTableList: {
          $splice: [[action.payload, 1]],
        },
      });
    },
    updateAliasTable: (
      state,
      action: PayloadAction<{
        index: number;
        content: AliasTable;
      }>,
    ) => {
      return update(state, {
        aliasTableList: {
          [action.payload.index]: {
            $set: action.payload.content,
          },
        },
      });
    },
  },
});

export const {
  setFormSchemaAction,
  setFieldListAction,
  setFormDetailAction,
  clearFormAction,
  setFormEntityRelation,
  addAliasTableList,
  delAliasTable,
  updateAliasTable,
  setAliasTableList,
} = formSlice.actions;

export default formSlice.reducer;
