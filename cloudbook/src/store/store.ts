import { configureStore } from '@reduxjs/toolkit';
import typeheadReducer from './typeHead/typehead';
import sideMenuReducer from './sideMenu/sideMenu'
import leaveReportReucer from './report/leaveReport'
import monthlyReportReucer from './report/monthlyReport'
export const store = configureStore({
  reducer: {
    typeHead:typeheadReducer,
    sideMenu:sideMenuReducer,
    leaveReport:leaveReportReucer,
    monthlyreport:monthlyReportReucer



  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
