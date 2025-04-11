import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Box, CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material";
import DarkLightToggle from "./components/DarkLightToggle";
import LanguageToggle from "./components/LanguageToggle";
import { AuthProvider } from "./components/AuthContext";
import { ErrorProvider, useError } from "./components/ErrorContext";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import RootRedirect from "./components/RootRedirect";
import NotesPage from "./pages/NotesPage";
import { LoadingProvider, useLoading } from "./components/LoadingContext";
import VerifyEmail from "./pages/VerifyEmail";
import { bindLoading, bindErrorHandler } from "./components/Api";

function AppWithLoadingBar() {
  const { setIsLoading } = useLoading();
  const { showError } = useError();

  useEffect(() => {
    // Connect the loading and error handlers to the API
    bindLoading(setIsLoading);
    bindErrorHandler(showError);
  }, [setIsLoading, showError]);

  return (
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
          path="/verify-email"
          element={<VerifyEmail />}
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
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <LanguageToggle />
          <DarkLightToggle />
        </Box>
        <AppWithLoadingBar />
      </LoadingProvider>
    </MUIThemeProvider>
  );
}

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
