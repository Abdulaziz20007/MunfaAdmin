import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-default)",
        transition: "var(--transition-all)",
      }}
    >
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: {
            xs: "100%",
            sm: `calc(100% - ${drawerWidth}px)`,
          },
          maxWidth: "100%",
          overflowY: "auto",
          height: "100vh",
          backgroundColor: "var(--bg-default)",
          transition: "var(--transition-all)",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
