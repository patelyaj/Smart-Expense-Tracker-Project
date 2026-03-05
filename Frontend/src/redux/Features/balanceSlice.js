import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const fetchBalance = createAsyncThunk(
    'balance/fetchBalance',
    async (userId, {rejectWithValue}) => {
        try {
            const respoonse = await api.get(`/balance/fetchbalance/${userId}`,{withCredentials:true});
            return respoonse.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });     

const initialState = {
    balance: 0,
    status: 'idle',
    error: null
};

const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBalance.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.balance = action.payload.totalBalance;
            })
            .addCase(fetchBalance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch balance';
            });
    }
});

export default balanceSlice.reducer;