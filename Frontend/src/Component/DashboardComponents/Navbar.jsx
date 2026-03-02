import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, toggleTheme } from '../../redux/Features/authSlice'; // Import toggleTheme
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Grab the current theme mode from Redux
  const themeMode = useSelector((state) => state.auth.themeMode);

  const pages = [
    {label: "Overview", path: "/dashboard"},
    {label: "Transactions", path: "/transactions"}, 
    {label: "Budgets", path: "/budget"}, // Note: I changed this to /budget based on your App.jsx routes
  ];

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo ? userInfo._id : null;
  const settings = [
    { label: "Profile", path: `/profile/${userId}` },
  ];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper', // FIXED: Adapts to light/dark automatically
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`, // FIXED: Dynamic border color
        color: 'text.primary',
        backgroundImage: 'none', // Prevents MUI's default dark mode elevation overlay
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/dashboard"  
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              width: '200px',
            }}
          >
            Xpense
          </Typography>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={()=>{
                  handleCloseNavMenu();
                  navigate(page.path);
                }}>
                  <Typography sx={{ textAlign: 'center', fontWeight: 500 }}>
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Xpense
          </Typography>

          {/* Desktop Links - Centered */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'center', 
            gap: 3 
          }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => {
                  navigate(page.path);
                }}
                sx={{
                  my: 2,
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  }
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {/* Right Side Icons (Theme Toggle + Avatar) */}
          <Box sx={{ flexGrow: 0, width: { md: '200px' }, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            
            {/* THEME TOGGLE BUTTON */}
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {/* User Profile / Avatar */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2, minWidth: 150 }
              }}
            >
              {settings.map((item) => (
                <MenuItem key={item.label} onClick={
                  ()=>{
                    handleCloseUserMenu();
                    navigate(item.path);
                }
                }>
                  <Typography sx={{ textAlign: 'center', fontWeight: 500 }} >{item.label}</Typography>
                </MenuItem>
              ))}
                  <MenuItem onClick={handleLogout}>
                    <Typography sx={{ textAlign: 'center', fontWeight: 500 }} >Logout</Typography>
                  </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
      
export default Navbar;