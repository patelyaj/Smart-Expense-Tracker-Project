import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/authSlice.js';
import balanceReducer from './Features/balanceSlice.js';
import transactionReducer from './Features/transactionSlice.js';
import dateReducer from './Features/dateSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    balance : balanceReducer,
    transaction : transactionReducer,
    date : dateReducer
  },
});

export default store;