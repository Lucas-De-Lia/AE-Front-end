import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { useService } from "../contexts/ServiceContext";
export const VerifyAE = () => {
  const { verifyAeTrust } = useService();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");

  const verifyToken = async () => {
    try {
      const { isValid, user } = await verifyAeTrust(token);
      const { dni, nombre } = user;
      console.log(isValid);
      setIsValid(isValid);
      setName(nombre);
      setDni(dni);
      setIsLoading(false);
    } catch (e) {
      setIsValid(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return isLoading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: {
          xs: "flex-start",
          sm: "center",
          md: "center",
        },
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: {
            xs: "150px",
            sm: "200px",
            md: "300px",
          },
          height: {
            xs: "150px",
            sm: "200px",
            md: "300px",
          },
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CircularProgress />
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "98vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Card
        sx={{
          width: {
            md: "80%",
            xs: "95%",
            sm: "90%",
          },
        }}
      >
        <CardHeader
          title="Verificación de Autoexclusión"
          avatar={
            <SecurityIcon
              sx={{
                height: { xs: 30, sm: 35, md: 40 },
                width: { xs: 30, sm: 35, md: 40 },
              }}
            />
          }
          titleTypographyProps={{ variant: "h6" }}
        />
        <Divider sx={{ width: "100%" }} />
        <CardContent>
          {isValid ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: {
                    xs: 50,
                    sm: 60,
                    md: 70,
                  },
                  color: "success.main",
                  mb: 2,
                }}
              />
              <Typography variant="body1">
                El certificado es <strong>válido</strong> y fue emitido
                correctamente por el sistema de autoexclusión.
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Esta verificación confirma la autenticidad del certificado
                escaneado para <strong>{name}</strong>, DNI{" "}
                <strong>{dni}</strong>.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <CancelIcon
                sx={{
                  fontSize: {
                    xs: 50,
                    sm: 60,
                    md: 70,
                  },
                  color: "error.main",
                  mb: 2,
                }}
              />
              <Typography variant="body1">
                El certificado <strong>no es válido</strong> o el enlace de
                verificación ha expirado.
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Por favor, verifique que el enlace sea correcto o comuníquese
                con el emisor del certificado.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
