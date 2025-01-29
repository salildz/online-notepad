import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotesPage from "./pages/NotesPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />} />
        <Route path="/" element={user ? <NotesPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
