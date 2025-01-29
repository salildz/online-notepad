import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { username, email, password });
      navigate("/login"); // Kayıt başarılı olursa giriş sayfasına yönlendir
    } catch (err) {
      setError("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Kayıt Ol</Typography>
        <TextField label="Kullanıcı Adı" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="E-posta" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Şifre" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>Kayıt Ol</Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
