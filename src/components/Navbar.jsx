import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  LightMode,
  DarkMode,
  Settings,
  Logout,
  Dashboard as DashboardIcon,
  Inventory2 as Inventory2Icon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

const menuItems = [
  {
    title: "Bosh sahifa",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    title: "Mahsulotlar",
    path: "/products",
    icon: <Inventory2Icon />,
  },
  {
    title: "Buyurtmalar",
    path: "/orders",
    icon: <ShoppingCartIcon />,
  },
];

function Navbar({ onMenuClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "var(--bg-paper)",
        color: "var(--text-primary)",
        borderBottom: isDark
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "var(--shadow-md)",
        transition: "var(--transition-all)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { sm: "none" },
              "&:hover": {
                backgroundColor: "var(--bg-hover)",
              },
              transition: "var(--transition-all)",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              display: { xs: "none", sm: "block" },
              background:
                "linear-gradient(45deg, var(--primary-main), var(--secondary-main))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Munfa Admin
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "var(--bg-hover)",
              },
              transition: "var(--transition-all)",
            }}
          >
            {isDark ? (
              <LightMode sx={{ fontSize: 20 }} />
            ) : (
              <DarkMode sx={{ fontSize: 20 }} />
            )}
          </IconButton>
          <IconButton
            onClick={handleMenu}
            sx={{
              width: 40,
              height: 40,
              ml: 0.5,
              "&:hover": {
                backgroundColor: "var(--bg-hover)",
              },
              transition: "var(--transition-all)",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "var(--primary-main)",
                fontSize: "0.875rem",
              }}
            >
              A
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                backgroundColor: "var(--bg-paper)",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.4)"
                  : "var(--shadow-md)",
                minWidth: 200,
              },
            }}
          >
            <Box sx={{ py: 1, px: 2 }}>
              <Typography
                sx={{ color: "var(--text-primary)", fontWeight: 600 }}
              >
                Admin User
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                admin@munfa.com
              </Typography>
            </Box>
            <Divider
              sx={{
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              }}
            />
            <MenuItem
              onClick={handleClose}
              sx={{
                py: 1.5,
                "&:hover": { backgroundColor: "var(--bg-hover)" },
              }}
            >
              <Settings sx={{ mr: 2, fontSize: 20 }} />
              <Typography>Settings</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                "&:hover": { backgroundColor: "var(--bg-hover)" },
              }}
            >
              <Logout sx={{ mr: 2, fontSize: 20 }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
