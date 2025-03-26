import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./Api";
import { useAuth } from "./AuthContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { clearToken } = useAuth();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      clearToken(); // AuthContext'ten clearToken fonksiyonunu çağır
      navigate("/login"); // Login sayfasına yönlendir
    } catch (error) {
      console.error("Logout error:", error);
      // Hata olsa bile token'ı temizle ve login sayfasına yönlendir
      clearToken();
      navigate("/login");
    }
  };

  return (
    <Button
      size="medium"
      variant="contained"
      color="error"
      onClick={handleLogout}
      sx={{ textTransform: 'none', fontWeight: 'bold' }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;