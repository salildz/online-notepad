import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../components/Api";
import { useAuth } from "../components/AuthContext";

const LoginPage = () => {
  const { setToken } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(identifier, password);
      setToken(res.accessToken);
      navigate("/note");
    } catch (err) {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Giriş Yap</Typography>
        <TextField label="E-posta veya Kullanıcı Adı" fullWidth margin="normal" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        <TextField label="Şifre" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Giriş Yap</Button>
        <Typography sx={{ mt: 2 }}>
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;