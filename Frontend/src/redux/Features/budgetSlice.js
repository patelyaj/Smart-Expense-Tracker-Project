import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const createBudget = createAsyncThunk(
  "budget/createBudget",
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/budget/create",
        budgetData,
        { withCredentials: true }
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create budget"
      );
    }
  }
);

export const fetchBudgets = createAsyncThunk(
  "budget/fetchBudgets",
  async (userId, { rejectWithValue }) => {
    try {

      const response = await api.get(
        `/budget/${userId}`,
        { withCredentials: true }
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch budgets"
      );
    }
  }
);  
export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async (budgetId, { rejectWithValue }) => {
    try {

      const response = await api.delete(
        `/budget/${budgetId}`,
        { withCredentials: true }
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete budget"
      );
    }
  }

);
export const updateBudget = createAsyncThunk(
  "budget/updateBudget",
  async ({ budgetId, updatedData }, { rejectWithValue }) => {
    try {

      const response = await api.patch(
        `/budget/${budgetId}`,
        updatedData,
        { withCredentials: true }
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update budget"
      );
    }
  }
);
export const fetchBudgetProgress = createAsyncThunk(
  "budget/fetchBudgetProgress",
  async (userId, { rejectWithValue }) => {

    try {

      const response = await api.get(
        `/budget/progress/${userId}`,
        { withCredentials: true }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch budget progress"
      );

    }

  }
);

export const fetchBudgetDetails = createAsyncThunk(
  "budget/fetchBudgetDetails",
  async (budgetId) => {

    const res = await api.get(`/budget/details/${budgetId}`);

    return res.data;

  }
);

const budgetSlice = createSlice({

  name: "budget",

  initialState: {
    budgets: [],
    progressBudgets: [],
    budgetDetails: null,
    status: "idle",
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.budgets = action.payload;
      })

      .addCase(fetchBudgetProgress.fulfilled, (state, action) => {
        state.progressBudgets = action.payload;
      })

      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload.budget);
      })

      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(
          (b) => b._id !== action.payload.budgetId
        );
      })

      .addCase(updateBudget.fulfilled, (state, action) => {

        const index = state.budgets.findIndex(
          (b) => b._id === action.payload._id
        );

        if (index !== -1) {
          state.budgets[index] = action.payload;
        }

      })
      .addCase(fetchBudgetDetails.pending, (state) => {

        state.status = "loading";
        state.error = null;

        })

        .addCase(fetchBudgetDetails.fulfilled, (state, action) => {

        state.status = "succeeded";
        state.budgetDetails = action.payload;

        })

        .addCase(fetchBudgetDetails.rejected, (state, action) => {

        state.status = "failed";
        state.error = action.payload || "Failed to fetch budget details";

        });


  }

});
export default budgetSlice.reducer;
