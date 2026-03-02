import { StrictMode } from 'react'
import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store.js'
import { Provider } from 'react-redux'
// ThemeProvider and CssBaseline removed from here

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* App will now handle the Theme logic */}
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          theme="colored"
        />
      </LocalizationProvider>
    </Provider>
  </StrictMode>,
)