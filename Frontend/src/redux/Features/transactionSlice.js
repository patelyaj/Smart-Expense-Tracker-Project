import { createAsyncThunk ,createSlice} from "@reduxjs/toolkit";
import axios from "axios";

// add transaction
const addTransaction = createAsyncThunk(
    'transaction/addTransaction',
    async (transactionData, { rejectWithValue }) => { 
        try {
            const response = await axios.post('http://localhost:5000/expensetracker/transactions/addtransaction', transactionData, { withCredentials: true });
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
            const response = await axios.patch(`http://localhost:5000/expensetracker/transactions/edittransaction/${transactionId}`, updatedData, { withCredentials: true });
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
            const response = await axios.delete(`http://localhost:5000/expensetracker/transactions/deletetransaction/${transactionId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
        }   
    }
);

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: [],
        status: 'idle',
        error: null
    },
    reducer: {  },
    extraReducers: (builder) => {
        builder.addCase(addTransaction.pending, (state) => {
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
                state.transactions[index] = action.payload.transaction;
            }
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
        });
    }
});

export default transactionSlice.reducer;
export { addTransaction, editTransaction, deleteTransaction };
