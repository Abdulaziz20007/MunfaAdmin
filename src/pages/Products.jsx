import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
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
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableSortLabel,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import config from "../config";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";

// Update dummy data with more categories
const initialProducts = [
  {
    id: 1,
    name: "Simsiz Quloqchinlar",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80",
    category: "Elektronika",
    price: 1200000,
    stock: 45,
    status: "Mavjud",
  },
  {
    id: 2,
    name: "Aqlli Soat",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80",
    category: "Gadjetlar",
    price: 2400000,
    stock: 0,
    status: "Tugagan",
  },
  {
    id: 3,
    name: "Sport Poyabzali",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
    category: "Poyabzallar",
    price: 850000,
    stock: 28,
    status: "Mavjud",
  },
  {
    id: 4,
    name: "Qahva Mashinasi",
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=100&q=80",
    category: "Maishiy texnika",
    price: 1800000,
    stock: 12,
    status: "Kam Qoldi",
  },
  {
    id: 5,
    name: "Ryukzak",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80",
    category: "Sumkalar",
    price: 450000,
    stock: 60,
    status: "Mavjud",
  },
  {
    id: 6,
    name: "Noutbuk Acer",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&q=80",
    category: "Kompyuterlar",
    price: 8500000,
    stock: 15,
    status: "Mavjud",
  },
  {
    id: 7,
    name: "Samsung Galaxy S23",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&q=80",
    category: "Telefonlar",
    price: 12000000,
    stock: 8,
    status: "Kam Qoldi",
  },
  {
    id: 8,
    name: "Robot Changyutgich",
    image:
      "https://images.unsplash.com/photo-1589922585618-4d866fbc873a?w=100&q=80",
    category: "Maishiy texnika",
    price: 3200000,
    stock: 0,
    status: "Tugagan",
  },
  {
    id: 9,
    name: "Mikrotolqinli Pech",
    image:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=100&q=80",
    category: "Maishiy texnika",
    price: 1500000,
    stock: 22,
    status: "Mavjud",
  },
  {
    id: 10,
    name: "Ayollar Sumkasi",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&q=80",
    category: "Sumkalar",
    price: 720000,
    stock: 35,
    status: "Mavjud",
  },
];

