import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import config from "../config";

function SingleOrder() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const orderStatuses = [
    { value: "pending", label: "Kutilmoqda" },
    { value: "sold", label: "Sotildi" },
    { value: "cancelled by admin", label: "Admin tomonidan bekor qilindi" },
    { value: "cancelled by user", label: "Mijoz tomonidan bekor qilindi" },
  ];

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await api.getOrderByNumber(orderNumber);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "var(--warning)",
          backgroundColor: isDark
            ? "rgba(245, 158, 11, 0.2)"
            : "rgba(245, 158, 11, 0.1)",
        };
      case "sold":
        return {
          color: "var(--success)",
          backgroundColor: isDark
            ? "rgba(34, 197, 94, 0.2)"
            : "rgba(34, 197, 94, 0.1)",
        };
      case "cancelled by user":
      case "cancelled by admin":
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
    const date = new Date(dateString);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
  };

  const formatPhoneNumber = (phone) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Take last 9 digits in case there are more
    const last9 = cleaned.slice(-9);

    // Format as: +998 xx xxx xx xx
    return `+998 ${last9.slice(0, 2)} ${last9.slice(2, 5)} ${last9.slice(
      5,
      7
    )} ${last9.slice(7, 9)}`;
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await api.updateOrderStatus(orderNumber, newStatus);
      // Refresh order data
      await fetchOrder();
    } catch (err) {
      setError("Holat o'zgartirishda xatolik yuz berdi");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http")
      ? imagePath
      : `${config.baseUrl}/${imagePath}`;
  };

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

  if (!order) {
    return (
      <Box sx={{ p: 3, color: "var(--text-primary)" }}>Buyurtma topilmadi</Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "var(--text-primary)",
            "&:hover": { backgroundColor: "var(--bg-hover)" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "var(--text-primary)" }}
        >
          Buyurtma #{orderNumber}
        </Typography>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                backgroundColor: isDark
                  ? "var(--bg-default)"
                  : "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                color: "var(--text-primary)",
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
          >
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              sx={{
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "var(--bg-paper)",
                    backgroundImage: "none",
                    border: isDark
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(0, 0, 0, 0.1)",
                    boxShadow: isDark
                      ? "0 4px 20px rgba(0,0,0,0.4)"
                      : "var(--shadow-md)",
                  },
                },
              }}
            >
              {orderStatuses.map((status) => (
                <MenuItem
                  key={status.value}
                  value={status.value}
                  sx={{
                    color: "var(--text-primary)",
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <Chip
                    label={status.label}
                    size="small"
                    sx={{
                      ...getStatusColor(status.value),
                      fontWeight: 500,
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Chip
            label={
              orderStatuses.find((s) => s.value === order.status)?.label ||
              order.status
            }
            sx={{
              ...getStatusColor(order.status),
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "var(--bg-paper)",
              borderRadius: "var(--radius-lg)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "var(--text-primary)" }}
            >
              Buyurtma tafsilotlari
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: 60,
                        color: "var(--text-primary)",
                        fontWeight: 600,
                      }}
                    >
                      Rasm
                    </TableCell>
                    <TableCell
                      sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      Mahsulot
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      Narx
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      Miqdor
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      Jami
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Avatar
                          src={
                            item.product?.images?.[0]
                              ? getImageUrl(item.product.images[0])
                              : null
                          }
                          alt={item.product?.name || "O'chirilgan mahsulot"}
                          variant="rounded"
                          sx={{
                            width: 45,
                            height: 45,
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--bg-default)",
                            border: isDark
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(0, 0, 0, 0.1)",
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-secondary)",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            "&.MuiAvatar-root": {
                              backgroundColor: isDark
                                ? "var(--bg-default)"
                                : "var(--bg-input)",
                            },
                          }}
                        >
                          {!item.product?.images?.[0] && "O'"}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ color: "var(--text-primary)" }}>
                        {item.product?.name || "O'chirilgan mahsulot"}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "var(--text-primary)" }}
                      >
                        {formatPrice(item.priceAtOrder)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "var(--text-primary)" }}
                      >
                        {item.quantity}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "var(--text-primary)" }}
                      >
                        {formatPrice(item.priceAtOrder * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="right"
                      sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                    >
                      Jami:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                    >
                      {formatPrice(order.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "var(--bg-paper)",
              borderRadius: "var(--radius-lg)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "var(--text-primary)" }}
            >
              Mijoz ma'lumotlari
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                F.I.Sh
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "var(--text-primary)" }}
              >
                {`${order.userName} ${order.userSurname}`.trim()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                Telefon
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "var(--text-primary)" }}
              >
                {formatPhoneNumber(order.userPhone)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "var(--text-secondary)",
                }}
              >
                <LocationIcon fontSize="small" />
                Manzil
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "var(--text-primary)" }}
              >
                {order.address}
              </Typography>
            </Box>
            {order.comment && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "var(--text-secondary)",
                  }}
                >
                  <CommentIcon fontSize="small" />
                  Izoh
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "var(--text-primary)" }}
                >
                  {order.comment}
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper
            sx={{
              p: 3,
              mt: 2,
              backgroundColor: "var(--bg-paper)",
              borderRadius: "var(--radius-lg)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "var(--text-primary)" }}
            >
              Buyurtma vaqti
            </Typography>
            <Typography sx={{ color: "var(--text-primary)" }}>
              {formatDate(order.createdAt)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SingleOrder;
