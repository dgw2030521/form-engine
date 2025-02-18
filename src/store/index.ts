/**
 * 数据层使用两种
 * 一、hooks+redux
 * effect都在hooks中，reducer都在store，redux中
 * 二、constate
 */
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import formReducer from './form';
import globalReducer from './global';
import mainReducer from './main';
import transferReducer from './transfer';

const store = configureStore({
  reducer: {
    formState: formReducer,
    mainState: mainReducer,
    transferState: transferReducer,
    globalInfoState: globalReducer,
  },
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
