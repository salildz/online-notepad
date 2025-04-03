import { useEffect, useState } from "react";
import { Button, Typography, FormControl } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, setErrorHandler } from "../components/Api";
import { useTranslation } from "../../node_modules/react-i18next";
import { useError } from "../components/ErrorContext";
import AuthTitle from "../components/typography/AuthTitle";
import AuthInput from "../components/form_element/AuthInput";
import AuthContainer from "../components/container/AuthContainer";

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
    <AuthContainer>
      <AuthTitle text={t("auth.registerTitle")} />
      <FormControl
        fullWidth
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
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
          onClick={handleRegister}
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
