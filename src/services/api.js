import config from "../config";

const api = {
  baseURL: config.apiUrl,

  // Auth
  login: async (username, password) => {
    const response = await fetch(`${config.apiUrl}/admin/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    // Store accessToken in localStorage
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("accessToken"); // Remove accessToken on logout
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await fetch(`${config.apiUrl}/admin/dashboard`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use accessToken
      },
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard stats");
    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${config.apiUrl}/admin/product`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use accessToken
      },
    });
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  createProduct: async (formData) => {
    const response = await fetch(`${config.apiUrl}/admin/product`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  updateProduct: async (id, formData) => {
    const form = new FormData();

    // Add updated fields
    if (formData.name) form.append("name", formData.name);
    if (formData.price) form.append("price", formData.price);
    if (formData.size) form.append("size", formData.size);
    if (formData.quantityInBox)
      form.append("quantityInBox", formData.quantityInBox);
    if (formData.description) form.append("description", formData.description);
    if (formData.stock) form.append("stock", formData.stock);

    // Add existing photos
    if (formData.existingPhotos) {
      formData.existingPhotos.forEach((photo) => {
        form.append("existingPhotos", photo);
      });
    }

    // Add new photos if any
    if (formData.photos) {
      formData.photos.forEach((photo) => {
        form.append("photos", photo);
      });
    }

    const response = await fetch(`${config.apiUrl}/admin/product/${id}`, {
      method: "PUT",
      body: form,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${config.apiUrl}/admin/product/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use accessToken
      },
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  },

  deleteProductImage: async (productId, imageIndex) => {
    const response = await fetch(
      `${config.apiUrl}/admin/product/${productId}/image/${imageIndex}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to delete product image");
    return response.json();
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${config.apiUrl}/admin/category`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use accessToken
      },
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${config.apiUrl}/admin/order`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  deleteOrder: async (id) => {
    const response = await fetch(`${config.apiUrl}/admin/order/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete order");
    return response.json();
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await fetch(
      `${config.apiUrl}/admin/order/${orderNumber}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch order");
    return response.json();
  },

  updateOrderStatus: async (orderNumber, status) => {
    const response = await fetch(
      `${config.apiUrl}/admin/order/${orderNumber}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) throw new Error("Failed to update order status");
    return response.json();
  },

  getProductById: async (id) => {
    const response = await fetch(`${config.apiUrl}/admin/product/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  // Users
  getUsers: async () => {
    const response = await fetch(`${config.apiUrl}/admin/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  updateUserStatus: async (userId, isVerified) => {
    const response = await fetch(`${config.apiUrl}/admin/user/${userId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ isVerified }),
    });
    if (!response.ok) throw new Error("Failed to update user status");
    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${config.apiUrl}/admin/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return response.json();
  },

  // Deleted Products
  getDeletedProducts: async () => {
    const response = await fetch(`${config.apiUrl}/admin/product/deleted`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch deleted products");
    return response.json();
  },

  restoreProduct: async (id) => {
    const response = await fetch(
      `${config.apiUrl}/admin/product/${id}/restore`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to restore product");
    return response.json();
  },
};

export default api;
