import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes";
import SingleOrder from "./pages/SingleOrder";
import SingleProduct from "./pages/SingleProduct";
import Users from "./pages/Users";
import DeletedProducts from "./pages/DeletedProducts";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="orders/:orderNumber" element={<SingleOrder />} />
              <Route path="products/:productId" element={<SingleProduct />} />
              <Route path="products/deleted" element={<DeletedProducts />} />
            </Route>
          </Routes>
        </AuthProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
}

export default App;
