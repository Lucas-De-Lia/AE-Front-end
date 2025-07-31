import {
  Box,
  Button,
  CardActions,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordService } from "../contexts/PasswordContext";
import {
  useCommonsButtonString,
  useCommonsFieldString,
  useComponentPasswordAlertString,
  useComponentPasswordForgotString,
} from "../contexts/TextProvider.jsx";
import AlertFragment from "../fragments/AlertFragmet.jsx";
import ProcessAlert from "../fragments/ProcessAlert.jsx";
import {
  buttonTopStyle,
  cardLoginStyle,
  centerButtonsStyle,
} from "../theme.jsx";
import { dniFormatted, testDni, testpassword } from "../utiles.js";
import { PasswordControl } from "./PasswordControl.jsx";
/**
 * @brief Componente para cambiar la contraseña un vez entra al link de recuperar contraseña
 */
const PasswordReset = () => {
  // Variables de textos
  const passwordreq = useComponentPasswordAlertString();
  const commonbuttons = useCommonsButtonString();
  const commonfields = useCommonsFieldString();
  const passwordforgot = useComponentPasswordForgotString();

  const navigate = useNavigate();

  // Servicios con el backend
  const { send_reset_password } = usePasswordService();

  // Variables de estado de alertas
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [send, setSend] = useState(false);

  //Variables de estado
  const token = new URLSearchParams(window.location.search).get("token");
  const [dni, setDni] = useState("");
  const [dniError, setDniError] = useState(false);
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  /**
   * @brief Maneja el cambio del DNI
   */
  const handleDNIChange = (event) => {
    setDni(dniFormatted(event.target.value));
    setDniError(testDni(dniFormatted(event.target.value)));
  };
  /**
   * @brief Maneja el cambio de la contraseña
   */
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordError(!testpassword(newPassword, password_confirmation));
  };
  /**
   * @brief Maneja el cambio de la confirmación de la contraseña
   */
  const handlePasswordConfirmationChange = (event) => {
    const newConfirmation = event.target.value;
    setPasswordConfirmation(newConfirmation);
    setPasswordError(!testpassword(password, newConfirmation));
  };
  /**
   * @brief Envia los datos para cambiar la contraseña
   */
  const sendData = async (e) => {
    e.preventDefault();
    if (
      passwordError ||
      dniError ||
      password.length === 0 ||
      password_confirmation.length === 0 ||
      dni.length === 0
    )
      return;
    setLoading(true);
    setSend(true);
    try {
      const result = await send_reset_password(
        token,
        dni,
        password,
        password_confirmation
      );
      setSuccess(result);
      setLoading(false);
      setTimeout(() => {
        navigate("/", { replace: true });
        setSend(false);
      }, 3000);
    } catch (error) {
      setSuccess(false);
      setLoading(false);
      setSend(true);
      setTimeout(() => {
        setSend(false); // ocultar ProcessAlert
        setError(true);
      }, 3000);
    }
  };

  return (
    <>
      {!send ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card component={"form"} onSubmit={sendData}>
            <CardHeader title={passwordforgot.title} />
            <CardContent sx={cardLoginStyle}>
              <Stack spacing={2}>
                <TextField
                  size="small"
                  id="dni"
                  label={commonfields.dni}
                  required
                  disabled={null}
                  error={dniError}
                  value={dni}
                  onChange={handleDNIChange}
                  variant="standard"
                  helperText={"Obligatorio, 8 dígitos"}
                />
                <TextField
                  id="password"
                  label={`Nueva ${commonfields.password.toLowerCase()}`}
                  size="small"
                  type="password"
                  required
                  autoComplete="off"
                  error={error}
                  value={password}
                  onChange={handlePasswordChange}
                  variant="standard"
                />
                <TextField
                  id="passwordres"
                  label={commonfields.repassword}
                  size="small"
                  type="password"
                  required
                  autoComplete="off"
                  error={error}
                  value={password_confirmation}
                  onChange={handlePasswordConfirmationChange}
                  variant="standard"
                />
                <PasswordControl
                  errors={passwordError}
                  password={password}
                  passrep={password_confirmation}
                />
              </Stack>
              {error && (
                <AlertFragment
                  type="error"
                  title={"Ha ocurrido un error al procesar su solicitud."}
                  body={[
                    "Revise si los datos ingresados son correctos",
                    "Si el problema persiste, vuelva a intentarlo más tarde.",
                  ]}
                />
              )}
            </CardContent>
            <CardActions sx={centerButtonsStyle}>
              <Button
                size="small"
                color="inherit"
                onClick={null}
                disabled={null}
              >
                {commonbuttons.cancel}
              </Button>
              <Button
                type="submit"
                size="small"
                sx={buttonTopStyle}
                disabled={send === true}
              >
                {commonbuttons.ok}
              </Button>
            </CardActions>
          </Card>
        </Box>
      ) : (
        <ProcessAlert open={send} loading={loading} success={success} />
      )}
    </>
  );
};

export default PasswordReset;
