import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@mui/material": path.resolve(__dirname, "node_modules/@mui/material"),
      "@mui/icons-material": path.resolve(
        __dirname,
        "node_modules/@mui/icons-material"
      ),
      "@mui/base": path.resolve(__dirname, "node_modules/@mui/base"),
      "@mui/system": path.resolve(__dirname, "node_modules/@mui/system"),
      "@mui/utils": path.resolve(__dirname, "node_modules/@mui/utils"),
    },
  },
});
