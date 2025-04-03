import { Box, CircularProgress, Backdrop } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { setLoadingHandler } from "./Api";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setLoadingHandler(setFlag);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading: flag, setLoading: setFlag }}>
      {children}
      {flag && (
        <Backdrop
          open={flag}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
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
