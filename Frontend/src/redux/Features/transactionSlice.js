import { createAsyncThunk ,createSlice} from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

const fetchExpenseByCategory = createAsyncThunk(
    'transaction/fetchExpenseByCategory',
    async ({userId, startDate, endDate}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/transactions/fetchexpensebycategory/${userId}`, {params:{startDate,endDate}, withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch chart data');
        }
    }
);

const fetchTransactions = createAsyncThunk(
    'transaction/fetchTransactions',
    async ({userId,startDate,endDate}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/transactions/fetchtransactions/${userId}`, {params:{startDate,endDate}, withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

// add transaction
const addTransaction = createAsyncThunk(
    'transaction/addTransaction',
    async (transactionData, { rejectWithValue }) => { 
        try {
            const response = await api.post('/transactions/addtransaction', transactionData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add transaction');
        }
    }
);

// edit transaction
const editTransaction = createAsyncThunk(
    'transaction/editTransaction', 
    async ({ transactionId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/transactions/edittransaction/${transactionId}`, updatedData, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to edit transaction');
        }
    }
);

// delete transaction
const deleteTransaction = createAsyncThunk(
    'transaction/deleteTransaction',
    async (transactionId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/transactions/deletetransaction/${transactionId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
        }   
    }
);

const fetchIncomeExpense = createAsyncThunk(
    'transaction/fetchIncomeExpense',
    async ({userId,startDate,endDate}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/transactions/fetchincomeexpense/${userId}`, {params:{startDate,endDate}, withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch income and expense summary');
        }
    });

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: [],
        status: 'idle',
        error: null,
        income : 0,
        expense: 0,
        expenseChartData: []
    },
    reducers: {  },
    extraReducers: (builder) => {
        builder
        .addCase(fetchTransactions.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchTransactions.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Assuming your backend returns an array of transactions
            state.transactions = action.payload; 
            console.log("Transactions fetched successfully", state.transactions);
        })
        .addCase(fetchTransactions.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(addTransaction.pending, (state) => {
            state.status = 'loading';
        }
        ).addCase(addTransaction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.transactions.push(action.payload.transaction);
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
                state.transactions[index] = { ...action.payload.transaction }
            }

            console.log("Transaction edited successfully check length",state.transactions);
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
        })
        .addCase(deleteTransaction.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(fetchIncomeExpense.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchIncomeExpense.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.income = action.payload.income;
            state.expense = action.payload.expense;
            console.log("Income and Expense fetched successfully", state.transactions);
        })
        .addCase(fetchIncomeExpense.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(fetchExpenseByCategory.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchExpenseByCategory.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.expenseChartData = action.payload;
        })
        .addCase(fetchExpenseByCategory.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

export default transactionSlice.reducer;
export {fetchExpenseByCategory, fetchTransactions,addTransaction, editTransaction, deleteTransaction, fetchIncomeExpense };
