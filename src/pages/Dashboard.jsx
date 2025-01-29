import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Switch,
} from "@mui/material";
import {
  TrendingUp,
  People,
  Inventory,
  ShoppingCart,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  CheckCircle as VerifyIcon,
  Cancel as UnverifyIcon,
  Delete as DeleteIcon,
  Remove as HorizontalIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
};

const getStatusColor = (status) => {
  const statusMap = {
    sold: {
      label: "Sotildi",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "var(--success)",
    },
    pending: {
      label: "Kutilmoqda",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      color: "var(--warning)",
    },
    "cancelled by admin": {
      label: "Admin tomonidan bekor qilindi",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "var(--error)",
    },
    "cancelled by user": {
      label: "Mijoz tomonidan bekor qilindi",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "var(--error)",
    },
  };

  return (
    statusMap[status] || {
      label: status,
      backgroundColor: "rgba(100, 116, 139, 0.1)",
      color: "var(--text-secondary)",
    }
  );
};

const getLastSixMonths = () => {
  const months = [];
  const monthNames = [
    "Yan",
    "Fev",
    "Mar",
    "Apr",
    "May",
    "Iyn",
    "Iyl",
    "Avg",
    "Sen",
    "Okt",
    "Noy",
    "Dek",
  ];
  const date = new Date();
  const currentMonth = date.getMonth() + 1;

  // Get the last 7 months including current month
  for (let i = 6; i >= 0; i--) {
    let monthIndex = currentMonth - i;
    // Handle wrapping around to previous year
    if (monthIndex < 0) {
      monthIndex = 12 + monthIndex;
    }
    months.push(monthNames[monthIndex]);
  }

  return months;
};

const getLastTenDays = () => {
  const dates = [];
  const today = new Date();

  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    dates.push(`${day}.${month}`);
  }

  return dates;
};

