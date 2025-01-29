import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";


const LoginPage = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.token);
        } catch (err) {
            setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5">Giriş Yap</Typography>
                <TextField label="E-posta" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
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
