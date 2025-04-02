import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Box, Button, createTheme, CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import DarkLightToggle from "./components/DarkLightToggle";
import LanguageToggle from "./components/LanguageToggle";
import { AuthProvider } from "./components/AuthContext";
import { ErrorProvider } from "./components/ErrorContext";
import RootRedirect from "./components/RootRedirect";
import { Note } from "@mui/icons-material";
import NotesPage from "./pages/NotesPage";
import "./translations/i18n";

function App() {
  const [mode, setMode] = useState("dark");
  const theme = createTheme({
    palette: {
      mode, // 'light' or 'dark'
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  });

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ErrorProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LanguageToggle />
            <DarkLightToggle
              mode={mode}
              toggleMode={toggleMode}
            />
          </Box>
          <Router>
            <Routes>
              <Route
                path="/"
                element={<RootRedirect />}
              />
              <Route
                path="/login"
                element={<LoginPage />}
              />
              <Route
                path="/register"
                element={<RegisterPage />}
              />
              <Route
                path="/note"
                element={<NotesPage />}
              />
              <Route
                path="*"
                element={<Navigate to="/" />}
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
