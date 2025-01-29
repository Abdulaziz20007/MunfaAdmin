import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
  Grid,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import config from "../config";
import CustomAlert from "../components/CustomAlert";

function SingleProduct() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletedImageIndexes, setDeletedImageIndexes] = useState([]);
  const [reorderedImages, setReorderedImages] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProductById(productId);
      setProduct(data);
      setReorderedImages(data.images);
      setEditedData({
        name: data.name,
        price: data.price,
        size: data.size,
        quantityInBox: data.quantityInBox,
        description: data.description,
        stock: data.stock,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleDeleteImage = (index) => {
    setAlertConfig({
      title: "Rasmni o'chirish",
      message: "Rasmni o'chirishni xohlaysizmi?",
      type: "warning",
      onConfirm: () => {
        setDeletedImageIndexes((prev) => [...prev, index]);
      },
    });
    setAlertOpen(true);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...reorderedImages];
    const [movedItem] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedItem);
    setReorderedImages(newImages);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = {
        ...editedData,
        photos: newImages,
        existingPhotos: reorderedImages?.filter(
          (_, index) => !deletedImageIndexes.includes(index)
        ),
      };
      await api.updateProduct(productId, formData);
      setEditing(false);
      setDeletedImageIndexes([]);
      setNewImages([]);
      setImagePreviews([]);
      await fetchProduct();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedData({
      name: product.name,
      price: product.price,
      size: product.size,
      quantityInBox: product.quantityInBox,
      description: product.description,
      stock: product.stock,
    });
    setNewImages([]);
    setImagePreviews([]);
    setDeletedImageIndexes([]);
    setReorderedImages(product.images);
  };

  const getStatusColor = (inStock, quantity) => {
    if (!inStock || quantity === 0) {
      return {
        color: "var(--error)",
        backgroundColor: isDark
          ? "rgba(239, 68, 68, 0.2)"
          : "rgba(239, 68, 68, 0.1)",
      };
    }
    if (quantity < 10) {
      return {
        color: "var(--warning)",
        backgroundColor: isDark
          ? "rgba(245, 158, 11, 0.2)"
          : "rgba(245, 158, 11, 0.1)",
      };
    }
    return {
      color: "var(--success)",
      backgroundColor: isDark
        ? "rgba(34, 197, 94, 0.2)"
        : "rgba(34, 197, 94, 0.1)",
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http")
      ? imagePath
      : `${config.baseUrl}/${imagePath}`;
  };

  // Create a reusable style object
  const textFieldStyle = {
    "& .MuiInputBase-root": {
      bgcolor: isDark ? "var(--bg-default)" : "var(--bg-input)",
    },
    "& .MuiInputBase-input": {
      color: "var(--text-primary)",
      "&.Mui-disabled": {
        color: "var(--text-secondary)",
        WebkitTextFillColor: "var(--text-secondary)",
      },
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
      "&.Mui-disabled": {
        color: "var(--text-secondary)",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--primary-main)",
    },
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

  if (!product) {
    return (
      <Box sx={{ p: 3, color: "var(--text-secondary)" }}>
        Mahsulot topilmadi
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          backgroundColor: "var(--bg-paper)",
          borderRadius: "var(--radius-lg)",
          boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "var(--shadow-md)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          p: 3,
        }}
      >
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
        <Box
          sx={{
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
              }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "var(--text-secondary)",
                mt: 1,
              }}
            >
              {formatPrice(product.price)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {editing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleCancelEdit}
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
                  Bekor qilish
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    bgcolor: "var(--success)",
                    "&:hover": {
                      bgcolor: "var(--success-dark)",
                    },
                  }}
                >
                  Saqlash
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
                sx={{
                  borderColor: "var(--primary-main)",
                  color: "var(--primary-main)",
                  "&:hover": {
                    borderColor: "var(--primary-main)",
                    bgcolor: isDark
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Tahrirlash
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Images Section - Move to first column */}
        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "var(--bg-paper)",
              borderRadius: "var(--radius-lg)",
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "var(--shadow-md)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "var(--text-primary)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 4,
                  height: 24,
                  backgroundColor: "var(--primary-main)",
                  borderRadius: 1,
                  display: "inline-block",
                  mr: 1,
                }}
              />
              Rasmlar
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 2,
              }}
            >
              {reorderedImages?.map(
                (image, index) =>
                  !deletedImageIndexes.includes(index) && (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        border: isDark
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "1px solid rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={
                          image.startsWith("http")
                            ? image
                            : `${config.baseUrl}/${image}`
                        }
                        alt={`Product ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {editing && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px",
                            background: "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {index > 0 && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveImage(index, index - 1);
                                }}
                                sx={{
                                  color: "#fff",
                                  "&:hover": {
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                  },
                                }}
                              >
                                <ArrowUpIcon fontSize="small" />
                              </IconButton>
                            )}
                            {index < reorderedImages.length - 1 && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveImage(index, index + 1);
                                }}
                                sx={{
                                  color: "#fff",
                                  "&:hover": {
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                  },
                                }}
                              >
                                <ArrowDownIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(index)}
                            sx={{
                              color: "#fff",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.2)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                      {index === 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: "rgba(0, 0, 0, 0.7)",
                            color: "#fff",
                            fontSize: "12px",
                            textAlign: "center",
                            py: 0.5,
                          }}
                        >
                          Asosiy rasm
                        </Box>
                      )}
                    </Box>
                  )
              )}

              {editing && (
                <Box
                  component="label"
                  sx={{
                    aspectRatio: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed",
                    borderColor: "var(--text-secondary)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "var(--primary-main)",
                      bgcolor: "var(--bg-hover)",
                    },
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <AddIcon
                    sx={{ fontSize: 40, color: "var(--text-secondary)" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--text-secondary)", mt: 1 }}
                  >
                    Rasm qo'shish
                  </Typography>
                </Box>
              )}
            </Box>

            {imagePreviews.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "var(--text-secondary)" }}
                >
                  Yangi rasmlar:
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: 2,
                  }}
                >
                  {imagePreviews.map((preview, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        border: isDark
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "1px solid rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setNewImages(newImages.filter((_, i) => i !== index));
                          setImagePreviews(
                            imagePreviews.filter((_, i) => i !== index)
                          );
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.7)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Details Section - Move to second column */}
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "var(--bg-paper)",
              borderRadius: "var(--radius-lg)",
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "var(--shadow-md)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "var(--text-primary)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 4,
                  height: 24,
                  backgroundColor: "var(--primary-main)",
                  borderRadius: 1,
                  display: "inline-block",
                  mr: 1,
                }}
              />
              Mahsulot ma'lumotlari
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Nomi"
                name="name"
                value={editing ? editedData.name : product.name}
                onChange={handleInputChange}
                disabled={!editing}
                fullWidth
                sx={textFieldStyle}
              />

              {/* First Row: Price and Size */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Narxi"
                  name="price"
                  type="number"
                  value={editing ? editedData.price : product.price}
                  onChange={handleInputChange}
                  disabled={!editing}
                  fullWidth
                  sx={textFieldStyle}
                />
                <TextField
                  label="O'lchami"
                  name="size"
                  value={editing ? editedData.size : product.size}
                  onChange={handleInputChange}
                  disabled={!editing}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>

              {/* Second Row: Box Quantity and Stock */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Qutidagi soni"
                  name="quantityInBox"
                  type="number"
                  value={
                    editing ? editedData.quantityInBox : product.quantityInBox
                  }
                  onChange={handleInputChange}
                  disabled={!editing}
                  fullWidth
                  sx={textFieldStyle}
                />
                <TextField
                  label="Zaxiradagi soni"
                  name="stock"
                  type="number"
                  value={editing ? editedData.stock : product.stock}
                  onChange={handleInputChange}
                  disabled={!editing}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>

              <TextField
                label="Tavsif"
                name="description"
                value={editing ? editedData.description : product.description}
                onChange={handleInputChange}
                disabled={!editing}
                multiline
                rows={4}
                fullWidth
                sx={textFieldStyle}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

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

export default SingleProduct;
