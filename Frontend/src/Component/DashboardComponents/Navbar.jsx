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
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/Features/authSlice';
import { useNavigate } from 'react-router-dom';




function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pages = [
    {label: "Overview", path: "/dashboard"},
    {label: "Transactions", path: "/transactions"}, 
    {label: "Budgets", path: "/budgets"},
  ];

  const settings = [
    { label: "Profile", path: "/profile/" },
    { label: "Account", path: "/account" },
    { label: "Dashboard", path: "/dashboard" },
  ];



  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userInfo');

    // Redirect to login page
    dispatch(logoutUser());
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.nav',
        borderBottom: '1px solid #eaeaea',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"  
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              width: '200px', // Forces a fixed width so the center stays perfectly centered
            }}
          >
            Xpense
          </Typography>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
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
                }
                }>
                  <Typography 
                    sx={{ 
                      textAlign: 'center', 
                      fontWeight: 500, 
                      color: 'secondary.main' 
                    }}
                  >
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
            href="/"
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

          {/* User Profile / Avatar */}
          <Box sx={{ flexGrow: 0, width: { md: '200px' }, display: 'flex', justifyContent: 'flex-end' }}>
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
                <MenuItem key={item} onClick={
                  ()=>{
                    handleCloseUserMenu();
                    navigate(item.path);
                }
                }>
                  <Typography sx={{ textAlign: 'center', fontWeight: 500 }} >{item.label}</Typography>
                </MenuItem>
              ))}
                  <MenuItem onClick={() => {
                    handleCloseUserMenu();
                    handleLogout();
                    navigate('/login');
                  }}>
                    <Typography sx={{ textAlign: 'center', fontWeight: 500 }} >logout</Typography>
                  </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
      
export default Navbar;