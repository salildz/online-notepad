import React from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";

const AuthContainer = ({ children }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {children}
    </Container>
  );
};

AuthContainer.propTypes = {
  children: PropTypes.node,
};

export default AuthContainer;
