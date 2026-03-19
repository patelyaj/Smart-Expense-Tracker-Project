import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const fetchBudget = createAsyncThunk(
  "budget/fetchBudgetProgress",
  async (_, { rejectWithValue }) => {
    try {
      // Assuming your router is mounted at "/budget" in your main index/server file.
      // Since your route is router.get('/', ...), the endpoint is just "/budget"
      const response = await api.get("/budget", { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch budget progress"
      );
    }
  }
);

export const createBudget = createAsyncThunk(
  "budget/createBudget",
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/budget",
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

export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async (budgetId, { rejectWithValue }) => {
    try {

      const response = await api.delete(
        `/budget/${budgetId}`,
        { withCredentials: true }
      );

      return { budgetId, data: response.data };

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete budget"
      );
    }
  }
);

export const fetchBudgetDetails = createAsyncThunk(
  "budget/fetchBudgetDetails",
  async (budgetId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/budget/${budgetId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch budget details"
      );
    }
  }
);

const budgetSlice = createSlice({

  name: "budget",

  initialState: {
    budgets: [],
    progressBudgets: [],
    budgetDetails: null,
    status: "idle",
    error: null,
    isBudgetStale: true
  },

  reducers: {
    markBudgetStale: (state) => { state.isBudgetStale = true; }
  },

  extraReducers: (builder) => {
    builder
      
      // --- FETCH BUDGET DETAILS ---
      .addCase(fetchBudgetDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBudgetDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.budgetDetails = action.payload;
        // isBudgetStale is for the list/progress, but good to keep clean
      })
      .addCase(fetchBudgetDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch budget details";
      })

      // --- CREATE BUDGET ---
      .addCase(createBudget.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBudget.fulfilled, (state) => {
        state.status = "succeeded";
        // state.budgets.push(action.payload.budget);
        state.isBudgetStale = true;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- DELETE BUDGET ---
      .addCase(deleteBudget.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        // 1. Remove from the basic budgets array
        state.budgets = state.budgets.filter(
          (b) => b._id !== action.payload.budgetId
        );
        
        // 2. THIS WAS MISSING: Remove from the progressBudgets array (what the UI actually shows)
        state.progressBudgets = state.progressBudgets.filter(
          (b) => b._id !== action.payload.budgetId
        );
        
        // 3. Flag it as stale so the next time you load the page it gets a fresh copy
        // state.isBudgetStale = true;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- CROSS-SLICE LISTENING ---
// We listen directly to the successful transaction events to flag the budget as stale!
      .addCase("transaction/addTransaction/fulfilled", (state) => { 
        state.isBudgetStale = true; 
      })
      .addCase("transaction/editTransaction/fulfilled", (state) => { 
        state.isBudgetStale = true; 
      })
      .addCase("transaction/deleteTransaction/fulfilled", (state) => { 
        state.isBudgetStale = true; 
      })
      
      .addCase(fetchBudget.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.progressBudgets = action.payload; // Store the array here
        state.isBudgetStale = false; // Reset the stale flag!
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { markBudgetStale } = budgetSlice.actions;
export default budgetSlice.reducer;