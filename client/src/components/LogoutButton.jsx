import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./Api";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";

const LogoutButton = () => {
  const { t } = useTranslation(["translation", "serverErrors"]);
  const navigate = useNavigate();
  const { clearToken } = useAuth();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      clearToken();
      navigate("/login");
    } catch (error) {
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
      sx={{ textTransform: "none", fontWeight: "bold" }}
    >
      {t("common.logout")}
    </Button>
  );
};

export default LogoutButton;
