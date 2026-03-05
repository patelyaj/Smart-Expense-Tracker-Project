import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  startDate: dayjs().startOf("month").toISOString(),
  endDate: dayjs().endOf("month").toISOString()
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    }
  }
});

export const { setDateRange } = dateSlice.actions;
export default dateSlice.reducer;