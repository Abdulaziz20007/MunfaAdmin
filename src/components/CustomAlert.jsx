import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const getAlertIcon = (type) => {
  switch (type) {
    case "warning":
      return <WarningIcon sx={{ color: "var(--warning)", fontSize: 40 }} />;
    case "error":
      return <ErrorIcon sx={{ color: "var(--error)", fontSize: 40 }} />;
    default:
      return <InfoIcon sx={{ color: "var(--primary-main)", fontSize: 40 }} />;
  }
};

const CustomAlert = ({ open, onClose, title, message, type = "info", onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--bg-paper)",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pt: 3,
          pb: 0,
        }}
      >
        {getAlertIcon(type)}
        <Typography
          variant="h6"
          component="span"
          sx={{ color: "var(--text-primary)", fontWeight: 600 }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography sx={{ color: "var(--text-secondary)" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "var(--text-secondary)",
            "&:hover": {
              backgroundColor: "var(--bg-hover)",
            },
          }}
        >
          Bekor qilish
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          sx={{
            bgcolor: type === "error" ? "var(--error)" : "var(--primary-main)",
            "&:hover": {
              bgcolor: type === "error" ? "var(--error-dark)" : "var(--primary-dark)",
            },
          }}
        >
          Tasdiqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomAlert; 