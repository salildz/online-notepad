import { useState, forwardRef, useImperativeHandle } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useTranslation } from "../../node_modules/react-i18next";

// Create a context to manage the Snackbar globally
const ErrorSnackbar = forwardRef((props, ref) => {
  const { t } = useTranslation(["serverErrors", "translation"]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Translate error messages from the server
  const translateErrorMessage = (message) => {
    // Check if the message is a known error key in our translations
    if (message.startsWith("auth.") || message.startsWith("notes.") || message.startsWith("server.")) {
      return t(message);
    }

    // Map common server error messages to our translation keys
    if (message.includes("Invalid credentials")) {
      return t("auth.invalidCredentials");
    }
    if (message.includes("User already exists")) {
      return t("auth.userExists");
    }
    if (message.includes("Notes not found")) {
      return t("notes.notFound");
    }

    // Return the original message if no translation is found
    return message;
  };

  // Expose methods to show different types of snackbars
  useImperativeHandle(ref, () => ({
    showError: (msg) => {
      setMessage(translateErrorMessage(msg));
      setSeverity("error");
      setOpen(true);
    },
    showWarning: (msg) => {
      setMessage(translateErrorMessage(msg));
      setSeverity("warning");
      setOpen(true);
    },
    showInfo: (msg) => {
      setMessage(translateErrorMessage(msg));
      setSeverity("info");
      setOpen(true);
    },
    showSuccess: (msg) => {
      setMessage(translateErrorMessage(msg));
      setSeverity("success");
      setOpen(true);
    },
  }));

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
});

export default ErrorSnackbar;
