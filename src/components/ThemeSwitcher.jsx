import { IconButton, Paper, Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

function ThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        borderRadius: "50%",
        zIndex: 1000,
        backgroundColor: "var(--bg-paper)",
        boxShadow: "var(--shadow-lg)",
        transition: "var(--transition-all)",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Tooltip
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        placement="left"
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: "var(--text-primary)",
            width: "48px",
            height: "48px",
          }}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>
    </Paper>
  );
}

export default ThemeSwitcher;
