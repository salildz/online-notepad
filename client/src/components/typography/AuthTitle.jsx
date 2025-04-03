import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { capitalizeWithExceptions } from "../../utility/TextUtils";

const AuthTitle = ({ text }) => {
  return (
    <Typography
      variant="h3"
      sx={{
        fontWeight: "bold",
        mb: 10,
        textAlign: "center",
      }}
    >
      {capitalizeWithExceptions(text)}
    </Typography>
  );
};

AuthTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default AuthTitle;