// Add this component at the top level of the file
const StyledSelect = ({ children, ...props }) => (
  <Select
    {...props}
    MenuProps={{
      disableScrollLock: true, // This prevents the body style changes
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

// Add these helper functions
const moveItem = (array, fromIndex, toIndex) => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
};

// Update the AddProductModal component
const AddProductModal = ({ open, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photos, setPhotos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    quantityInBox: "",
    description: "",
    stock: "0",
  });

  // Add textFieldStyle object
  const textFieldStyle = {
    "& .MuiInputBase-root": {
      bgcolor: isDark ? "var(--bg-default)" : "var(--bg-input)",
    },
    "& .MuiInputBase-input": {
      color: "var(--text-primary)",
      // Hide arrows in number inputs
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&[type=number]": {
        "-moz-appearance": "textfield", // Firefox
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--text-secondary)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--primary-main)",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }
    setPhotos(files);

    // Create image previews
    const previews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
    }));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const form = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      // Append photos
      photos.forEach((photo) => {
        form.append("photos", photo);
      });

      await onSubmit(form);
      setSuccess("Product added successfully!");

      // Reset form
      setFormData({
        name: "",
        price: "",
        size: "",
        quantityInBox: "",
        description: "",
        stock: "0",
      });
      setPhotos([]);
      setImagePreviews([]);

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (error) {
      setError(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "var(--bg-paper)",
          backgroundImage: "none",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: "var(--text-primary)" }}>
          Yangi mahsulot qo'shish
        </DialogTitle>
        <DialogContent>
          {error && (
            <Typography
              sx={{
                color: "var(--error)",
                bgcolor: isDark
                  ? "rgba(239, 68, 68, 0.2)"
                  : "rgba(239, 68, 68, 0.1)",
                p: 1,
                borderRadius: 1,
                mb: 2,
              }}
            >
              {error}
            </Typography>
          )}

          {success && (
            <Typography
              sx={{
                color: "var(--success)",
                bgcolor: isDark
                  ? "rgba(34, 197, 94, 0.2)"
                  : "rgba(34, 197, 94, 0.1)",
                p: 1,
                borderRadius: 1,
                mb: 2,
              }}
            >
              {success}
            </Typography>
          )}

          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nomi"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              label="Narxi"
              name="price"
              type="number"
              required
              value={formData.price}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              label="O'lchami"
              name="size"
              required
              value={formData.size}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              label="Qutidagi soni"
              name="quantityInBox"
              type="number"
              required
              value={formData.quantityInBox}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              label="Zaxiradagi soni"
              name="stock"
              type="number"
              required
              value={formData.stock}
              onChange={handleChange}
              sx={textFieldStyle}
            />
            <TextField
              label="Tavsif"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              sx={textFieldStyle}
            />

            {/* Image upload section */}
            <Box>
              <Typography sx={{ mb: 1, color: "var(--text-primary)" }}>
                Rasmlar (max 5)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "var(--primary-main)",
                  color: "var(--primary-main)",
                }}
              >
                Rasmlarni tanlash
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                  required
                />
              </Button>

              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {imagePreviews.map((preview) => (
                    <Box
                      key={preview.id}
                      sx={{
                        position: "relative",
                        paddingTop: "100%",
                      }}
                    >
                      <img
                        src={preview.url}
                        alt="Preview"
                        style={{
                          position: "absolute",
                          top: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "var(--radius-md)",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} sx={{ color: "var(--text-secondary)" }}>
            Bekor qilish
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "var(--primary-main)",
              "&:hover": {
                bgcolor: "var(--primary-dark)",
              },
              "&.Mui-disabled": {
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.12)",
                color: isDark
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            {loading ? "Qo'shilmoqda..." : "Qo'shish"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Add these constants at the top of the file
const STOCK_STATUS = {
  ALL: "all",
  IN_STOCK: "in_stock", // > 10
  LOW_STOCK: "low_stock", // 1-10
  OUT_OF_STOCK: "out_of_stock", // 0
};

function Products() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(STOCK_STATUS.ALL);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const navigate = useNavigate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setAlertConfig({
      title: "Mahsulotni o'chirish",
      message: "Mahsulotni o'chirishni xohlaysizmi?",
      type: "error",
      onConfirm: async () => {
        try {
          await api.deleteProduct(id);
          fetchProducts();
        } catch (err) {
          setError(err.message);
        }
      },
    });
    setAlertOpen(true);
  };

  const getProductStatus = (stock) => {
    if (stock === 0) return STOCK_STATUS.OUT_OF_STOCK;
    if (stock <= 10) return STOCK_STATUS.LOW_STOCK;
    return STOCK_STATUS.IN_STOCK;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const transformProduct = (product) => ({
    id: product._id,
    name: product.name,
    image: product.images?.[0]
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `${config.baseUrl}/${product.images[0]}`
      : null,
    price: product.price,
    quantity: product.stock || 0,
    stock: product.stock || 0,
    status: getProductStatus(product.stock || 0),
    createdAt: product.createdAt,
  });

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products
      .map(transformProduct)
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Add status filtering
    if (statusFilter !== STOCK_STATUS.ALL) {
      filtered = filtered.filter((product) => {
        const status = getProductStatus(product.stock);
        return status === statusFilter;
      });
    }

    // Sort the filtered products
    return filtered.sort((a, b) => {
      const isAsc = order === "asc";

      // Handle numeric values
      if (orderBy === "price" || orderBy === "stock") {
        return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
      }

      // Handle status sorting
      if (orderBy === "status") {
        const statusOrder = {
          [STOCK_STATUS.IN_STOCK]: 1,
          [STOCK_STATUS.LOW_STOCK]: 2,
          [STOCK_STATUS.OUT_OF_STOCK]: 3,
        };
        return isAsc
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }

      // Handle string values (name, category)
      return isAsc
        ? a[orderBy].toString().localeCompare(b[orderBy].toString())
        : b[orderBy].toString().localeCompare(a[orderBy].toString());
    });
  }, [products, searchTerm, statusFilter, orderBy, order]);

  const getStatusColor = (status) => {
    switch (status) {
      case STOCK_STATUS.IN_STOCK:
        return {
          backgroundColor: isDark
            ? "rgba(34, 197, 94, 0.2)"
            : "rgba(34, 197, 94, 0.1)",
          color: "var(--success)",
        };
      case STOCK_STATUS.LOW_STOCK:
        return {
          backgroundColor: isDark
            ? "rgba(245, 158, 11, 0.2)"
            : "rgba(245, 158, 11, 0.1)",
          color: "var(--warning)",
        };
      case STOCK_STATUS.OUT_OF_STOCK:
        return {
          backgroundColor: isDark
            ? "rgba(239, 68, 68, 0.2)"
            : "rgba(239, 68, 68, 0.1)",
          color: "var(--error)",
        };
      default:
        return {
          backgroundColor: "var(--bg-hover)",
          color: "var(--text-secondary)",
        };
    }
  };

  // Format price to Uzbek So'm
  const formatPrice = (price) => {
    return (
      new Intl.NumberFormat("uz-UZ", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price) + " so'm"
    );
  };

  const handleAddProduct = async (formData) => {
    try {
      await api.createProduct(formData);
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error("Failed to add product:", error);
    }
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
            Mahsulotlar
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => navigate("/products/deleted")}
            sx={{
              borderColor: "var(--error)",
              color: "var(--error)",
              "&:hover": {
                borderColor: "var(--error)",
                backgroundColor: isDark
                  ? "rgba(239, 68, 68, 0.2)"
                  : "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            O'chirilgan mahsulotlar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{
              bgcolor: "var(--primary-main)",
              "&:hover": {
                bgcolor: "var(--primary-dark)",
              },
            }}
          >
            Mahsulot qo'shish
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          backgroundColor: "var(--bg-paper)",
          padding: { xs: 2, sm: 3 },
          borderRadius: "var(--radius-lg)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "var(--shadow-md)",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <TextField
          placeholder="Mahsulotlarni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "var(--text-secondary)" }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: isDark ? "var(--bg-default)" : "var(--bg-input)",
              borderRadius: "var(--radius-lg)",
              transition: "all 0.2s ease-in-out",
              "& fieldset": {
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.2s ease-in-out",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-main) !important",
              },
              "& .MuiInputBase-input": {
                color: "var(--text-primary)",
                padding: "12px 14px",
                transition: "color 0.2s ease-in-out",
                "&::placeholder": {
                  color: "var(--text-secondary)",
                  opacity: 1,
                  transition: "color 0.2s ease-in-out",
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
              transition: "all 0.2s ease-in-out",
              "& fieldset": {
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.2s ease-in-out",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-main) !important",
              },
              "& .MuiSelect-select": {
                padding: "12px 14px",
                transition: "color 0.2s ease-in-out",
              },
              "& .MuiSvgIcon-root": {
                color: "var(--text-secondary)",
                transition: "color 0.2s ease-in-out",
              },
            }}
          >
            <MenuItem value={STOCK_STATUS.ALL}>Barcha Holatlar</MenuItem>
            <MenuItem value={STOCK_STATUS.IN_STOCK}>Mavjud</MenuItem>
            <MenuItem value={STOCK_STATUS.LOW_STOCK}>Kam qoldi</MenuItem>
            <MenuItem value={STOCK_STATUS.OUT_OF_STOCK}>Tugagan</MenuItem>
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
          transition: "all 0.2s ease-in-out",
          overflow: "auto",
          "& .MuiTableCell-root": {
            borderBottom: isDark
              ? "1px solid rgb(45, 55, 72)"
              : "1px solid #dfe1e2",
            transition: "all 0.2s ease-in-out",
          },
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
              }}
            >
              <TableCell
                sx={{
                  width: 60,
                  borderColor: isDark ? "rgb(45, 55, 72)" : "#dfe1e2",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Rasm
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleSort("name")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Mahsulot Nomi
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? order : "asc"}
                  onClick={() => handleSort("price")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Narx
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "stock"}
                  direction={orderBy === "stock" ? order : "asc"}
                  onClick={() => handleSort("stock")}
                  sx={{
                    color: "var(--text-primary) !important",
                    fontWeight: 600,
                    "& .MuiTableSortLabel-icon": {
                      color: "var(--text-primary) !important",
                    },
                  }}
                >
                  Zaxira
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
              <TableCell
                align="right"
                sx={{
                  borderColor: isDark ? "rgb(45, 55, 72)" : "#dfe1e2",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Sana
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  borderColor: isDark ? "rgb(45, 55, 72)" : "#dfe1e2",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                Amallar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedProducts.map((product) => (
              <TableRow
                key={product.id}
                sx={{
                  "&:hover": {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                  },
                  transition: "var(--transition-bg)",
                }}
              >
                <TableCell>
                  <Avatar
                    src={product.image}
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
                <TableCell
                  sx={{
                    borderColor: isDark ? "rgb(45, 55, 72)" : "#dfe1e2",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {product.name}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderColor: isDark ? "rgb(45, 55, 72)" : "#dfe1e2",
                    color: "var(--text-primary)",
                  }}
                >
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderColor: isDark ? "rgb(45, 55, 72)" : "#dfe1e2",
                    color: "var(--text-primary)",
                  }}
                >
                  {product.quantity} dona
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      getProductStatus(product.stock) === STOCK_STATUS.IN_STOCK
                        ? "Mavjud"
                        : getProductStatus(product.stock) ===
                          STOCK_STATUS.LOW_STOCK
                        ? "Kam qoldi"
                        : "Tugagan"
                    }
                    sx={{
                      ...getStatusColor(getProductStatus(product.stock)),
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderColor: isDark ? "rgb(45, 55, 72)" : "#dfe1e2",
                    color: "var(--text-primary)",
                  }}
                >
                  {formatDate(product.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/products/${product.id}`)}
                    sx={{
                      color: "var(--primary-main)",
                      p: 1,
                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(59, 130, 246, 0.1)",
                        transform: "translateY(-1px)",
                      },
                      transition: "var(--transition-all)",
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "var(--error)",
                      ml: 1,
                      p: 1,
                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(239, 68, 68, 0.1)",
                        transform: "translateY(-1px)",
                      },
                      transition: "var(--transition-all)",
                    }}
                    onClick={() => handleDelete(product.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      <CustomAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
      />
    </Box>
  );
}

export default Products;
