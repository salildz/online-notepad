import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser, setErrorHandler } from "../components/Api";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "../../node_modules/react-i18next";
import { useError } from "../components/ErrorContext";

const LoginPage = () => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const { showError } = useError();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrorHandler(showError);
  }, [showError]);

  const handleLogin = async () => {
    try {
      const res = await loginUser(identifier, password);
      setToken(res.accessToken);
      navigate("/note");
    } catch (err) {
      showError("auth.loginFailed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">{t("auth.loginTitle")}</Typography>
        <TextField
          label={t("auth.emailOrUsername")}
          fullWidth
          margin="normal"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <TextField
          label={t("auth.password")}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          {t("auth.login")}
        </Button>
        <Typography sx={{ mt: 2 }}>
          {t("auth.dontHaveAccount")} <Link to="/register">{t("auth.register")}</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
