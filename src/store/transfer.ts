import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import update from 'immutability-helper';

interface TransferState {
  transferDepts: any;
}

const initialState: TransferState = {
  transferDepts: [],
};

export const transferSlice = createSlice({
  name: 'transferState',
  initialState,
  reducers: {
    setTransferDepts: (state, action: PayloadAction<boolean>) => {
      return update(state, {
        transferDepts: {
          $set: action.payload,
        },
      });
    },
  },
});

export const { setTransferDepts } = transferSlice.actions;

export default transferSlice.reducer;
