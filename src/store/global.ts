/**
 * 非业务，应用层级的设置，目前只有一个是否嵌入iframe的属性
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import update from 'immutability-helper';

interface MainState {
  globalDataSource: any;
  globalDataPoolEntity: any;
  globalEntity: any;
}

const initialState: MainState = {
  globalDataSource: [],
  globalDataPoolEntity: [],
  globalEntity: [],
};

export const globalInfoSlice = createSlice({
  name: 'globalInfoState',
  initialState,
  reducers: {
    setGlobalDataSource: (state, action: PayloadAction<any>) => {
      return update(state, {
        globalDataSource: {
          $set: action.payload,
        },
      });
    },
    setGlobalDataPoolEntity: (state, action: PayloadAction<any>) => {
      return update(state, {
        globalDataPoolEntity: {
          $set: action.payload,
        },
      });
    },
    setGlobalEntity: (state, action: PayloadAction<any>) => {
      return update(state, {
        globalEntity: {
          $set: action.payload,
        },
      });
    },
  },
});

export const { setGlobalDataSource, setGlobalDataPoolEntity, setGlobalEntity } =
  globalInfoSlice.actions;

export default globalInfoSlice.reducer;
