import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const data = await api.login(username, password);
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
