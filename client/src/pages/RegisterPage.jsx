import { useState } from "react";
import { Button, Typography, FormControl } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../components/Api";
import { useTranslation } from "react-i18next";
import { useError } from "../components/ErrorContext";
import AuthTitle from "../components/typography/AuthTitle";
import AuthInput from "../components/form_element/AuthInput";
import AuthContainer from "../components/container/AuthContainer";

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const { showError, showInfo } = useError();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const language = i18n.language;
      await registerUser(username, email, password, language);
      showInfo(t("auth.verifyEmailAfterRegister"));
      setTimeout(() => navigate("/login"), 5000); // Redirect after 5 seconds
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  return (
    <AuthContainer>
      <AuthTitle text={t("auth.registerTitle")} />
      <FormControl
        fullWidth
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <AuthInput
          id={"textField-username"}
          label={t("auth.username")}
          value={username}
          onChangeFunction={setUsername}
          type={"text"}
          autoComplete={"username"}
          autoFocus={true}
        />
        <AuthInput
          id={"textField-email"}
          label={t("auth.email")}
          value={email}
          onChangeFunction={setEmail}
          type={"email"}
          autoComplete={"email"}
        />
        <AuthInput
          id={"textField-password"}
          label={t("auth.password")}
          value={password}
          onChangeFunction={setPassword}
          type={"password"}
          autoComplete={"password"}
        />
        <Button
          id="registerButton"
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          {t("auth.register")}
        </Button>
      </FormControl>
      <Typography sx={{ mt: 2 }}>
        {t("auth.alreadyHaveAccount")} <Link to="/login">{t("auth.login")}</Link>
      </Typography>
    </AuthContainer>
  );
};

export default RegisterPage;
