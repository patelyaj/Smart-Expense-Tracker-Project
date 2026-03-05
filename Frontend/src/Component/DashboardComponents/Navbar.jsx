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
import { logoutUser, toggleTheme } from '../../redux/Features/authSlice';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { alpha } from '@mui/material/styles';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch();
  
  const themeMode = useSelector((state) => state.auth.themeMode);

  const pages = [
    {label: "Overview", path: "/dashboard"},
    {label: "Transactions", path: "/transactions"}, 
    {label: "Budgets", path: "/budget"},
  ];

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo ? userInfo._id : null;

  // Extract the first letter of the username (default to "U" if not found)
  const userFirstLetter = userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "U";

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
        bgcolor: 'background.paper', 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`, 
        backgroundImage: 'none', 
        backdropFilter: 'blur(10px)',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          
          {/* Desktop Logo */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/dashboard"  
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'text.primary', // FIXED: Replaced text.default
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
              sx={{ color: 'text.primary' }}
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
              {pages.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <MenuItem 
                    key={page.label} 
                    selected={isActive}
                    onClick={()=>{
                      handleCloseNavMenu();
                      navigate(page.path);
                    }}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <Typography sx={{ textAlign: 'center', fontWeight: isActive ? 700 : 500 }}>
                      {page.label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'text.primary', // FIXED: Replaced primary.main
              textDecoration: 'none',
            }}
          >
            Xpense
          </Typography>

          {/* Desktop Links - Bottom Border Style */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'center', 
            gap: 3 
          }}>
            {pages.map((page) => {
              const isActive = location.pathname === page.path; 
              
              return (
                <Button
                  key={page.label}
                  disableRipple 
                  onClick={() => navigate(page.path)}
                  sx={{
                    my: 2,
                    px: 1, 
                    py: 1,
                    color: isActive ? 'primary.main' : 'text.primary', // FIXED: Replaced text.default
                    bgcolor: 'transparent',
                    textTransform: 'none',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '1rem',
                    position: 'relative', 
                    transition: 'color 0.2s ease-in-out',
                    
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'transparent', 
                    },
                    
                    /* The Animated Bottom Line */
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '0px', 
                      left: '50%',
                      transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                      width: '80%', 
                      height: '3px', 
                      borderRadius: '4px 4px 0 0', 
                      backgroundColor: 'primary.main',
                      transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
                      opacity: isActive ? 1 : 0,
                      transformOrigin: 'center',
                    },

                    /* Hover state for the bottom line */
                    '&:hover::after': {
                      transform: 'translateX(-50%) scaleX(1)',
                      opacity: isActive ? 1 : 0.5, 
                    }
                  }}
                >
                  {page.label}
                </Button>
              )
            })}
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ flexGrow: 0, width: { md: '200px' }, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            
            <IconButton 
              onClick={() => dispatch(toggleTheme())} 
              sx={{ 
                color: 'text.secondary',
                '&:hover': { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05) }
              }}
            >
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, border: '2px solid transparent', transition: 'border 0.2s', '&:hover': { borderColor: 'primary.main' } }}>
                {/* DYNAMIC AVATAR ADDED HERE */}
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'primary.main', 
                    color: 'primary.contrastText', // Ensures the letter is readable
                    fontWeight: 700 
                  }}
                >
                  {userFirstLetter}
                </Avatar>
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
                elevation: 4,
                sx: { borderRadius: 3, minWidth: 160, overflow: 'visible', mt: 1.5, '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, } }
              }}
            >
              {settings.map((item) => (
                <MenuItem key={item.label} onClick={()=>{ handleCloseUserMenu(); navigate(item.path); }} sx={{ borderRadius: 1, mx: 1 }}>
                  <Typography sx={{ textAlign: 'center', fontWeight: 500 }} >{item.label}</Typography>
                </MenuItem>
              ))}
              <Box sx={{ my: 1, borderBottom: '1px solid', borderColor: 'divider' }} />
              <MenuItem onClick={handleLogout} sx={{ borderRadius: 1, mx: 1, color: 'error.main' }}>
                <Typography sx={{ textAlign: 'center', fontWeight: 600, width: '100%' }} >Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
      
export default Navbar;