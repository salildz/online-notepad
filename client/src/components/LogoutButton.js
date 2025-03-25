import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./Api";

// LogoutButton component that takes setUser as a prop
const LogoutButton = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    logoutUser();
    //navigate("/login");
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
