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


function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute/>} >
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} /> 
        </Route>
        <Route element={<PrivateRoute/>} >
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path='/transaction' element={<Transaction/>} />
          <Route path='/budget' element={<Budget/>} />
          <Route path='/profile/:id' element={<Profile/>} />
          {/* <Route path='/account' element={<Account/>} /> */}
          {/* <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route path="/register" element={<h1>Register Page</h1>} />  */}
        </Route>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;