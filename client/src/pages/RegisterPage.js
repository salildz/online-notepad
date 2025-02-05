import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/Api"; // api.js'den auth'u import et

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await auth.register(username, email, password); // api.js'deki register fonksiyonunu kullan
      navigate("/login"); // Kayıt başarılı olursa giriş sayfasına yönlendir
    } catch (err) {
      setError("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Kayıt Ol</Typography>
        <TextField
          label="Kullanıcı Adı"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="E-posta"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Şifre"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
          Kayıt Ol
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
