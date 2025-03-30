import { createContext, useContext, useRef } from "react";
import ErrorSnackbar from "./ErrorSnackbar";

const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {
  const snackbarRef = useRef();

  const showError = (message) => {
    if (snackbarRef.current) {
      snackbarRef.current.showError(message);
    }
  };

  const showWarning = (message) => {
    if (snackbarRef.current) {
      snackbarRef.current.showWarning(message);
    }
  };

  const showInfo = (message) => {
    if (snackbarRef.current) {
      snackbarRef.current.showInfo(message);
    }
  };

  const showSuccess = (message) => {
    if (snackbarRef.current) {
      snackbarRef.current.showSuccess(message);
    }
  };

  return (
    <ErrorContext.Provider value={{ showError, showWarning, showInfo, showSuccess }}>
      {children}
      <ErrorSnackbar ref={snackbarRef} />
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
