import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MonthlyReport {
  id: number;
  month: string;
  totalLeaves: number;
  approvedLeaves: number;
  pendingLeaves: number;
  rejectedLeaves: number;
}

interface MonthlyReportState {
  monthlyreport: MonthlyReport[];
}

const initialState: MonthlyReportState = {
  monthlyreport: [],
};

const monthlyReportSlice = createSlice({
  name: "monthlyreport",
  initialState,
  reducers: {
    setMonthlyReports(state, action: PayloadAction<MonthlyReport[]>) {
      state.monthlyreport = action.payload;
    },
  },
});

export const { setMonthlyReports } = monthlyReportSlice.actions;

export default monthlyReportSlice.reducer;
