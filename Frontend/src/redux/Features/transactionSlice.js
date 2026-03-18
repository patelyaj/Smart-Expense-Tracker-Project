import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

const fetchTransactions = createAsyncThunk(
    'transaction/fetchTransactions',
    async ({startDate, endDate, page = 1, limit = 10, search = "", category = "all"}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/transactions`, {
                params: { startDate, endDate, page, limit, search, category }, 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

const addTransaction = createAsyncThunk(
    'transaction/addTransaction',
    async (transactionData, { rejectWithValue }) => { 
        try {
            const response = await api.post('/transactions', transactionData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add transaction');
        }
    }
);

const editTransaction = createAsyncThunk(
    'transaction/editTransaction', 
    async ({ transactionId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/transactions/${transactionId}`, updatedData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to edit transaction');
        }
    }
);

const deleteTransaction = createAsyncThunk(
    'transaction/deleteTransaction',
    async (transactionId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/transactions/${transactionId}`, { withCredentials: true });
            return response.data;
        } 
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
        }   
    }
);

const fetchDashboardSummary = createAsyncThunk(
    'transaction/fetchDashboardSummary',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard', { 
                params: { startDate, endDate }, 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard summary');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: [],
        status: 'idle',
        error: null,
        income : 0,
        expense: 0,
        netBalance : 0,
        expenseChartData: [],
        totalPages: 1, 
        currentPage: 1,
        isTransactionsStale: true,
        isDashboardStale: true,
    },
    reducers: {  
        markTransactionsStale: (state) => { state.isTransactionsStale = true; },
        markDashboardStale: (state) => { state.isDashboardStale = true; }   
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchTransactions.pending, (state) => {
            state.status = 'loading';
        }) 
        .addCase(fetchTransactions.fulfilled, (state, action) => {
            state.status = 'succeeded';
            
            const newTxns = action.payload.transactions || [];
            // Check which page was requested in the thunk arguments
            const requestedPage = action.meta.arg.page || 1;

            if (requestedPage === 1) {
                // If page 1 (initial load, search, or filter change), replace the data
                state.transactions = newTxns;
            } else {
                // If page > 1 (infinite scroll), append the new data
                state.transactions = [...state.transactions, ...newTxns];
            }

            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
            state.isTransactionsStale = false;
        })
        .addCase(fetchTransactions.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(addTransaction.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(addTransaction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            
            // Push instead of unshift, then apply strict sorting
            state.transactions.push(action.payload.transaction);
            state.transactions.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                if (dateB !== dateA) return dateB - dateA; // Sort Date Descending
                return b._id.localeCompare(a._id); // Sort by Newest Added Internally
            });
            
            state.isDashboardStale = true;
        })
        .addCase(addTransaction.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(editTransaction.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(editTransaction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const index = state.transactions.findIndex(t => t._id === action.payload.transaction._id);
            if (index !== -1) {
                state.transactions[index] = { ...action.payload.transaction };
                
                // Re-sort in case the date was changed during edit
                state.transactions.sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    if (dateB !== dateA) return dateB - dateA;
                    return b._id.localeCompare(a._id); 
                });
            }
            // state.isTransactionsStale = true; 
            state.isDashboardStale = true;
        })
        .addCase(editTransaction.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(deleteTransaction.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteTransaction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.transactions = state.transactions.filter(t => t._id !== action.payload.transactionId);
            // state.isTransactionsStale = true; 
            state.isDashboardStale = true;
        })
        .addCase(deleteTransaction.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(fetchDashboardSummary.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.income = action.payload.income;
            state.expense = action.payload.expense;
            state.netBalance = action.payload.netBalance;
            state.expenseChartData = action.payload.expenseByCategory;
            state.isDashboardStale = false;
        })
        .addCase(fetchDashboardSummary.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
    }
});

export const { markTransactionsStale, markDashboardStale } = transactionSlice.actions;
export { fetchTransactions, addTransaction, editTransaction, deleteTransaction, fetchDashboardSummary };
export default transactionSlice.reducer;