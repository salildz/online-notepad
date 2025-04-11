import { createContext, useContext, useState, useEffect } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // Delay spinner for better UX (300ms)
  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => setVisible(true), 300);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      <Backdrop
        open={visible}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
