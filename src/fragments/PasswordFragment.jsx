import { Stack, TextField } from "@mui/material";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useCommonsFieldString } from "../contexts/TextProvider.jsx";
import { testpassword } from "../utiles.js";
/**
 * @brief Fragmento que contiene dos campos de password encargado de gestionar su estado y eerror
 */
const PasswordFragment = forwardRef((props, ref) => {
  //Variables de texto
  const commonfields = useCommonsFieldString();
  //Variables de estado
  const [passwordChange, setPasswordChange] = useState({
    password: "",
    newps: "",
    renewps: "",
  });
  // Gestion de errores
  const [error, setError] = useState(false);

  /**
   * @brief Gestiona el cambio de los estados mediante los textfields.
   */
  const handleChange = (field, value) => {
    setPasswordChange((prev) => ({ ...prev, [field]: value }));
  };

  const sendData = () => {
    setError(!testpassword(passwordChange.newps, passwordChange.renewps));
    return {
      error,
      data: !error
        ? {
            current_password: passwordChange.password,
            new_password: passwordChange.newps,
            new_password_confirmation: passwordChange.renewps,
          }
        : null,
    };
  };

  useImperativeHandle(ref, () => ({
    sendData,
  }));
  return (
    <Stack spacing={1}>
      <TextField
        id="current-password"
        label={commonfields.oldpassword}
        size="small"
        required
        autoComplete="off"
        value={passwordChange.password}
        onChange={(event) => {
          handleChange("password", event.target.value);
        }}
        type="password"
        variant="standard"
      />
      <TextField
        id="new-password"
        label={commonfields.password}
        size="small"
        type="password"
        required
        autoComplete="off"
        error={error}
        value={passwordChange.newps}
        onChange={(event) => {
          handleChange("newps", event.target.value);
        }}
        variant="standard"
      />
      <TextField
        id="new-password-rep"
        label={commonfields.password}
        size="small"
        type="password"
        required
        autoComplete="off"
        error={error}
        value={passwordChange.renewps}
        onChange={(event) => {
          handleChange("renewps", event.target.value);
        }}
        variant="standard"
      />
    </Stack>
  );
});

export default PasswordFragment;
