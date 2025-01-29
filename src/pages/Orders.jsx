import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  TableSortLabel,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import { StyledSelect } from "../components/StyledSelect";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { isDark } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Buyurtmani o'chirishni xohlaysizmi?")) {
      try {
        await api.deleteOrder(id);
        fetchOrders();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Yangi":
        return {
          color: "var(--info)",
          backgroundColor: isDark
            ? "rgba(59, 130, 246, 0.2)"
            : "rgba(59, 130, 246, 0.1)",
        };
      case "Tasdiqlangan":
        return {
          color: "var(--warning)",
          backgroundColor: isDark
            ? "rgba(245, 158, 11, 0.2)"
            : "rgba(245, 158, 11, 0.1)",
        };
      case "Yetkazilmoqda":
        return {
          color: "var(--primary-main)",
          backgroundColor: isDark
            ? "rgba(99, 102, 241, 0.2)"
            : "rgba(99, 102, 241, 0.1)",
        };
      case "Yetkazildi":
        return {
          color: "var(--success)",
          backgroundColor: isDark
            ? "rgba(34, 197, 94, 0.2)"
            : "rgba(34, 197, 94, 0.1)",
        };
      case "Bekor qilindi":
        return {
          color: "var(--error)",
          backgroundColor: isDark
            ? "rgba(239, 68, 68, 0.2)"
            : "rgba(239, 68, 68, 0.1)",
        };
      default:
        return {
          color: "var(--text-secondary)",
          backgroundColor: "var(--bg-hover)",
        };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          (order.orderNumber?.toString() || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${order.userName || ""} ${order.userSurname || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const isAsc = order === "asc";
        if (orderBy === "total") {
          return isAsc
            ? (a.total || 0) - (b.total || 0)
            : (b.total || 0) - (a.total || 0);
        }
        if (orderBy === "createdAt") {
          return isAsc
            ? new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
            : new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (orderBy === "customer") {
          const nameA = `${a.userName || ""} ${a.userSurname || ""}`.trim();
          const nameB = `${b.userName || ""} ${b.userSurname || ""}`.trim();
          return isAsc
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        return isAsc
          ? (a[orderBy] || "")
              .toString()
              .localeCompare((b[orderBy] || "").toString())
          : (b[orderBy] || "")
              .toString()
              .localeCompare((a[orderBy] || "").toString());
      });
  }, [orders, searchTerm, statusFilter, orderBy, order]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: "var(--error)" }}>Xatolik yuz berdi: {error}</Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "var(--text-primary)",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Buyurtmalar
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary)",
            }}
          >
            Barcha buyurtmalarni kuzatib boring va boshqaring
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          p: 3,
          backgroundColor: "var(--bg-paper)",
          borderRadius: "var(--radius-lg)",
          boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "var(--shadow-md)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          transition: "var(--transition-all)",
          "& .MuiInputLabel-root": {
            transition: "var(--transition-all)",
          },
          "& .MuiOutlinedInput-root": {
            transition: "var(--transition-all)",
          },
          "& .MuiSelect-select": {
            transition: "var(--transition-all)",
          },
          "& .MuiSvgIcon-root": {
            transition: "var(--transition-all)",
          },
        }}
      >
        <TextField
          placeholder="Buyurtmalarni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: "var(--text-secondary)",
                    transition: "var(--transition-all)",
                  }}
                />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: isDark ? "var(--bg-default)" : "var(--bg-input)",
              borderRadius: "var(--radius-lg)",
              transition: "var(--transition-all)",
              "& fieldset": {
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                transition: "var(--transition-all)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-main) !important",
              },
              "& .MuiInputBase-input": {
                color: "var(--text-primary)",
                padding: "12px 14px",
                transition: "var(--transition-all)",
                "&::placeholder": {
                  color: "var(--text-secondary)",
                  opacity: 1,
                  transition: "var(--transition-all)",
                },
              },
            },
          }}
          sx={{ flexGrow: 1 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel
            sx={{
              color: "var(--text-secondary)",
              "&.Mui-focused": {
                color: "var(--primary-main)",
              },
            }}
          >
            Holat
          </InputLabel>
          <StyledSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Holat"
            sx={{
              backgroundColor: isDark ? "var(--bg-default)" : "var(--bg-input)",
              borderRadius: "var(--radius-lg)",
              color: "var(--text-primary)",
              transition: "var(--transition-all)",
              "& fieldset": {
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                transition: "var(--transition-all)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-main) !important",
              },
              "& .MuiSelect-select": {
                padding: "12px 14px",
                transition: "var(--transition-all)",
              },
              "& .MuiSvgIcon-root": {
                color: "var(--text-secondary)",
                transition: "var(--transition-all)",
              },
            }}
          >
            <MenuItem value="all">Barcha Holatlar</MenuItem>
            <MenuItem value="Yangi">Yangi</MenuItem>
            <MenuItem value="Tasdiqlangan">Tasdiqlangan</MenuItem>
            <MenuItem value="Yetkazilmoqda">Yetkazilmoqda</MenuItem>
            <MenuItem value="Yetkazildi">Yetkazildi</MenuItem>
            <MenuItem value="Bekor qilindi">Bekor qilindi</MenuItem>
          </StyledSelect>
        </FormControl>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "var(--bg-paper)",
          borderRadius: "var(--radius-lg)",
          boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "var(--shadow-md)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          transition: "var(--transition-all)",
          "& .MuiTableCell-root": {
            borderBottom: isDark
              ? "1px solid rgb(45, 55, 72)"
              : "1px solid #dfe1e2",
            transition: "var(--transition-all)",
          },
          "& .MuiTableRow-root": {
            transition: "var(--transition-all)",
          },
          "& .MuiChip-root": {
            transition: "var(--transition-all)",
          },
          "& .MuiIconButton-root": {
            transition: "var(--transition-all)",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
                transition: "var(--transition-all)",
              }}
            >
              <TableCell>
                <TableSortLabel
                  active={orderBy === "orderNumber"}
                  direction={orderBy === "orderNumber" ? order : "asc"}
                  onClick={() => handleSort("orderNumber")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Buyurtma №
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customer"}
                  direction={orderBy === "customer" ? order : "asc"}
                  onClick={() => handleSort("customer")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Mijoz
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "total"}
                  direction={orderBy === "total" ? order : "asc"}
                  onClick={() => handleSort("total")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Summa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleSort("status")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Holat
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleSort("createdAt")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Sana
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Amallar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedOrders.map((order) => (
              <TableRow
                key={order._id || order.id}
                sx={{
                  "&:hover": {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                  },
                  transition: "var(--transition-all)",
                }}
              >
                <TableCell sx={{ color: "var(--text-primary)" }}>
                  #{order.orderNumber || "N/A"}
                </TableCell>
                <TableCell sx={{ color: "var(--text-primary)" }}>
                  {`${order.userName || ""} ${
                    order.userSurname || ""
                  }`.trim() || "N/A"}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {formatPrice(order.total || 0)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status || "N/A"}
                    sx={{
                      ...getStatusColor(order.status),
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "var(--text-primary)" }}>
                  {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/orders/${order.orderNumber}`)}
                    sx={{
                      color: "var(--primary-main)",
                      p: 1,
                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(59, 130, 246, 0.1)",
                      },
                    }}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(order._id)}
                    sx={{
                      color: "var(--error)",
                      ml: 1,
                      p: 1,
                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(239, 68, 68, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Orders;
