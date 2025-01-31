import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// LogoutButton component that takes setUser as a prop
const LogoutButton = ({ setUser }) => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from local storage
    setUser(null); // Reset user information
    navigate("/login"); // Redirect to the login page
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
