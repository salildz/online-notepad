import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { refreshAccessToken, setAxiosToken, logoutUser } from "./Api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const extractUserInfo = (newToken) => {
    if (newToken) {
      try {
        const decoded = jwtDecode(newToken);
        setUsername(decoded.username || "");
        setEmail(decoded.email || "");
      } catch (error) {
        console.error("Token çözümleme hatası:", error);
      }
    }
  };

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      setTokenState(newToken);
      setAxiosToken(newToken);
      extractUserInfo(newToken);
    } else {
      localStorage.removeItem("accessToken");
      setTokenState(null);
      setAxiosToken(null);
      setUsername("");
      setEmail("");
    }
  };

  useEffect(() => {
    // No need to check token on login page
    if (window.location.pathname === "/login" || window.location.pathname === "/register") {
      setIsLoading(false);
      return;
    }

    // Token check
    const checkToken = async () => {
      try {
        // Check if token is stored in local storage
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          setTokenState(storedToken);
          setAxiosToken(storedToken);
          extractUserInfo(storedToken);
          setIsLoading(false);
          return;
        }

        // If token is not stored in local storage, try to refresh it
        const newToken = await refreshAccessToken();
        if (newToken) {
          setToken(newToken);
        } else {
          // If token cannot be refreshed, clear the token
          setToken(null);
          if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/login";
          }
        }
      } catch (err) {
        console.error("Token yenileme hatası:", err);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const clearToken = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Çıkış hatası:", error);
    } finally {
      setToken(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ token, username, email, setToken, clearToken, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
