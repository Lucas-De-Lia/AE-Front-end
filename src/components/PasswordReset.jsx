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
import React, { useState } from "react";
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
import { doformatCUIL, testpassword } from "../utiles.js";
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
  const [cuil, setCuil] = useState();
  const [password, setPassword] = useState();
  const [password_confirmation, setPasswordConfirmation] = useState();
  const [passwordError, setPasswordError] = useState(false);
  /**
   * @brief Maneja el cambio del CUIL
   */
  const handleCUILChange = (event) => {
    let cuilf = doformatCUIL(event.target.value);
    setCuil(cuilf);
  };
  /**
   * @brief Maneja el cambio de la contraseña
   */
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  /**
   * @brief Maneja el cambio de la confirmación de la contraseña
   */
  const handlePasswordConfirmationChange = (event) => {
    setPasswordConfirmation(event.target.value);
  };
  /**
   * @brief Envia los datos para cambiar la contraseña
   */
  const sendData = async () => {
    setSend(true);
    let result = null;
    try {
      result = send_reset_password(
        token,
        cuil,
        password,
        password_confirmation
      );
      setSuccess(result);
      setLoading(!result);
    } catch (error) {
      setSuccess(false);
      setLoading(false);
      setError(true);
    } finally {
      await Promise.all[result];
      setSend(false);
      navigate("/", { replace: true });
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
          <Card>
            <CardHeader title={passwordforgot.title} />
            <CardContent sx={cardLoginStyle}>
              <Stack spacing={2}>
                <TextField
                  size="small"
                  id="cuil"
                  label={commonfields.cuil}
                  required
                  disabled={null}
                  error={error}
                  value={cuil}
                  onChange={handleCUILChange}
                  variant="standard"
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
                  title={passwordreq.info.requirements.title}
                  body={passwordreq.info.requirements.body}
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
                size="small"
                sx={buttonTopStyle}
                onClick={sendData}
                disabled={send}
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
