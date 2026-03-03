import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Blue
    },
    background: {
      default: "#f4f6f8", 
      paper: "#ffffff",   
    },
    success: {
      main: "#35cb3c", // Lighter, neon-ish green for dark mode visibility
    },
    error: {
      main: "#f43333", // Lighter, softer red for dark mode visibility
    }
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", 
    },
    background: {
      default: "#121212", 
      paper: "#373636",   
    },
    text: {
      primary: "#ffffff",   
      secondary: "#a6c8e3", 
    },
    success: {
      main: "#35de3d", // Lighter, neon-ish green for dark mode visibility
    },
    error: {
      main: "#f43333", // Lighter, softer red for dark mode visibility
    }
  },
});