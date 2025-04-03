import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const AuthTitle = ({ text }) => {
  return (
    <Typography
      variant="h3"
      sx={{
        fontWeight: "bold",
        mb: 10,
        textTransform: "capitalize",
        textAlign: "center",
      }}
    >
      {text}
    </Typography>
  );
};

AuthTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default AuthTitle;
