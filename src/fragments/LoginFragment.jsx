import { Stack, TextField } from "@mui/material";
import React, { useState , useImperativeHandle} from "react";
import { useService } from "../contexts/ServiceContext.js";
import { useLoginString } from "../contexts/TextProvider.jsx";
import { doformatCUIL } from "../utiles.js";

/**
 * @brief Componente de logeo, permite al usuario iniciar seccion.
 */
const LoginFragment = React.forwardRef((props, ref) => {
  // Variables de texto
  const [labels] = useLoginString();
  // Servicios del backend
  const { authenticate } = useService();
  // Variables de estado
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFail, setLoginFail] = useState(false);
  const [passwordsd, setPassword] = useState("");
  const [formattedCUIL, setFormattedCUIL] = useState("");

  /**
   * @brief Gestiona los text field
   */
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    let formatted = doformatCUIL(inputValue);
    setFormattedCUIL(formatted);
  };
  /**
   * @brief Envia al usuario a la pantalla de recuperación de cuenta
   */
  const handleOnChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const getData = () => {
    authenticate(formattedCUIL, passwordsd);
    if (null == null) {
      setLoginFail(true);
    } else {
      setLoginFail(false);
      setLoginSuccess(true);
    }
  };

  useImperativeHandle(ref, () => ({
    getData,
  }));

  return (
    <>
      <Stack spacing={2}>
        <TextField
          sx={{
            width: "100%", 
            "@media (min-width: 600px)": {
              width: "25vw",
            },
          }}
          size="small"
          id="cuil"
          label={labels.textFieldLabels.user}
          required
          disabled={loginSuccess}
          helperText={"Sin '-', se agregan solos"}
          error={loginFail}
          value={formattedCUIL}
          onChange={handleInputChange}
          variant="standard"
        />
        <TextField
          sx={{
            width: "100%", 
            "@media (min-width: 600px)": {
              width: "25vw",
            },
          }}
          size="small"
          id="password"
          label={labels.textFieldLabels.password}
          type="password"
          required
          value={passwordsd}
          onChange={handleOnChangePassword}
          error={loginFail}
          disabled={loginSuccess}
          variant="standard"
        />
      </Stack>
    </>
  );
});

export default LoginFragment;
