import { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeSwitcher from "../components/ThemeSwitcher";
import "../styles/auth.css";

function Login() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(credentials.username, credentials.password);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box className={`login-container ${isDark ? "dark" : ""}`}>
      <Paper
        elevation={3}
        className={`login-form ${isDark ? "dark" : ""}`}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: "var(--bg-paper)",
          transition: "background-color 0.2s ease-in-out",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: "center",
            mb: 4,
            fontWeight: 600,
            color: "var(--text-primary)",
            transition: "color 0.2s ease-in-out",
          }}
        >
          Munfa Admin
        </Typography>

        {error && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              textAlign: "center",
              backgroundColor: isDark
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(239, 68, 68, 0.1)",
              padding: 1,
              borderRadius: 1,
            }}
          >
            {error}
          </Typography>
        )}

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoComplete="username"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: isDark
                  ? "var(--bg-default)"
                  : "var(--bg-input)",
                "& fieldset": {
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                  transition: "border-color 0.2s ease-in-out",
                },
                "&:hover fieldset": {
                  borderColor: "var(--primary-light)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--primary-main)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--text-secondary)",
                "&.Mui-focused": {
                  color: "var(--primary-main)",
                },
              },
              "& .MuiInputBase-input": {
                color: "var(--text-primary)",
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: isDark
                  ? "var(--bg-default)"
                  : "var(--bg-input)",
                "& fieldset": {
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                  transition: "border-color 0.2s ease-in-out",
                },
                "&:hover fieldset": {
                  borderColor: "var(--primary-light)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--primary-main)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--text-secondary)",
                "&.Mui-focused": {
                  color: "var(--primary-main)",
                },
              },
              "& .MuiInputBase-input": {
                color: "var(--text-primary)",
              },
            }}
          />
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            background:
              "linear-gradient(45deg, var(--primary-main), var(--secondary-main))",
            color: "#fff",
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            "&:hover": {
              background:
                "linear-gradient(45deg, var(--primary-dark), var(--secondary-dark))",
              transform: "translateY(-1px)",
              boxShadow: "var(--shadow-md)",
            },
            transition: "all 0.2s ease-in-out",
            "&.Mui-disabled": {
              background: isDark
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.12)",
              color: isDark
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.26)",
            },
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Paper>
      <Box className="theme-switcher">
        <ThemeSwitcher />
      </Box>
    </Box>
  );
}

export default Login;
