import React from "react";
import PropTypes from "prop-types";
import { FormControl, TextField } from "@mui/material";
import { capitalizeWithExceptions } from "../../utility/TextUtils";

const AuthInput = ({
  id,
  label = "Label",
  value,
  onChangeFunction,
  type = "text",
  autoComplete = "",
  autoFocus = false,
}) => {
  return (
    <FormControl fullWidth>
      <TextField
        id={id}
        label={capitalizeWithExceptions(label)}
        margin="normal"
        value={value}
        onChange={onChangeFunction && ((e) => onChangeFunction(e.target.value))}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
    </FormControl>
  );
};

AuthInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeFunction: PropTypes.func,
  type: PropTypes.string,
  autoComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  autoFocus: PropTypes.bool,
};

export default AuthInput;
