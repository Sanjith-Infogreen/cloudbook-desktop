import { configureStore } from '@reduxjs/toolkit';
import typeheadReducer from './typeHead/typehead';
import sideMenuReducer from './sideMenu/sideMenu'
import leaveReportReucer from './report/leaveReport'
import monthlyReportReucer from './report/monthlyReport'
import ContactReducer from './contact/contact'
export const store = configureStore({
  reducer: {
    typeHead:typeheadReducer,
    sideMenu:sideMenuReducer,
    leaveReport:leaveReportReucer,
    monthlyreport:monthlyReportReucer,
    contact:ContactReducer,




  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
