import {
  Alert,
  Button,
  Card,
  CardActions,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmailVerify } from "../contexts/EmailVerifyContext";
import { useService } from "../contexts/ServiceContext";
import {
  useCommonsButtonString,
  useCommonsFieldString,
  useComponentEmailChangeString,
} from "../contexts/TextProvider.jsx";
import AlertFragment from "../fragments/AlertFragmet.jsx";
import ProcessAlert from "../fragments/ProcessAlert.jsx";
import { centerButtonsStyle } from "../theme.jsx";
import { handleCopyCut, handlePaste, sleep } from "../utiles.js";
import { m } from "framer-motion";
import Swal from "sweetalert2";

/**
 * @brief Componente que muestra el formulario de cambio de email.
 */
const EmailChange = () => {
  //todo: AGREGAR VALIDACIONES DE EMAIL Y CONTRASEÑA, GESTIONAR CUANDO SE ENVIA EL FORMULARIO Y MANEJAR LOS ERRORES BIEN
  //todo: AGREGAR AL BACKEND QUE NO SE PRODUZCA EL CAMBIO DE EMAIL EFECTIVO HASTA QUE SE VERIFIQUE EL EMAIL QUE SE ENVIA PARA EL CAMBIO
  //todo: AGREGAR UNA ALERTA ANTES DEL ENVIO DEL FORM QUE PREGUNTE SI VERDADERAMENTE SE QUIER CAMBIAR EL EMAIL
  //todo: AGREGAR RENOVACION DE TOKEN PARA QUE NO SE CIERRE LA SESION
  //! LAS VALIDACIONES DE EMAIL Y CONTRASEÑA ESTAN LISTAS, TAMBIEN ESTA LISTO EL CAMINO DE ERROR DEL CAMBIO
  //! FALTA EL CAMINO DE EXITO CON EL CORREO DE VERIFICACION Y POSTERIOR DESACTIVACION DE EMAILVERIFIED
  // Variables con los textos
  const emailchange = useComponentEmailChangeString();
  const commonbuttons = useCommonsButtonString();
  const commonfields = useCommonsFieldString();

  const navigate = useNavigate();

  // Servicios de backend
  const { User, setEmailUndefined } = useService();
  const { send_confirmation_email } = useEmailVerify();

  // Variables de estado
  const [formData, setFormData] = useState({
    email: "",
    reemail: "",
    password: "",
  });
  // Controlan el backdrop ProcessAlert
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [send, setSend] = useState(false);

  // controla que ls email sean iguales
  const [errorEmail, setErrorEmail] = useState(false);
  const [sendError, setSendError] = useState(false);

  useEffect(() => {
    if (User === null) {
      navigate("/");
    }
  }, [navigate, User]);

  /**
   * @brief Envia el email de confirmacion, y setea el estado de send y el loading
   */
  const sendEmail = async () => {
    try {
      const response = await send_confirmation_email(
        formData.password,
        formData.email
      );
      if (response) {
        setEmailUndefined();
      }
      setSend(response);
      setLoading(false);
      await sleep(1000);
      navigate("/ae/profile");
    } catch (error) {
      console.error("Error sending email:", error);
      await sleep(3000);
      setSend(false);
      setLoading(false);
      setOpen(false);
      setSendError(true);
    }
  };

  /**
   * @brief Se encarga de guardar los datos del formulario.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBack = () => {
    if (send) {
      setSend(false);
    } else {
      navigate(-1);
    }
  };

  /**
   * @brief Se encarga de verificar los emails y permitir setear las variables para poder permitir enviar el email.
   */
  const handleConfirm = async (e) => {
    e.preventDefault();
    if (formData.reemail === formData.email && formData.email !== "") {
      setErrorEmail(false);
      Swal.fire({
        title: "Estas seguro que los datos ingresados son correctos?",
        text: "Al aceptar recibirás un email de verificación en tu nuevo correo, si no lo verificas el cambio no se hará efectivo.",
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No",
        confirmButtonColor: "#198754",
      }).then((result) => {
        if (result.isDenied) return;
        if (result.isConfirmed) {
          setOpen(true);
          sendEmail();
        }
      });
    } else {
      setErrorEmail(true);
      setOpen(false);
    }
  };
  return (
    <Stack spacing={2} sx={{ mx: 3 }}>
      <AlertFragment
        type={"info"}
        title={emailchange.alert.info.title}
        body={emailchange.alert.info.body}
        strong={emailchange.alert.info.strong}
      />
      <AlertFragment
        type={"warning"}
        title={emailchange.alert.warning.title}
        body={emailchange.alert.warning.body}
        strong={emailchange.alert.warning.strong}
      />
      {!open && (
        <Card>
          <form onSubmit={handleConfirm}>
            <CardHeader title={"Cambiar Email"} sx={{}} />
            <Stack spacing={2} sx={{ px: 5, pb: 5 }}>
              <TextField
                name="email"
                variant="standard"
                value={formData.email}
                autoComplete="off"
                disabled={formData.send}
                onPaste={handlePaste}
                onCut={handleCopyCut}
                error={errorEmail}
                onChange={handleChange}
                label={`Nuevo ${commonfields.email}`}
                required
                type="email"
              />
              <TextField
                name="reemail"
                autoComplete="off"
                variant="standard"
                onPaste={handlePaste}
                onCut={handleCopyCut}
                error={errorEmail}
                value={formData.reemail}
                onChange={handleChange}
                label={commonfields.renewemail}
                required
                type="email"
              />
              <TextField
                name="password"
                autoComplete="new-password"
                variant="standard"
                error={errorEmail}
                value={formData.password}
                type="password"
                onChange={handleChange}
                label={commonfields.password}
                required
              />
              {errorEmail && (
                <Alert
                  severity="error"
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1rem",
                  }}
                >
                  Los Email deben ser iguales!
                </Alert>
              )}
              {sendError && (
                <Alert
                  severity="error"
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1rem",
                  }}
                >
                  Ha habido un error al procesar su solicitud, revise los datos
                  ingresados
                </Alert>
              )}
            </Stack>
            <CardActions sx={centerButtonsStyle}>
              <Button size="small" onClick={handleBack}>
                {commonbuttons.back}
              </Button>
              <Button size="small" type="submit">
                {commonbuttons.send}
              </Button>
            </CardActions>
          </form>
        </Card>
      )}
      <ProcessAlert open={open} loading={loading} success={send} />
    </Stack>
  );
};

export default EmailChange;
