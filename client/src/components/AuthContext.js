import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { refreshAccessToken, setAxiosToken, logoutUser } from "./Api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [token, setTokenState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // If we are on the login page, we don't need to check the token.
        if (window.location.pathname === "/login") {
            setIsLoading(false);
            return;
        }
        // Check the token
        const checkToken = async () => {
            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    setTokenState(newToken);
                    setAxiosToken(newToken);
                }
            } catch (err) {
                console.error("Error while refreshing token:", err);
            } finally {
                setIsLoading(false);
            }
        };
        checkToken();
    }, []);

    const setToken = (newToken) => {
        setTokenState(newToken);
        setAxiosToken(newToken);
    };

    const clearToken = async () => {
        try {
            await logoutUser(); // Remove the token from the server
        } catch (error) {
            console.error("Logout error:", error);
        }
        setTokenState(null);
        setAxiosToken(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ token, setToken, clearToken, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};