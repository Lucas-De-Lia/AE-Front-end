import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Stack,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordService } from "../contexts/PasswordContext";
import { useService } from "../contexts/ServiceContext";
import {
  useCommonsButtonString,
  useComponentPasswordAlertString,
  useComponentPasswordChangeString,
} from "../contexts/TextProvider.jsx";
import PasswordFragment from "../fragments/PasswordFragment.jsx";
import ProcessAlert from "../fragments/ProcessAlert.jsx";
import {
  boxLoginSyle,
  cardLoginStyle,
  centerButtonsStyle,
  centeringStyles,
} from "../theme.jsx";
import { sleep } from "../utiles.js";

/**
 * @brief Permite cambiar la contraseña del usuario
 */
const PasswordChange = () => {
  //Variables de texto
  const commonbutton = useCommonsButtonString();
  const passwordchange = useComponentPasswordChangeString();
  const passwordalert = useComponentPasswordAlertString();

  const nav = useNavigate();
  // Service de backend
  const { User, setUser, setIsAuthenticated } = useService();
  const { change_user_password } = usePasswordService();
  // Referencias del password
  const ref = useRef(null);
  // Variables de estado
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (User === null) {
      nav("/");
    }
  }, [nav, User]);

  /**
   * @brief Se encarga de obtener las caontraseña, y gestionas los errores , y envia la peticion y setea las variables de
   * estado para mostrarlos en el componente con sus mensajes de error y existo.
   */
  const handleAccept = async (input) => {
    const { error, data } = ref.current.sendData(input); // obtengo los datos y error
    setError(error); // seteo el error
    if (!error) {
      // si no tiene error
      try {
        // envio la peticion
        const response = await change_user_password(data);
        setError(!response); // seteo el error
        setOpen(true); // muestro el alert
        setLoading(false); // seteo el loading
        await sleep(1000);
        if (response) {
          // deslogea el usuario ya que se cambio el dato
          setUser(null);
          setIsAuthenticated(false);
          nav("/auth/login", { replace: true });
        } else {
          setError(true);
          nav("/ae/profile");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setError(true);
      }
    }
  };

  const handleBack = () => {
    nav(-1);
  };

  return (
    <>
      <ProcessAlert open={open} loading={loading} success={!error} />
      {!open && (
        <Card sx={cardLoginStyle}>
          <CardHeader title={passwordchange.title} />
          <CardContent sx={boxLoginSyle}>
            <Stack spacing={2} sx={centeringStyles}>
              <PasswordFragment ref={ref} />
              <Collapse in={error}>
                <Alert
                  severity="error"
                  style={{ textAlign: "left", marginTop: "16px" }}
                >
                  <AlertTitle>
                    {passwordalert.info.requirements.title}
                  </AlertTitle>
                  <ul>
                    {passwordalert.info.requirements.body.map(
                      (lablel, index) => (
                        <li key={index}>{lablel}</li>
                      )
                    )}
                  </ul>
                </Alert>
              </Collapse>
            </Stack>
          </CardContent>
          <CardActions sx={centerButtonsStyle}>
            <Button size="small" onClick={handleBack} color="inherit">
              {commonbutton.back}
            </Button>
            <Button size="small" onClick={handleAccept}>
              {commonbutton.ok}
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default PasswordChange;
