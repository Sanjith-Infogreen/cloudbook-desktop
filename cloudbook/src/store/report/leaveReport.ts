import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LeaveReport {
  id: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
}

interface LeaveReportState {
  leaveReport: LeaveReport[];
}

const initialState: LeaveReportState = {
  leaveReport: [],
};

const leaveReportSlice = createSlice({
  name: "leaveReport",
  initialState,
  reducers: {
    setLeaveReports(state, action: PayloadAction<LeaveReport[]>) {
      state.leaveReport = action.payload;
    },
  },
});

export const { setLeaveReports } = leaveReportSlice.actions;

export default leaveReportSlice.reducer;
