/**
 * 非业务，应用层级的设置，目前只有一个是否嵌入iframe的属性
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import update from 'immutability-helper';

interface MainState {
  isInner: boolean;
  currentMenu: any;
  isInIframe: boolean;
}

const initialState: MainState = {
  isInner: false,
  currentMenu: null,
  isInIframe: true,
};

export const mainSlice = createSlice({
  name: 'mainState',
  initialState,
  reducers: {
    setIsInner: (state, action: PayloadAction<boolean>) => {
      return update(state, {
        isInner: {
          $set: action.payload,
        },
      });
    },
    setIsInIframe: (state, action: PayloadAction<boolean>) => {
      return update(state, {
        isInIframe: {
          $set: action.payload,
        },
      });
    },

    setCurrentMenu: (state, action: PayloadAction<any>) => {
      return update(state, {
        currentMenu: {
          $set: action.payload,
        },
      });
    },
  },
});

export const { setIsInner, setCurrentMenu, setIsInIframe } = mainSlice.actions;

export default mainSlice.reducer;
