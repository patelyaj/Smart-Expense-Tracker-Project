import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import PublicRoute from './Pages/routes/PublicRoute'
import PrivateRoute from './Pages/routes/PrivateRoute'
import Home from './Pages/PublicPages/Home'
import Login from './Pages/PublicPages/Login'
import Signup from './Pages/PublicPages/Signup'
import Dashboard from './Pages/PrivatePages/Dashboard/Dashboard'
import Transaction from './Pages/PrivatePages/Transaction/Transaction'
import Budget from './Pages/PrivatePages/Budget/Budget'
import Profile from './Pages/PrivatePages/Profile/Profile'

// --- NEW IMPORTS FOR THEME ---
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from './theme'; // Import your newly created themes

import Categories from "./Component/Categories";
import BudgetDetails from "./Pages/PrivatePages/Budget/BudgetDetails";

function App() {
  // 1. Grab the current mode from Redux
  // (Assuming you added themeMode to your authSlice as discussed previously)
  const themeMode = useSelector((state) => state.auth.themeMode);
  
  // 2. Decide which theme object to use
  const currentTheme = themeMode === "dark" ? darkTheme : lightTheme;

  return (
    // 3. Wrap everything in the ThemeProvider using the dynamic theme
    <ThemeProvider theme={currentTheme}>
      {/* CssBaseline applies the global background colors instantly */}
      <CssBaseline /> 
      
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute/>} >
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} /> 
          </Route>
          <Route element={<PrivateRoute/>} >
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path='/transactions' element={<Transaction/>} />
            <Route path='/profile/:id' element={<Profile/>} />
            <Route path='/categories' element={<Categories/>}/>
            
            <Route path='/budget' element={<Budget/>} />
            <Route path="/budget/:budgetId" element={<BudgetDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 