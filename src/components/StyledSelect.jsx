import { Select } from "@mui/material";

export const StyledSelect = ({ children, ...props }) => (
  <Select
    {...props}
    MenuProps={{
      disableScrollLock: true,
      PaperProps: {
        sx: {
          backgroundColor: "var(--bg-paper)",
          backgroundImage: "none",
          border: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "var(--shadow-md)",
          "& .MuiMenuItem-root": {
            color: "var(--text-primary)",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
            },
          },
        },
      },
    }}
  >
    {children}
  </Select>
);
