import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/authSlice.js';
import balanceReducer from './Features/balanceSlice.js';
import transactionReducer from './Features/transactionSlice.js';
import dateReducer from './Features/dateSlice.js';
import categoryReducer from './Features/categorySlice.js';
const store = configureStore({
  reducer: {
    auth: authReducer,
    balance : balanceReducer,
    transaction : transactionReducer,
    date : dateReducer,
    category : categoryReducer
  },
});

export default store;