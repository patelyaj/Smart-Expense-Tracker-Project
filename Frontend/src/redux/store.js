import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/authSlice.js';
import balanceReducer from './Features/balanceSlice.js';
import transactionReducer from './Features/transactionSlice.js';
const store = configureStore({
  reducer: {
    auth: authReducer,
    balance : balanceReducer,
    transaction : transactionReducer
  },
});

export default store;