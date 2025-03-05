import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotesPage from "./pages/NotesPage";
import { Box, Button, createTheme, CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import DarkLightToggle from "./components/DarkLightToggle";

function App() {
  const [mode, setMode] = useState("dark");
  const [user, setUser] = useState(null);

  const theme = createTheme({
    palette: {
      mode, // 'light' or 'dark'
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DarkLightToggle mode={mode} toggleMode={toggleMode} />
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />} />
          <Route path="/" element={user ? <NotesPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
