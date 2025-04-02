import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Box, CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material";
import DarkLightToggle from "./components/DarkLightToggle";
import LanguageToggle from "./components/LanguageToggle";
import { AuthProvider } from "./components/AuthContext";
import { ErrorProvider } from "./components/ErrorContext";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import RootRedirect from "./components/RootRedirect";
import NotesPage from "./pages/NotesPage";
import "./translations/i18n";

function AppContent() {
  const { theme } = useTheme();

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageToggle />
        <DarkLightToggle />
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
