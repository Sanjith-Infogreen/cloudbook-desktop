import { configureStore } from '@reduxjs/toolkit';
import typeheadReducer from './typeHead/typehead';
import sideMenuReducer from './sideMenu/sideMenu'
export const store = configureStore({
  reducer: {
    typeHead:typeheadReducer,
    sideMenu:sideMenuReducer

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
