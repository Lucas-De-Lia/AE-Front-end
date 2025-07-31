import { Backdrop, Paper, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmailVerify } from "../contexts/EmailVerifyContext";
import { useService } from "../contexts/ServiceContext";
import { useComponentEmailVerifyString } from "../contexts/TextProvider.jsx";
import AlertFragment from "../fragments/AlertFragmet.jsx";
import { sleep } from "../utiles.js";

/**
 * @brief Se visualiza cuando un entras al link de la verificacion de email
 */
const EmailVerify = () => {
  // Variables de texto
  const emailverifylabels = useComponentEmailVerifyString();

  const navigate = useNavigate();

  // Servicios del Backend
  const { isAuthenticated, setEmailVerified } = useService();
  const { send_confirmation_verify } = useEmailVerify();

  // Control de estado para mensajes de error y de carga
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Variables de URL
  const { id, hash } = useParams();
  const expires = new URLSearchParams(window.location.search).get("expires");
  const signature = new URLSearchParams(window.location.search).get(
    "signature"
  );

  /**
   * @abstract Se encarga de hacer la llamada al backend para verificar el email y setear todo para poder visualizar el resultado
   */
  const verifyEmail = useCallback(async () => {
    const result = null;
    try {
      const result = await send_confirmation_verify(
        id,
        hash,
        expires,
        signature
      );
      console.log(result);
      setSuccess(result);
      setEmailVerified();
    } catch (error) {
      setSuccess(false);
    } finally {
      setLoading(false);
      await sleep(2000);
      navigate("/", { replace: true });
    }
  }, [
    id,
    hash,
    expires,
    signature,
    setSuccess,
    setLoading,
    navigate,
    send_confirmation_verify,
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      verifyEmail();
    }
  }, [isAuthenticated]);

  return (
    <Backdrop open={true}>
      {loading ? (
        <Paper>
          <Stack
            padding={4}
            spacing={5}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CircularProgress />
            <Typography variant="body1">{emailverifylabels.loading}</Typography>
          </Stack>
        </Paper>
      ) : success && !loading ? (
        <AlertFragment
          type={"success"}
          title={emailverifylabels.title}
          body={emailverifylabels.alert.success.body}
          strong={emailverifylabels.alert.success.strong}
        />
      ) : (
        <AlertFragment
          type={"error"}
          title={emailverifylabels.title}
          body={emailverifylabels.alert.fail.body}
          strong={emailverifylabels.alert.fail.strong}
        />
      )}
    </Backdrop>
  );
};

export default EmailVerify;
