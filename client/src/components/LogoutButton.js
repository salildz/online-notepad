import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ setUser }) => {  // setUser burada geliyor!
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'ı temizle
    setUser(null); // Kullanıcı bilgisini sıfırla
    navigate("/login"); // Giriş sayfasına yönlendir
  };

  return (
    <Button variant="contained" color="error" onClick={handleLogout}>
      Çıkış Yap
    </Button>
  );
};

export default LogoutButton;
