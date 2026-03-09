import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Container, Typography, TextField, Switch, Avatar, 
  Divider, Button, CircularProgress, Paper, Grid 
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import Navbar from "../../../Component/DashboardComponents/Navbar";
import { toggleTheme } from '../../../redux/Features/authSlice';
import api from '../../../utils/axiosInstance';
import { toast } from 'react-toastify'; 

function Profile() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.auth.themeMode);
  
  const initialUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

  const [formData, setFormData] = useState({
    username: initialUserInfo.username || "",
    email: initialUserInfo.email || "",
    mobileno: initialUserInfo.mobileno || ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isModified = 
    formData.username !== initialUserInfo.username ||
    formData.email !== initialUserInfo.email ||
    formData.mobileno !== initialUserInfo.mobileno;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/users/updateProfile/${initialUserInfo._id}`, formData);
      console.log("update profile ,",response);
      const updatedUser = { ...initialUserInfo, ...formData };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 5 }}>
        
        {/* Page Title */}
        <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 4 }}>
          Profile Settings
        </Typography>

        {/* --- CARD 1: PERSONAL INFORMATION --- */}
        <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, 
            mb: 4, 
            borderRadius: 3, 
            border: "1px solid", 
            borderColor: "divider", 
            bgcolor: "background.paper" 
        }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
            Personal Information
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Update your personal details here.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Avatar / Photo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
            <Avatar sx={{ 
              width: 90, height: 90, 
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontSize: '3rem', 
              fontWeight: 700 
            }}>
              {formData.username ? formData.username.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h6" fontWeight={800} color="text.primary">
                {formData.username || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Personal Account
              </Typography>
            </Box>
          </Box>

          {/* Form Fields using Grid for responsive layout */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={1}>
                Full Name
              </Typography>
              <TextField
                fullWidth size="small" variant="outlined" name="username"
                value={formData.username} onChange={handleChange}
                sx={{ bgcolor: 'background.default', borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={1}>
                Mobile Number
              </Typography>
              <TextField
                fullWidth size="small" variant="outlined" name="mobileno"
                value={formData.mobileno} onChange={handleChange}
                sx={{ bgcolor: 'background.default', borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={1}>
                Email Address
              </Typography>
              <TextField
                fullWidth size="small" variant="outlined" name="email"
                value={formData.email} onChange={handleChange}
                sx={{ bgcolor: 'background.default', borderRadius: 1 }}
              />
            </Grid>
          </Grid>

          {/* Action Button at the bottom of the card */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              disabled={!isModified || isLoading} 
              onClick={handleSave}
              disableElevation
              sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 4, py: 1 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
            </Button>
          </Box>
        </Paper>

        {/* --- CARD 2: APPEARANCE PREFERENCES --- */}
        <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 3, 
            border: "1px solid", 
            borderColor: "divider", 
            bgcolor: "background.paper" 
        }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
            Appearance
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Customize how the dashboard looks on your device.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5,
            bgcolor: 'background.default'
          }}>
            <Box>
              <Typography fontWeight={700} color="text.primary">
                Dark Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Switch between light and dark themes
              </Typography>
            </Box>
            <Switch 
              checked={themeMode === 'dark'} 
              onChange={() => dispatch(toggleTheme())} 
              color="primary" 
            />
          </Box>
        </Paper>

      </Container>
    </Box>
  );
}

export default Profile;