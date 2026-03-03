import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Divider, TextField } from '@mui/material';
import { fetchBalance } from '../../../redux/Features/balanceSlice';

function Account() {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.balance);
  const userId = JSON.parse(localStorage.getItem('userInfo'))?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState("");

  useEffect(() => {
    if (userId) dispatch(fetchBalance(userId));
  }, [dispatch, userId]);

  const handleSave = () => {
    // TODO: Dispatch your updateBalance action here
    console.log("Saving new balance:", newBalance);
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      
      {/* 1. Header Section */}
      <Typography variant="h5" fontWeight="bold">
        Wallet Balance
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Manage your starting balance and adjustments here.
      </Typography>
      
      <Divider sx={{ mb: 4 }} />

      {/* 2. The Main Container (Just a flexbox div with a blue border) */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        border: '1px solid', 
        borderColor: 'primary.main', // Automatically uses your theme's blue
        borderRadius: 2, 
        p: 3 
      }}>
        
        {/* Left Side: Balance Text */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1 }}>
            CURRENT BALANCE
          </Typography>
          
          {isEditing ? (
            <TextField 
              size="small" 
              type="number" 
              value={newBalance} 
              onChange={(e) => setNewBalance(e.target.value)} 
              sx={{ mt: 1, display: 'block' }}
            />
          ) : (
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              ${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
            </Typography>
          )}
        </Box>

        {/* Right Side: Buttons */}
        <Box>
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => { setNewBalance(balance); setIsEditing(true); }}
            >
              Adjust Balance
            </Button>
          )}
        </Box>

      </Box>

    </Box>
  );
}

export default Account;