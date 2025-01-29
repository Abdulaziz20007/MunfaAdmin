import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import "./styles/auth.css";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#646cff",
      light: "#828dff",
      dark: "#4B50CC",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#535bf2",
      light: "#7B82F5",
      dark: "#3D44B5",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#636e72",
    },
    divider: "rgba(0, 0, 0, 0.1)",
  },
  typography: {
    fontFamily:
      '"Inter", "system-ui", "Avenir", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#2c3e50",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#2c3e50",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#2c3e50",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#2c3e50",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      color: "#2c3e50",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#2c3e50",
    },
    body1: {
      fontSize: "1rem",
      color: "#2c3e50",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#636e72",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#2c3e50",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          borderRight: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "4px 8px",
          "&.Mui-selected": {
            backgroundColor: "rgba(100, 108, 255, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(100, 108, 255, 0.12)",
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "40px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
