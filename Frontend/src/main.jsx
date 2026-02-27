import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store.js'
import { Provider } from 'react-redux'
import theme from './theme.js'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";



createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          theme="colored"
        />
      </LocalizationProvider>
    </ThemeProvider>
  </Provider>
  // </StrictMode>,
)
