import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Blue
    },
    background: {
      default: "#f4f6f8", // Light gray background for the app
      paper: "#ffffff",   // White background for cards
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Lighter blue for dark mode visibility
    },
    background: {
      default: "#121212", // Standard dark background
      paper: "#1e1e1e",   // Slightly lighter dark for cards
    },
  },
});