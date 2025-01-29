import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Person as PeopleIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const drawerWidth = 240;

const menuItems = [
  { text: "Bosh sahifa", icon: <DashboardIcon />, path: "/" },
  { text: "Mahsulotlar", icon: <ProductsIcon />, path: "/products" },
  { text: "Buyurtmalar", icon: <OrdersIcon />, path: "/orders" },
  { text: "Foydalanuvchilar", icon: <PeopleIcon />, path: "/users" },
];

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: isDark
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          minHeight: "64px !important",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            background:
              "linear-gradient(45deg, var(--primary-main), var(--secondary-main))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 600,
          }}
        >
          Munfa Admin
        </Typography>
      </Toolbar>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: "var(--radius-md)",
                margin: "0 8px",
                padding: "10px 16px",
                transition: "var(--transition-all)",
                "&.Mui-selected": {
                  backgroundColor: "var(--bg-selected)",
                  "&:hover": {
                    backgroundColor: "var(--bg-selected-hover)",
                  },
                },
                "&:hover": {
                  backgroundColor: "var(--bg-hover)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color:
                    location.pathname === item.path
                      ? "var(--icon-active)"
                      : "var(--icon-color)",
                  transition: "var(--transition-all)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "0.875rem",
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    color:
                      location.pathname === item.path
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    transition: "var(--transition-all)",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const drawerStyles = {
    boxSizing: "border-box",
    width: drawerWidth,
    backgroundColor: "var(--bg-sidebar)",
    color: "var(--text-primary)",
    borderRight: isDark
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: isDark ? "4px 0 20px rgba(0,0,0,0.4)" : "var(--shadow-md)",
    transition: "var(--transition-all)",
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": drawerStyles,
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": drawerStyles,
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
