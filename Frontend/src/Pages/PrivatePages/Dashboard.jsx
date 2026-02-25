import React from 'react';
import { logoutUser } from '../../redux/Features/authSlice';
import { useDispatch } from 'react-redux';
function Dashboard() {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Overview</h1>
      <button onClick={() => dispatch(logoutUser())}>logout</button>
    </div>
  );
}

export default Dashboard;