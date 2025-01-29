import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

function Users() {
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      const data = await api.getUsers();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isVerified: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteUser(selectedUser._id);
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)) &&
        user.name !== "None"
    );
  }, [users, searchTerm]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        Foydalanuvchilar
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "var(--text-secondary)" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "var(--bg-paper)",
              "& fieldset": {
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-main)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary-main)",
              },
            },
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "var(--bg-paper)",
          backgroundImage: "none",
          boxShadow: "var(--shadow-md)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "var(--text-secondary)" }}>
                Ism familiya
              </TableCell>
              <TableCell sx={{ color: "var(--text-secondary)" }}>
                Telefon raqami
              </TableCell>
              <TableCell sx={{ color: "var(--text-secondary)" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "var(--text-secondary)" }}>
                Ro'yxatdan o'tgan sana
              </TableCell>
              <TableCell align="right" sx={{ color: "var(--text-secondary)" }}>
                Amallar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell sx={{ color: "var(--text-primary)" }}>
                    {user.name === "None" && user.surname === "None"
                      ? "Noma'lum"
                      : `${user.name} ${user.surname}`}
                  </TableCell>
                  <TableCell sx={{ color: "var(--text-primary)" }}>
                    +998 {user.phone}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.isVerified ? "Tasdiqlangan" : "Tasdiqlanmagan"
                      }
                      sx={{
                        backgroundColor: user.isVerified
                          ? "var(--success)"
                          : "var(--error)",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "var(--text-primary)" }}>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleStatusChange(user._id, !user.isVerified)
                      }
                      sx={{
                        color: user.isVerified
                          ? "var(--error)"
                          : "var(--success)",
                        p: 1,
                        "&:hover": {
                          backgroundColor: user.isVerified
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(34, 197, 94, 0.1)",
                        },
                      }}
                    >
                      {user.isVerified ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(user)}
                      sx={{
                        color: "var(--error)",
                        ml: 1,
                        p: 1,
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography sx={{ color: "var(--text-secondary)" }}>
                    {loading ? "Yuklanmoqda..." : "Foydalanuvchilar topilmadi"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "var(--bg-paper)",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ color: "var(--text-primary)" }}>
          Foydalanuvchini o'chirish
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "var(--text-primary)" }}>
            Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "var(--text-secondary)" }}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users;
