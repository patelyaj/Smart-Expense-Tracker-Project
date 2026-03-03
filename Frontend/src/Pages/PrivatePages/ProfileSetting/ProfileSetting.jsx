import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Switch, Avatar, Divider } from '@mui/material';
import { toggleTheme } from '../../../redux/Features/authSlice';

function ProfileSetting() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.auth.themeMode);
  
  // Pull user data from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

  return (
    <Box sx={{ p: 2 }}>
      
      {/* 1. Header */}
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Profile Settings
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Manage your personal information and preferences.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* 2. Simple Form Container */}
      <Box sx={{ maxWidth: 400 }}>

        {/* Avatar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
            {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {userInfo.username || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personal Account
            </Typography>
          </Box>
        </Box>

        {/* Name Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary" mb={1}>
            Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={userInfo.username || ""}
            disabled // Remove this if you add an edit feature later
            sx={{ bgcolor: 'background.paper' }}
          />
        </Box>

        {/* Email Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary" mb={1}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={userInfo.email || ""}
            disabled 
            sx={{ bgcolor: 'background.paper' }}
          />
        </Box>
        
        {/* Mobile Input */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary" mb={1}>
            Mobile Number
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={userInfo.mobileno || ""}
            disabled 
            sx={{ bgcolor: 'background.paper' }}
          />
        </Box>

        {/* Dark Mode Toggle */}
        <Typography variant="subtitle2" fontWeight="bold" color="text.primary" mb={1}>
          Appearance
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 2,
          bgcolor: 'background.paper'
        }}>
          <Typography fontWeight="500">
            Dark Mode
          </Typography>
          <Switch 
            checked={themeMode === 'dark'} 
            onChange={() => dispatch(toggleTheme())} 
            color="primary"
          />
        </Box>

      </Box>
    </Box>
  );
}

export default ProfileSetting;