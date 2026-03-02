import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  startDate: dayjs().startOf("week").toISOString(),
  endDate: dayjs().endOf("week").toISOString()
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