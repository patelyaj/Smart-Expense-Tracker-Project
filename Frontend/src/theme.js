import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5dda63',
      blue: '#6ddcfd',
    },
    secondary: {
      main: '#c62828', 
    },

    background: {
      default: '#f5f7fa', // Dashboard background
      nav: '#ffffff',   // Navbar & Card backgrounds
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // You can also override heading weights here globally
  },
});

export default theme;