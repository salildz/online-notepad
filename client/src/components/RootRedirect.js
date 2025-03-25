import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./AuthContext";

const RootRedirect = () => {
    const { token, isLoading } = useAuth();

    // If the token is loading, show a loading spinner
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // If the token exists, redirect to the notes page
    if (token) {
        return <Navigate to="/" replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default RootRedirect;