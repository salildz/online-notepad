import { useEffect, useState } from "react";
import { Button, Typography, FormControl } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../components/Api";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "react-i18next";
import { useError } from "../components/ErrorContext";
import AuthTitle from "../components/typography/AuthTitle";
import AuthInput from "../components/form_element/AuthInput";
import AuthContainer from "../components/container/AuthContainer";

const LoginPage = () => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const { showError } = useError();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  /*   useEffect(() => {
    setErrorHandler(showError);
  }, [showError]); */

  const handleLogin = async () => {
    try {
      const res = await loginUser(identifier, password);
      setToken(res.accessToken);
      navigate("/note");
    } catch (err) {
      const errorResponse = err.response?.data?.message || "auth.loginFailed";
      if (errorResponse === "Please verify your email before logging in.") {
        showError(t("auth.verifyEmail"));
      } else {
        showError(t("auth.loginFailed"));
      }
    }
  };

  return (
    <AuthContainer>
      <AuthTitle text={t("auth.loginTitle")} />
      <FormControl
        fullWidth
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <AuthInput
          id={"textField-identifier"}
          label={t("auth.emailOrUsername")}
          value={identifier}
          onChangeFunction={setIdentifier}
          type={"text"}
          autoComplete={["username", "email"]}
          autoFocus={true}
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
          id="loginButton"
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          {t("auth.login")}
        </Button>
      </FormControl>
      <Typography
        id="dontHaveAccount"
        sx={{ mt: 2 }}
      >
        {t("auth.dontHaveAccount")} <Link to="/register">{t("auth.register")}</Link>
      </Typography>
    </AuthContainer>
  );
};

export default LoginPage;
