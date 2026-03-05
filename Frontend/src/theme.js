import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" }, // Standard Blue
    background: { default: "#f4f6f8", paper: "#ffffff" },
    text: {
      primary: "#121212",   // Deep Black (Standard)
      secondary: "#666666", // Gray (Standard)
    },
    success: { main: "#35de3d" },
    error: { main: "#f43333" }
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: {
      primary: "#ffffff",   // Pure White (Standard)
      secondary: "#b0b0b0", // Light Gray (Standard)
    },
    success: { main: "#35de3d" },
    error: { main: "#f43333" }
  },
});