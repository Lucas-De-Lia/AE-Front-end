import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCommonsButtonString,
  useCommonsFieldString,
  useComponentPasswordAlertString,
  useComponentPasswordForgotString,
} from "../contexts/TextProvider.jsx";

import { usePasswordService } from "../contexts/PasswordContext";
import AlertFragment from "../fragments/AlertFragmet.jsx";
import ProcessAlert from "../fragments/ProcessAlert.jsx";
import SixtysecFragment from "../fragments/SixtysecFragment.jsx";
import {
  boxLoginSyle,
  cardLoginStyle,
  centerButtonsStyle,
  centeringStyles,
} from "../theme.jsx";
import { dniFormatted } from "../utiles.js";
/**
 * @brief Se encarga de renderizar el formulario de recuperación de contraseña.
 */
const PasswordForgot = () => {
  // Variables de texto
  const commonbutton = useCommonsButtonString();
  const passwordforgot = useComponentPasswordForgotString();
  const passwordalert = useComponentPasswordAlertString();
  const commonfields = useCommonsFieldString();

  // Servicios del backend
  const { send_forgot_password_email } = usePasswordService();

  // Variables de estado
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [dni, setDni] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    if (send) {
      setSend(false);
    } else {
      navigate(-1);
    }
  };

  /**
   * @brief Se encarga de enviar la peticion al backend sin antes verificar el dni
   */
  const send_email = async () => {
    if (!dni.trim() || dni.length !== 8) {
      setError(true);
      return false;
    }
    try {
      const success = await send_forgot_password_email(dni);
      setSend(success);
      setError(!success);
      return success;
    } catch (error) {
      setError(true);
      return false;
    }
  };

  /**
   * @brief Se encarga de reenviar el email
   */
  const handleReSend = async () => {
    setOpen(true);
    setSend(false);
    setOpen(false);
    return await send_email();
  };

  /**
   * @brief Se encarga de verificar el dni
   */
  const handleDniChange = (event) => {
    setDni(dniFormatted(event.target.value));
  };

  return (
    <>
      <ProcessAlert open={open} loading={send} success={!error} />
      <Card sx={cardLoginStyle}>
        <CardHeader title={passwordforgot.title} />
        <CardContent sx={boxLoginSyle}>
          <Grid container spacing={3} sx={centeringStyles}>
            <Grid item>
              <TextField
                id="dni"
                size="small"
                label={commonfields.dni}
                required
                disabled={send ? "true" : undefined}
                error={error}
                value={dni}
                onChange={handleDniChange}
                variant="standard"
                helperText={"Obligatorio, 8 digitos"}
              />
            </Grid>
            <Grid item>
              {!send && (
                <AlertFragment
                  type={"info"}
                  title={passwordalert.info.verify.title}
                  body={passwordalert.info.verify.body}
                  strong={passwordalert.info.verify.strong}
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={centerButtonsStyle}>
          <Button size="small" onClick={handleBack} color="inherit">
            {commonbutton.back}
          </Button>
          <SixtysecFragment
            action={handleReSend}
            label={send ? commonbutton.resend : commonbutton.send}
          >
            <Button />
          </SixtysecFragment>
        </CardActions>
      </Card>
    </>
  );
};

export default PasswordForgot;
