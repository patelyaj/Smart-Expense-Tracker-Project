import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Switch, Avatar, Divider, Button, CircularProgress } from '@mui/material';
import { toggleTheme } from '../../../redux/Features/authSlice';
import api from '../../../utils/axiosInstance'; // Using your existing axios instance
import { toast } from 'react-toastify'; // Standard React popup library

function ProfileSetting() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.auth.themeMode);
  
  // 1. Pull initial user data from localStorage
  const initialUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

  // 2. Create editable state for the form
  const [formData, setFormData] = useState({
    username: initialUserInfo.username || "",
    email: initialUserInfo.email || "",
    mobileno: initialUserInfo.mobileno || ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // 3. Handle input typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Determine if the user actually changed anything
  const isModified = 
    formData.username !== initialUserInfo.username ||
    formData.email !== initialUserInfo.email ||
    formData.mobileno !== initialUserInfo.mobileno;

  // 5. Handle Save Changes
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Make API call to backend (ensure you have this route set up in authRoutes.js!)
      const response = await api.patch(`/users/updateprofile/${initialUserInfo._id}`, formData);
      
      // Update local storage with the new data so it persists on refresh
      const updatedUser = { ...initialUserInfo, ...formData };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      // Show success popup!
      toast.success("Profile updated successfully!");
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Profile Settings
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Manage your personal information and preferences.
          </Typography>
        </Box>

        {/* 👇 NEW: Save Changes Button */}
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!isModified || isLoading} 
          onClick={handleSave}
          disableElevation
          sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Form Container */}
      <Box sx={{ maxWidth: 400 }}>

        {/* Avatar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
            {formData.username ? formData.username.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {formData.username || "User"}
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
            name="username"          // <-- Added name
            value={formData.username} // <-- Bound to local state
            onChange={handleChange}  // <-- Bound to handler
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
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="mobileno"
            value={formData.mobileno}
            onChange={handleChange}
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