import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  RestoreFromTrash as RestoreIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import config from "../config";

function DeletedProducts() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const fetchDeletedProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getDeletedProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm("Mahsulotni qayta tiklashni xohlaysizmi?")) {
      try {
        await api.restoreProduct(id);
        fetchDeletedProducts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
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

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/products")}
            sx={{
              color: "var(--text-secondary)",
              mb: 2,
              "&:hover": {
                backgroundColor: "var(--bg-hover)",
              },
            }}
          >
            Orqaga
          </Button>
          <Typography
            variant="h4"
            sx={{
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            O'chirilgan mahsulotlar
          </Typography>
        </Box>
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
          transition: "all 0.2s ease-in-out",
          "& .MuiTableCell-root": {
            borderBottom: isDark
              ? "1px solid rgb(45, 55, 72)"
              : "1px solid #dfe1e2",
            transition: "all 0.2s ease-in-out",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Rasm
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Mahsulot nomi
              </TableCell>
              <TableCell
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Kategoriya
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Narx
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Zaxira
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
            {products.map((product) => (
              <TableRow
                key={product._id}
                sx={{
                  "&:hover": {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                  },
                }}
              >
                <TableCell>
                  <Avatar
                    src={
                      product.images?.[0]
                        ? product.images[0].startsWith("http")
                          ? product.images[0]
                          : `${config.baseUrl}/${product.images[0]}`
                        : null
                    }
                    alt={product.name}
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
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "var(--text-primary)" }}>
                  {product.name}
                </TableCell>
                <TableCell sx={{ color: "var(--text-primary)" }}>
                  {product.category || "Boshqa"}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--text-primary)" }}
                >
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "var(--text-primary)" }}
                >
                  {product.stock} dona
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleRestore(product._id)}
                    sx={{
                      color: "var(--success)",
                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(34, 197, 94, 0.1)",
                      },
                    }}
                  >
                    <RestoreIcon />
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

export default DeletedProducts; 