import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Box, FormControl } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, setErrorHandler } from "../components/Api";
import { useTranslation } from "../../node_modules/react-i18next";
import { useError } from "../components/ErrorContext";

const RegisterPage = () => {
  const { t } = useTranslation();
  const { showError } = useError();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrorHandler(showError);
  }, [showError]);

  const handleRegister = async () => {
    try {
      await registerUser(username, email, password);
      navigate("/login");
    } catch (err) {
      showError("auth.registrationFailed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          mb={10}
          textTransform="capitalize"
        >
          {t("auth.registerTitle")}
        </Typography>
        <FormControl fullWidth>
          <TextField
            id="username"
            label={t("auth.username")}
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            autoComplete="username"
            autoFocus
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="email"
            label={t("auth.email")}
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="password"
            label={t("auth.password")}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </FormControl>
        <Button
          id="registerButton"
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          {t("auth.register")}
        </Button>
        <Typography sx={{ mt: 2 }}>
          {t("auth.alreadyHaveAccount")} <Link to="/login">{t("auth.login")}</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
