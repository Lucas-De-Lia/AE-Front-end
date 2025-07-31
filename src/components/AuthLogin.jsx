import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCommonsButtonString,
  useCommonsFieldString,
  useComponentAuthLoginString,
} from "../contexts/TextProvider.jsx";
import {
  boxLoginSyle,
  buttonTopStyle,
  cardLoginStyle,
  centerButtonsStyle,
  centeringStyles,
  linksStyle,
} from "../theme.jsx";

import { TextField } from "@mui/material";

import { useService } from "../contexts/ServiceContext.js";
import ProcessAlert from "../fragments/ProcessAlert.jsx";
import { dniFormatted, sleep, testpassword } from "../utiles.js";

/**
 * @brief Componente que muestra el formulario de login.
 * @returns {JSX.Element}
 */
const AuthLogin = () => {
  // Variables con los textos
  const authloginlabels = useComponentAuthLoginString();
  const commonbuttons = useCommonsButtonString();
  const commonfields = useCommonsFieldString();

  // Servicios de backend
  const { User, authenticate } = useService();

  // Variables de estado
  //se encargarn de ontrolar los carteles de error
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFail, setLoginFail] = useState(false);
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");

  // controlan el backdrop y el loading
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * @brief Se encarga de guardar el dni y setear el estado de open y los errores .
   */
  //checkear esto -> creo que funcionaria bien
  const handleInputChange = (event) => {
    setDni(dniFormatted(event.target.value));
  };

  /**
   * @brief Se encarga de guardar la contraseña y setear el estado de open y los errores.
   */
  const handleOnChangePassword = (event) => {
    const password = event.target.value;
    setPassword(password);
  };

  // Si estoy logeado redirijo al profile
  React.useEffect(() => {
    if (User != null) {
      navigate("/ae/profile");
    }
  }, [User, navigate]);

  /**
   * @brief Se encarga de hacer la llamada al backend para autenticar y setea los mensajes de exito/error, luego redirige si todo sale bien.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setOpen(true);
    let result = await authenticate(dni, password); //! TENGO QUE CAMBIAR ESTO POR DNI DENTRO DE LA FUNCION authenticate
    setLoginSuccess(result);
    setLoginFail(!result);
    setLoading(false);

    if (result) {
      navigate("/ae/profile", {
        replace: true,
      });
    } else {
      // para que se pueda leer el cartel
      await sleep(3000);
      setOpen(false);
      setLoading(true);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <ProcessAlert open={open} success={loginSuccess} loading={loading} />
      <Card sx={cardLoginStyle}>
        <CardHeader
          titleTypographyProps={{ variant: "h6" }}
          avatar={<LockOpenIcon />}
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
              }}
            >
              <Typography variant="h6">{authloginlabels.title}</Typography>
            </Box>
          }
        />
        <Divider />
        <form onSubmit={handleLogin}>
          <CardContent
            sx={{
              ...boxLoginSyle,
              width: "100%",
              maxWidth: "25vw", // Limita el ancho máximo
              margin: "0 auto", // Centra horizontalmente
            }}
          >
            <Stack spacing={2}>
              <TextField
                sx={{
                  width: "100%",
                  "@media (min-width: 600px)": {
                    width: "25vw",
                  },
                }}
                size="small"
                id="dni"
                label={commonfields.dni}
                required
                disabled={loginSuccess}
                helperText={authloginlabels.helper_text.dni}
                error={loginFail}
                value={dni}
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
                label={commonfields.password}
                type="password"
                required
                value={password}
                onChange={handleOnChangePassword}
                error={loginFail}
                disabled={loginSuccess}
                variant="standard"
              />
              {loginFail && (
                <Alert severity="error">DNI o Contraseña incorrectos</Alert>
              )}
              <Link
                size="small"
                component="a"
                disabled={loginSuccess}
                sx={{ ...centeringStyles, padding: 1 }}
                underline="hover"
                onClick={() => {
                  navigate("/password/forgot");
                }}
                style={loginSuccess ? linksStyle : buttonTopStyle}
              >
                {authloginlabels.link_label.password}
              </Link>
              <Divider />

              <CardActions sx={centerButtonsStyle}>
                <Button
                  size="small"
                  color="inherit"
                  onClick={handleCancel}
                  disabled={loginSuccess}
                >
                  {commonbuttons.cancel}
                </Button>
                <Button
                  size="small"
                  sx={buttonTopStyle}
                  onClick={handleLogin}
                  disabled={loginSuccess}
                  type="submit"
                >
                  {commonbuttons.ok}
                </Button>
              </CardActions>
            </Stack>
          </CardContent>
        </form>
      </Card>
    </>
  );
};

export default AuthLogin;