function Dashboard() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ordersLengthInSixMonth: {},
    ordersLengthPercentageChange: 0,
    usersLengthInSixMonth: {},
    usersLengthPercentageChange: 0,
    ordersTotalInSixMonth: {},
    ordersTotalPercentageChange: 0,
    productsLengthInSixMonth: {},
    productsLengthPercentageChange: 0,
    lastSoldOrdersInTenDays: {},
    tenLastOrders: [],
    tenLastUsers: [],
    ordersDetails: {
      thisMonthSold: 0,
      thisMonthPending: 0,
      thisMonthCancelled: 0,
    },
    ordersAllTimeDetails: {
      allTimeSold: 0,
      allTimePending: 0,
      allTimeCancelled: 0,
    },
    ordersDetailsLength: {
      thisMonthSold: 0,
      thisMonthPending: 0,
      thisMonthCancelled: 0,
    },
    ordersAllTimeDetailsLength: {
      allTimeSold: 0,
      allTimePending: 0,
      allTimeCancelled: 0,
    },
    productsDetails: {
      active: 0,
      deleted: 0,
    },
    productsStockDetails: {
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
    },
    usersDetails: {
      active: 0,
      inactive: 0,
    },
    usersDetailsLength: {
      active: 0,
      inactive: 0,
    },
    lastSoldOrdersTotalInTenDays: {},
  });

  const navigate = useNavigate();

  // Add state for chart type
  const [chartType, setChartType] = useState("count"); // "count" or "total"

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      console.log("Dashboard stats:", data);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, currentStatus) => {
    try {
      await api.updateUserStatus(userId, !currentStatus);

      // Update the users list locally
      setStats((prevStats) => ({
        ...prevStats,
        tenLastUsers: prevStats.tenLastUsers.map((user) =>
          user._id === userId ? { ...user, isVerified: !currentStatus } : user
        ),
        // Update user stats
        usersDetails: {
          ...prevStats.usersDetails,
          active: currentStatus
            ? prevStats.usersDetails.active - 1
            : prevStats.usersDetails.active + 1,
          inactive: currentStatus
            ? prevStats.usersDetails.inactive + 1
            : prevStats.usersDetails.inactive - 1,
        },
        usersDetailsLength: {
          ...prevStats.usersDetailsLength,
          active: currentStatus
            ? prevStats.usersDetailsLength.active - 1
            : prevStats.usersDetailsLength.active + 1,
          inactive: currentStatus
            ? prevStats.usersDetailsLength.inactive + 1
            : prevStats.usersDetailsLength.inactive - 1,
        },
      }));
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) {
      try {
        await api.deleteUser(userId);
        // Refresh dashboard data
        fetchStats();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleOrderClick = (orderNumber) => {
    navigate(`/orders/${orderNumber}`);
  };

  const StatCard = ({
    title,
    value,
    icon,
    trend,
    color,
    showChart = false,
    chartData = [],
    currentStats = [],
    totalStats = [],
    sx = {},
  }) => {
    const { isDark } = useTheme();
    const months = getLastSixMonths();

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          position: "nearest",
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.9)"
            : "rgba(255, 255, 255, 0.95)",
          titleColor: isDark ? "#fff" : "#000",
          bodyColor: isDark ? "#fff" : "#000",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          padding: {
            top: 8,
            right: 12,
            bottom: 8,
            left: 12,
          },
          boxPadding: 4,
          titleFont: {
            size: 13,
            weight: "600",
            family: "'Inter', sans-serif",
          },
          bodyFont: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          callbacks: {
            label: (context) => {
              let value = context.parsed.y;
              if (title.includes("daromad")) {
                return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
              }
              return value.toLocaleString();
            },
          },
          caretSize: 6,
          cornerRadius: 4,
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
          min: 0,
        },
      },
    };

    const chartDataConfig = {
      labels: months,
      datasets: [
        {
          data: chartData,
          borderColor: isDark ? "#fff" : color,
          backgroundColor: isDark ? "#fff" : color,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          fill: {
            target: "origin",
            above: isDark ? `${color}33` : `${color}1a`,
          },
        },
      ],
    };

    const chartColor = isDark ? `${color}50` : color;
    const bgColor = isDark ? `${color}15` : `${color}10`;

    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          height: "100%",
          bgcolor: "var(--bg-paper)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
          transition: "var(--transition-all)",
          ...sx,
          "&:hover": {
            boxShadow: isDark
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "var(--text-secondary)", fontWeight: 500 }}
          >
            {title}
          </Typography>
          {showChart ? (
            <Box
              sx={{
                width: 100,
                height: 40,
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              <Line data={chartDataConfig} options={chartOptions} />
            </Box>
          ) : (
            <Box
              sx={{
                p: 1,
                borderRadius: "var(--radius-lg)",
                bgcolor: bgColor,
                color: chartColor,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {typeof value === "number" ? value.toString() : value}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color:
                  parseFloat(trend || 0) > 0
                    ? "success.main"
                    : parseFloat(trend || 0) < 0
                    ? "error.main"
                    : "warning.main",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              {parseFloat(trend || 0) > 0 ? (
                <ArrowUpIcon fontSize="small" sx={{ mr: 0.5 }} />
              ) : parseFloat(trend || 0) < 0 ? (
                <ArrowDownIcon fontSize="small" sx={{ mr: 0.5 }} />
              ) : (
                <HorizontalIcon fontSize="small" sx={{ mr: 0.5 }} />
              )}
              {Math.abs(parseFloat(trend || 0)).toFixed(2)}%
            </Typography>
          </Box>
        </Box>

        {currentStats.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container spacing={2}>
              {currentStats.map((stat, index) => (
                <Grid item xs={4} key={index}>
                  <Tooltip
                    title={stat.label}
                    placement="top"
                    arrow
                    enterDelay={200}
                    sx={{
                      backgroundColor: isDark
                        ? "rgba(0, 0, 0, 0.9)"
                        : "rgba(255, 255, 255, 0.95)",
                      "& .MuiTooltip-arrow": {
                        color: isDark
                          ? "rgba(0, 0, 0, 0.9)"
                          : "rgba(255, 255, 255, 0.95)",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: stat.color || "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        cursor: "pointer",
                        transition: "var(--transition-all)",
                        "&:hover": {
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {totalStats.length > 0 && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container spacing={2}>
              {totalStats.map((stat, index) => (
                <Grid item xs={4} key={index}>
                  <Tooltip
                    title={stat.label}
                    placement="top"
                    arrow
                    enterDelay={200}
                    sx={{
                      backgroundColor: isDark
                        ? "rgba(0, 0, 0, 0.9)"
                        : "rgba(255, 255, 255, 0.95)",
                      "& .MuiTooltip-arrow": {
                        color: isDark
                          ? "rgba(0, 0, 0, 0.9)"
                          : "rgba(255, 255, 255, 0.95)",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: stat.color || "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        cursor: "pointer",
                        transition: "var(--transition-all)",
                        "&:hover": {
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3, color: "var(--text-secondary)" }}>
        Ma'lumotlar topilmadi
      </Box>
    );
  }

  return (
    <Box sx={{}}>
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Oylik daromad"
            value={formatPrice(stats.ordersDetails?.thisMonthSold || 0)}
            icon={<TrendingUp />}
            trend={stats.ordersTotalPercentageChange}
            color="var(--primary-main)"
            showChart={true}
            chartData={Object.values(stats.ordersTotalInSixMonth).reverse()}
            currentStats={[
              {
                label: "Oylik sotilgan",
                value: formatPrice(stats.ordersDetails?.thisMonthSold || 0),
                color: "var(--success)",
              },
              {
                label: "Oylik kutilayotgan",
                value: formatPrice(stats.ordersDetails?.thisMonthPending || 0),
                color: "var(--warning)",
              },
              {
                label: "Oylik bekor qilingan",
                value: formatPrice(
                  stats.ordersDetails?.thisMonthCancelled || 0
                ),
                color: "var(--error)",
              },
            ]}
            totalStats={[
              {
                label: "Jami sotilgan",
                value: formatPrice(
                  stats.ordersAllTimeDetails?.allTimeSold || 0
                ),
                color: "var(--success)",
              },
              {
                label: "Jami kutilayotgan",
                value: formatPrice(
                  stats.ordersAllTimeDetails?.allTimePending || 0
                ),
                color: "var(--warning)",
              },
              {
                label: "Jami bekor qilingan",
                value: formatPrice(
                  stats.ordersAllTimeDetails?.allTimeCancelled || 0
                ),
                color: "var(--error)",
              },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Buyurtmalar"
            value={stats.ordersDetailsLength?.thisMonthSold || 0}
            icon={<ShoppingCart />}
            trend={stats.ordersLengthPercentageChange}
            color="var(--warning)"
            showChart={true}
            chartData={Object.values(stats.ordersLengthInSixMonth).reverse()}
            currentStats={[
              {
                label: "Oylik sotilgan",
                value:
                  stats.ordersDetailsLength?.thisMonthSold?.toString() || "0",
                color: "var(--success)",
              },
              {
                label: "Oylik kutilayotgan",
                value:
                  stats.ordersDetailsLength?.thisMonthPending?.toString() ||
                  "0",
                color: "var(--warning)",
              },
              {
                label: "Oylik bekor qilingan",
                value:
                  stats.ordersDetailsLength?.thisMonthCancelled?.toString() ||
                  "0",
                color: "var(--error)",
              },
            ]}
            totalStats={[
              {
                label: "Jami sotilgan",
                value:
                  stats.ordersAllTimeDetailsLength?.allTimeSold?.toString() ||
                  "0",
                color: "var(--success)",
              },
              {
                label: "Jami kutilayotgan",
                value:
                  stats.ordersAllTimeDetailsLength?.allTimePending?.toString() ||
                  "0",
                color: "var(--warning)",
              },
              {
                label: "Jami bekor qilingan",
                value:
                  stats.ordersAllTimeDetailsLength?.allTimeCancelled?.toString() ||
                  "0",
                color: "var(--error)",
              },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mahsulotlar"
            value={stats.productsDetails?.active || 0}
            icon={<Inventory />}
            trend={stats.productsLengthPercentageChange}
            color="var(--success)"
            showChart={true}
            chartData={Object.values(stats.productsLengthInSixMonth).reverse()}
            currentStats={[
              {
                label: "Faol",
                value: stats.productsDetails.active,
                color: "var(--success)",
              },
              {
                label: "O'chirilgan",
                value: stats.productsDetails.deleted,
                color: "var(--error)",
              },
            ]}
            totalStats={[
              {
                label: "Zaxirada",
                value: stats.productsStockDetails.inStock,
                color: "var(--success)",
              },
              {
                label: "Kam qolgan",
                value: stats.productsStockDetails.lowStock,
                color: "var(--warning)",
              },
              {
                label: "Tugagan",
                value: stats.productsStockDetails.outOfStock,
                color: "var(--error)",
              },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Foydalanuvchilar"
            value={stats.usersDetailsLength?.active || 0}
            icon={<People />}
            trend={stats.usersLengthPercentageChange}
            color="var(--info)"
            showChart={true}
            chartData={Object.values(stats.usersLengthInSixMonth).reverse()}
            currentStats={[
              {
                label: "Faol",
                value: stats.usersDetails?.active?.toString() || "0",
                color: "var(--success)",
              },
              {
                label: "Nofaol",
                value: stats.usersDetails?.inactive?.toString() || "0",
                color: "var(--error)",
              },
            ]}
            totalStats={[
              {
                label: "Jami faol",
                value: stats.usersDetailsLength?.active?.toString() || "0",
                color: "var(--success)",
              },
              {
                label: "Jami nofaol",
                value: stats.usersDetailsLength?.inactive?.toString() || "0",
                color: "var(--error)",
              },
            ]}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 3 }}
        sx={{
          mt: { xs: 2, sm: 2, md: 3 },
          flexDirection: { xs: "column-reverse", md: "row" },
        }}
      >
        <Grid item xs={12} md={7.2}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              // height: {
              //   xs: "auto",
              //   lg: "calc(100vh - 270px)",
              // },
              overflow: "auto",
              bgcolor: "var(--bg-paper)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
              transition: "var(--transition-all)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 600, color: "var(--text-primary)" }}
            >
              So'nggi buyurtmalar
            </Typography>
            <TableContainer
              sx={{
                overflow: "auto",
                maxHeight: { xs: "400px", lg: "none" },
              }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  "& .MuiTableCell-root": {
                    px: { xs: 1, sm: 2 },
                    py: { xs: 1.5, sm: 2 },
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 0, color: "var(--text-secondary)" }}>
                      Buyurtma
                    </TableCell>
                    <TableCell sx={{ color: "var(--text-secondary)" }}>
                      Mijoz
                    </TableCell>
                    <TableCell sx={{ color: "var(--text-secondary)" }}>
                      Summa
                    </TableCell>
                    <TableCell sx={{ color: "var(--text-secondary)" }}>
                      Holat
                    </TableCell>
                    <TableCell sx={{ color: "var(--text-secondary)" }}>
                      Sana
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.tenLastOrders?.map((order) => (
                    <TableRow
                      key={order._id}
                      onClick={() => handleOrderClick(order.orderNumber)}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: isDark
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                        },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell
                        sx={{
                          pl: 0,
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          }}
                        >
                          #{order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "var(--text-primary)",
                            fontWeight: 500,
                            "&:hover": {
                              color: "var(--primary-main)",
                            },
                            transition: "color 0.2s",
                          }}
                        >
                          {order.userName} {order.userSurname}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        <Typography
                          sx={{ color: "var(--text-primary)", fontWeight: 500 }}
                        >
                          {formatPrice(order.total)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        <Chip
                          label={getStatusColor(order.status).label}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(order.status)
                              .backgroundColor,
                            color: getStatusColor(order.status).color,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text-secondary)" }}
                        >
                          {formatDate(order.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4.8}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // height: {
              //   xs: "auto",
              //   lg: "calc(100vh - 270px)",
              // },
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                flex: { xs: "none", lg: 1 },
                minHeight: { xs: "300px", sm: "350px" },
                bgcolor: "var(--bg-paper)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid",
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                transition: "var(--transition-all)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: 1, sm: 0 },
                  mb: { xs: 2, sm: 3 },
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  10 kunlik buyurtmalar
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "13px",
                    }}
                  >
                    Soni
                  </Typography>
                  <Switch
                    size="small"
                    checked={chartType === "total"}
                    onChange={() =>
                      setChartType(chartType === "count" ? "total" : "count")
                    }
                    sx={{
                      "& .MuiSwitch-switchBase": {
                        color: "rgb(99, 102, 241)",
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                        },
                        "&.Mui-checked": {
                          color: "var(--warning)",
                          "&:hover": {
                            backgroundColor: "var(--warning-light)",
                          },
                          "& + .MuiSwitch-track": {
                            backgroundColor: "var(--warning)",
                          },
                        },
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor: "rgb(99, 102, 241)",
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "13px",
                    }}
                  >
                    Summasi
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  height: { xs: "250px", sm: "200px" },
                  width: "100%",
                }}
              >
                <Line
                  data={{
                    labels: getLastTenDays(),
                    datasets: [
                      {
                        label:
                          chartType === "count"
                            ? "Buyurtmalar soni"
                            : "Buyurtmalar summasi",
                        data:
                          chartType === "count"
                            ? Object.values(
                                stats.lastSoldOrdersInTenDays
                              ).reverse()
                            : Object.values(
                                stats.lastSoldOrdersTotalInTenDays
                              ).reverse(),
                        fill: {
                          target: "origin",
                          above: {
                            color: {
                              createLinearGradient: (ctx) => {
                                const gradient = ctx.createLinearGradient(
                                  0,
                                  0,
                                  0,
                                  ctx.height
                                );
                                const color = isDark
                                  ? "#fff"
                                  : chartType === "count"
                                  ? "rgb(99, 102, 241)"
                                  : "rgb(249, 115, 22)";
                                gradient.addColorStop(0, `${color}30`);
                                gradient.addColorStop(0.5, `${color}15`);
                                gradient.addColorStop(1, `${color}05`);
                                return gradient;
                              },
                            },
                          },
                        },
                        borderColor: isDark
                          ? "#fff"
                          : chartType === "count"
                          ? "rgb(99, 102, 241)"
                          : "rgb(249, 115, 22)",
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : chartType === "count"
                          ? "rgba(99, 102, 241, 0.5)"
                          : "rgba(249, 115, 22, 0.5)",
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                        pointBackgroundColor: isDark
                          ? "#fff"
                          : chartType === "count"
                          ? "rgb(99, 102, 241)"
                          : "rgb(249, 115, 22)",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: isDark
                          ? "#fff"
                          : chartType === "count"
                          ? "rgb(99, 102, 241)"
                          : "rgb(249, 115, 22)",
                        pointHoverBorderColor: "#fff",
                        pointHoverBorderWidth: 3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: "index",
                      intersect: false,
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: isDark
                          ? "rgba(0, 0, 0, 0.9)"
                          : "rgba(255, 255, 255, 0.95)",
                        titleColor: isDark ? "#fff" : "#000",
                        bodyColor: isDark ? "#fff" : "#000",
                        borderColor: isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                          title: (items) => items[0].label,
                          label: (item) => {
                            return chartType === "count"
                              ? `Buyurtmalar: ${item.formattedValue} ta`
                              : `Summa: ${formatPrice(item.raw)}`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: isDark ? "#fff" : "#000",
                          font: {
                            size: 11,
                          },
                        },
                      },
                      y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        beginAtZero: true,
                        grid: {
                          color: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                          color: isDark ? "#fff" : "#000",
                          callback: (value) =>
                            chartType === "total"
                              ? Number.isInteger(value)
                                ? formatPrice(value)
                                : ""
                              : Number.isInteger(value)
                              ? value + " ta"
                              : "",
                          font: {
                            size: 11,
                          },
                          stepSize: 1,
                          padding: 8,
                        },
                        border: {
                          display: false,
                        },
                      },
                      y1: {
                        type: "linear",
                        display: true,
                        position: "right",
                        beginAtZero: true,
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          color: isDark ? "#fff" : "#000",
                          callback: (value) =>
                            chartType === "total"
                              ? formatPrice(value)
                              : Number.isInteger(value)
                              ? value + " ta"
                              : "",
                          font: {
                            size: 11,
                          },
                          stepSize: chartType === "total" ? undefined : 1,
                          padding: 8,
                          maxRotation: 0,
                          minRotation: 0,
                          autoSkip: true,
                          autoSkipPadding: 15,
                        },
                        border: {
                          display: false,
                        },
                        min: 0,
                        max:
                          chartType === "total"
                            ? Math.max(
                                ...Object.values(
                                  stats.lastSoldOrdersTotalInTenDays
                                )
                              )
                            : Math.max(
                                ...Object.values(stats.lastSoldOrdersInTenDays)
                              ),
                      },
                    },
                  }}
                />
              </Box>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                flex: { xs: "none", lg: 1 },
                bgcolor: "var(--bg-paper)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid",
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                transition: "var(--transition-all)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, fontWeight: 600, color: "var(--text-primary)" }}
              >
                Yangi mijozlar
              </Typography>
              <TableContainer
                sx={{
                  overflow: "auto",
                  maxHeight: { xs: "300px", lg: "none" },
                }}
              >
                <Table
                  sx={{
                    "& .MuiTableCell-root": {
                      px: { xs: 1, sm: 2 },
                      py: { xs: 1.5, sm: 2 },
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          pl: 0,
                          color: "var(--text-secondary)",
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        Foydalanuvchi
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "var(--text-secondary)",
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "var(--text-secondary)",
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "#dfe1e2",
                        }}
                      >
                        Amallar
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.tenLastUsers?.map((user) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          "&:hover": {
                            backgroundColor: isDark
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.02)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            pl: 0,
                            borderColor: isDark
                              ? "rgba(255, 255, 255, 0.1)"
                              : "#dfe1e2",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "var(--primary-main)",
                                mr: 2,
                              }}
                            >
                              {user.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{
                                  color: "var(--text-primary)",
                                  fontWeight: 500,
                                }}
                              >
                                {user.name} {user.surname}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "var(--text-secondary)" }}
                              >
                                {formatDate(user.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderColor: isDark
                              ? "rgba(255, 255, 255, 0.1)"
                              : "#dfe1e2",
                          }}
                        >
                          <Chip
                            label={
                              user.isVerified
                                ? "Tasdiqlangan"
                                : "Tasdiqlanmagan"
                            }
                            size="small"
                            sx={{
                              bgcolor: user.isVerified
                                ? "rgba(34, 197, 94, 0.1)"
                                : "rgba(239, 68, 68, 0.1)",
                              color: user.isVerified
                                ? "var(--success)"
                                : "var(--error)",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderColor: isDark
                              ? "rgba(255, 255, 255, 0.1)"
                              : "#dfe1e2",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleVerify(user._id, user.isVerified)
                            }
                            sx={{
                              color: user.isVerified
                                ? "var(--error)"
                                : "var(--success)",
                              p: 1,
                              "&:hover": {
                                bgcolor: user.isVerified
                                  ? "rgba(239, 68, 68, 0.1)"
                                  : "rgba(34, 197, 94, 0.1)",
                              },
                            }}
                          >
                            {user.isVerified ? (
                              <UnverifyIcon fontSize="small" />
                            ) : (
                              <VerifyIcon fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
